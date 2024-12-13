import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fetchPlan } from '@/lib/strapi';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { planSlug } = await req.json();
    
    // Get plan details from Strapi
    const plan = await fetchPlan(planSlug);
    
    if (!plan) {
      return new NextResponse('Plan not found', { status: 404 });
    }

    // Don't create checkout session for free plan
    if (planSlug === 'free') {
      return new NextResponse('Cannot create checkout session for free plan', { status: 400 });
    }

    const stripePriceId = plan.stripePriceId;

    if (!stripePriceId) {
      return new NextResponse('Invalid plan configuration', { status: 400 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.emailAddresses[0].emailAddress, // You might want to get actual email from Clerk
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        planSlug,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Subscription error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
