import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getAuth } from '@clerk/nextjs/server';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { session_id } = req.query;

        if (!session_id || typeof session_id !== 'string') {
            return res.status(400).json({ error: 'Missing session ID' });
        }

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // Check if the session belongs to the current user
        if (session.metadata?.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        return res.status(200).json({
            status: session.payment_status,
            customer: session.customer,
            credits: session.metadata?.credits,
        });
    } catch (error) {
        console.error('Error checking session status:', error);
        return res.status(500).json({ error: 'Failed to check session status' });
    }
} 