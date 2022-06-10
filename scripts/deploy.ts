import serviceAccount from '../serviceAccountKey.json';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { nanoid } from 'nanoid';
import type { HardhatRuntimeEnvironment } from 'hardhat/types';

export async function deploy(taskArgs: { instances: number }, hre: HardhatRuntimeEnvironment) {
    const { instances } = taskArgs;
    const { ethers } = hre;
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
    });
    const db = admin.firestore();
    const contractsData = db.collection('contracts').doc('data');
    const TotallySecureDapp = await ethers.getContractFactory('TotallySecureDapp');
    for (let i = 0; i < instances; i++) {
        const id = nanoid();
        console.log(`Deploying number ${i} with id ${id}`);
        const totallySecureDapp = await TotallySecureDapp.deploy();
        await totallySecureDapp.deployed();
        await totallySecureDapp.initialize(id);
        console.log(`Deployed number ${i} with id ${id} at addr ${totallySecureDapp.address}`);
        await contractsData.update({
            contracts: FieldValue.arrayUnion(totallySecureDapp.address),
        });
    }
    console.log('Finished');
}
