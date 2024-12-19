import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
   
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
      console.log('[SUBSCRIPTION_GET] Fetching subscription for userId:', userId);
      let currentSubscription = await prisma.subscription.findFirst({
        where: {
          userId,
        },
      });
      
      console.log('[SUBSCRIPTION_GET] Current subscription value:', JSON.stringify(currentSubscription, null, 2));
      
      // If no subscription exists, create a free plan subscription
      if (!currentSubscription) {
        console.log('[SUBSCRIPTION_GET] No subscription found, creating free plan');
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);

        try {
          currentSubscription = await prisma.subscription.create({
            data: {
              userId,
              planId: 'free',
              status: 'ACTIVE',
              startDate,
              endDate,
              billingInterval: 'MONTHLY',
              amount: 0,
              currency: 'USD',
            },
          });
          
          console.log('[SUBSCRIPTION_GET] Created subscription:', JSON.stringify(currentSubscription, null, 2));
        } catch (createError) {
          console.error('[SUBSCRIPTION_CREATE_ERROR]', createError);
          return new NextResponse(
            JSON.stringify({ error: 'Failed to create subscription' }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      if (!currentSubscription) {
        return new NextResponse(
          JSON.stringify({ error: 'Subscription not found and could not be created' }), 
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Let's ensure we're sending a valid object
      const responseData = currentSubscription ? { subscription: currentSubscription } : { subscription: null };
      return NextResponse.json(responseData);
    } catch (error) {
      console.error("[SUBSCRIPTION_GET_ERROR]", error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("[SUBSCRIPTION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
