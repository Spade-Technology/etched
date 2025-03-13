import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { addCreditsToUser } from '@/server/etched-credit-management';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// Disable the default body parser to get the raw body
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get the raw body
        const rawBody = await buffer(req);
        const signature = req.headers['stripe-signature'] as string;

        if (!signature) {
            return res.status(400).json({ error: 'Missing stripe-signature header' });
        }

        // Verify the webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Handle the event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            // Make sure the payment was successful
            if (session.payment_status === 'paid') {
                const { userId, credits } = session.metadata || {};

                if (userId && credits) {
                    // Add credits to the user
                    const result = await addCreditsToUser(userId, Number(credits));

                    if (!result.success) {
                        console.error('Failed to add credits to user:', result.error);
                        return res.status(500).json({ error: 'Failed to add credits to user' });
                    }

                    console.log(`Successfully added ${credits} credits to user ${userId}`);
                }
            }
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return res.status(500).json({ error: 'Failed to handle webhook' });
    }
} 