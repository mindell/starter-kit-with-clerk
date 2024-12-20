import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  
  // Get user ID from metadata
  const userId = session.metadata?.userId as string;
  const planId = session.metadata?.planSlug as string;
  // Create or update subscription in database
  try{
    
     await prisma.subscription.upsert({
      where: {
          userId: userId
      },
      update: {
        planId,
        startDate: new Date(subscription.current_period_start * 1000),
        endDate: new Date(subscription.current_period_end * 1000),
        billingInterval: subscription.items.data[0].price.recurring?.interval.toUpperCase() === 'MONTH' ? 'MONTHLY' : 'YEARLY',
        amount: subscription.items.data[0].price.unit_amount! / 100,
        currency: subscription.currency.toUpperCase(),
        nextBillingDate: new Date(subscription.current_period_end * 1000),
        subscriptionId: session.subscription as string,
      },
      create: {
        userId,
        planId,
        startDate: new Date(subscription.current_period_start * 1000),
        endDate: new Date(subscription.current_period_end * 1000),
        billingInterval: subscription.items.data[0].price.recurring?.interval.toUpperCase() === 'MONTH' ? 'MONTHLY' : 'YEARLY',
        amount: subscription.items.data[0].price.unit_amount! / 100,
        currency: subscription.currency.toUpperCase(),
        nextBillingDate: new Date(subscription.current_period_end * 1000),
        subscriptionId: session.subscription as string,
      },
    });
    
  }
  catch (error) {
    console.error('Error creating/updating subscription:', error);
    throw error; // Re-throw the error so it can be caught by the outer try-catch
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const planId = subscription.metadata.planSlug;
  
  await prisma.subscription.updateMany({
    where: {
      userId,
      planId,
    },
    data: {
      planId: 'free',
      cancelledAt: new Date(),
    },
  });
}

async function handleInvoiceFinalized(invoice: Stripe.Invoice) {
  // sleep 5 seconds to avoid race conditions of new subscription
  await new Promise(resolve => setTimeout(resolve, 5000));
  const subscription = await prisma.subscription.findFirst({
    where: {
      subscriptionId: invoice.subscription as string,
    },
  });
  
  if (!subscription) {
    throw new Error('Subscription not found for invoice');
  }

  await prisma.invoice.create({
    data: {
      subscriptionId: subscription.id,
      amount: invoice.amount_due / 100,
      currency: invoice.currency.toUpperCase(),
      status: 'pending',
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : new Date(),
      invoiceNumber: invoice.number!,
      billingPeriodStart: new Date(invoice.period_start * 1000),
      billingPeriodEnd: new Date(invoice.period_end * 1000),
    },
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // sleep 5 seconds to avoid race conditions of new subscription
  await new Promise(resolve => setTimeout(resolve, 5000));
  const subscription = await prisma.subscription.findFirst({
    where: {
      subscriptionId: invoice.subscription as string,
    },
  });

  if (!subscription) {
    throw new Error('Subscription not found for invoice');
  }

  // Update invoice status
  await prisma.invoice.update({
    where: {
      invoiceNumber: invoice.number!,
    },
    data: {
      status: 'paid',
      paidAt: new Date(),
    },
  });

  // Update subscription dates
  await prisma.subscription.update({
    where: {
      id: subscription.id,
    },
    data: {
      endDate: new Date(invoice.period_end * 1000),
      lastBillingDate: new Date(),
      nextBillingDate: new Date(invoice.period_end * 1000),
    },
  });
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      subscriptionId: invoice.subscription as string,
    },
  });

  if (!subscription) {
    throw new Error('Subscription not found for invoice');
  }

  // Update invoice status
  await prisma.invoice.update({
    where: {
      invoiceNumber: invoice.number!,
    },
    data: {
      status: 'failed',
    },
  });
  // TODO: specific business rules here.

}

export async function POST(req: Request) {
  const body = await req.text();
  const headrs = await headers();
  const signature = headrs.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
  }
  
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.finalized':
        await handleInvoiceFinalized(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handleInvoiceFailed(event.data.object as Stripe.Invoice);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
