import serviceAccount from '../../../serviceAccountKey.json';
import abi from '../../../abi.json';
import admin from 'firebase-admin';
import { Contract, getDefaultProvider } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    flag?: string;
    error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { address } = req.query;
    if (Array.isArray(address)) {
        res.status(400).json({ error: 'Invalid address' });
        return;
    }
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as any),
        });
    } catch {}
    const db = admin.firestore();
    const users = db.collection('users').doc('contracts');
    if (!users) {
        res.status(500).json({ error: 'Failed to load users' });
        return;
    }
    const userContractAddr = (await users.get()).get(address);
    if (userContractAddr === undefined) {
        res.status(400).json({
            error: 'You have not started the challenge yet. Please connect your wallet to the site.',
        });
        return;
    }
    const provider = getDefaultProvider('ropsten', { etherscan: process.env.ETHERSCAN_API_KEY });
    const contract = new Contract(userContractAddr, abi, provider);
    const owner = await contract._owner();
    const flagCaptured = await contract._flagCaptured();
    const balance = await provider.getBalance(userContractAddr);
    if (owner === address && flagCaptured && parseEther(balance.toString()).gt(0.005)) {
        const flag = process.env.FLAG;
        res.status(200).json({ flag: flag });
    } else {
        res.status(401).json({ error: 'Unauthorised' });
    }
}
