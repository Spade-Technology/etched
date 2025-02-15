import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from "@clerk/backend"

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token, userId } = req.body;
    console.log(`Request from ${req.socket?.remoteAddress} userId ${userId}`);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    if (!token || !userId) {
        return res.status(400).json({ error: 'Missing token or userId' });
    }

    try {
        if (!CLERK_SECRET_KEY) {
            throw new Error('Clerk secret key is not set');
        }

        const verifiedUser = await verifyToken(token, {
            secretKey: CLERK_SECRET_KEY,
        });

        if (verifiedUser.sub.toLowerCase() !== userId.toLowerCase()) {
            return res.status(401).json({ error: 'User ID mismatch' });
        }


        return res.json({ valid: true, verifiedUser });
    } catch (error: any) {
        console.error('Verification error:', error);
        return res.status(401).json({ valid: false, error: error.message });
    }
}
