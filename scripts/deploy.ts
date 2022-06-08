import serviceAccount from '../serviceAccountKey.json';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { ethers, upgrades } from 'hardhat';

const N_DEPLOYMENTS = 5;

async function main() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
    });
    const db = admin.firestore();
    const contractsData = db.collection('contracts').doc('data');
    const TotallySecureDapp = await ethers.getContractFactory('TotallySecureDapp');
    for (let i = 0; i < N_DEPLOYMENTS; i++) {
        const totallySecureDapp = await upgrades.deployProxy(TotallySecureDapp, ['id']);
        await totallySecureDapp.deployed();
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
