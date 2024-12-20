import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {prisma} from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's subscription from database
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription) {
      return new NextResponse('No subscription found', { status: 404 });
    }

    if (!subscription.subscriptionId) {
      return new NextResponse('No Stripe subscription ID found', { status: 400 });
    }
    /*
       const subscriptionDetails = await stripe.subscriptions.retrieve(subscription.subscriptionId);
        console.log('Subscription details:', {
        id: subscriptionDetails.id,
        status: subscriptionDetails.status,
        created: new Date(subscriptionDetails.created * 1000).toLocaleString(),
        currentPeriodEnd: new Date(subscriptionDetails.current_period_end * 1000).toLocaleString()
    });
    */
    // Cancel the subscription in Stripe
    await stripe.subscriptions.cancel(subscription.subscriptionId);

    // Update subscription in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        planId: 'free',
        cancelledAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
