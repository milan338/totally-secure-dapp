import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { nanoid } from 'nanoid';
import { rateLimit } from 'util/rate-limit';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResData = {
    contractAddress?: string;
    id?: string;
    error?: string;
};

const rateLimiter = rateLimit({
    interval: 60000,
    uniqueTokensPerInterval: 500,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResData>) {
    const { address } = req.query;
    try {
        await rateLimiter.check(res, 5, 'CACHE_TOKEN'); // 5 requests per minute
    } catch {
        res.status(429).json({ error: 'Rate limit exceeded' });
        return;
    }
    if (Array.isArray(address)) {
        res.status(400).json({ error: 'Invalid address' });
        return;
    }
    try {
        admin.initializeApp({
            credential: admin.credential.cert(
                JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY ?? '')
            ),
        });
    } catch {}
    const db = admin.firestore();
    const users = db.collection('users').doc('contracts');
    if (!users) {
        res.status(500).json({ error: 'Failed to load users' });
        return;
    }
    let userContract = (await users.get()).get(address);
    if (userContract === undefined) {
        const contractsData = db.collection('contracts').doc('data');
        if (!contractsData) {
            res.status(500).json({ error: 'Failed to load contracts' });
            return;
        }
        const contracts = (await contractsData.get()).get('contracts');
        const i = (await contractsData.get()).get('i');
        userContract = contracts[i];
        if (userContract === undefined) {
            res.status(500).json({ error: 'Out of contracts' });
            return;
        }
        contractsData.update({
            i: FieldValue.increment(1),
        });
        users.set(
            {
                [address.toLowerCase()]: userContract,
            },
            { merge: true }
        );
    }
    const ids = db.collection('users').doc('ids');
    if (!ids) {
        res.status(500).json({ error: 'Failed to load ids' });
        return;
    }
    let id = (await ids.get()).get(address);
    if (id === undefined) {
        id = nanoid();
        ids.set({ [address.toLowerCase()]: id }, { merge: true });
    }
    res.status(200).json({ contractAddress: userContract, id: id });
}
