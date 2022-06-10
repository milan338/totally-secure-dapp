import { Contract, getDefaultProvider } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { TotallySecureDapp__factory as factory } from 'ethtypes/factories/TotallySecureDapp__factory';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { TotallySecureDapp } from 'ethtypes/TotallySecureDapp';

type ReqData = {
    userAdddress: string;
    contractAddress: string;
};

type ResData = {
    flag?: string;
    error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResData>) {
    const { userAdddress, contractAddress } = req.body as ReqData;
    try {
        const provider = getDefaultProvider('ropsten', {
            etherscan: process.env.ETHERSCAN_API_KEY,
        });
        const contract = new Contract(contractAddress, factory.abi, provider) as TotallySecureDapp;
        const owner = await contract._owner();
        const flagCaptured = await contract._flagCaptured();
        const balance = await provider.getBalance(contractAddress);
        if (owner === userAdddress && flagCaptured && balance.gt(parseEther('0.005'))) {
            const flag = process.env.FLAG;
            res.status(200).json({ flag: flag });
        } else {
            res.status(401).json({ error: 'Unauthorised' });
        }
    } catch {
        res.status(500).json({
            error: 'Internal error. Were the correct user and contract addresses supplied?',
        });
    }
}
