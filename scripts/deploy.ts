import serviceAccount from '../serviceAccountKey.json';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { nanoid } from 'nanoid';
import { ethers } from 'hardhat';

const N_DEPLOYMENTS = 5;

async function main() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
    });
    const db = admin.firestore();
    const contractsData = db.collection('contracts').doc('data');
    const TotallySecureDapp = await ethers.getContractFactory('TotallySecureDapp');
    for (let i = 0; i < N_DEPLOYMENTS; i++) {
        const id = nanoid();
        const totallySecureDapp = await TotallySecureDapp.deploy();
        await totallySecureDapp.deployed();
        await totallySecureDapp.initialize(id);
        contractsData.update({
            contracts: FieldValue.arrayUnion(totallySecureDapp.address),
        });
        console.log(`Deployed number ${i} at addr ${totallySecureDapp.address}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
