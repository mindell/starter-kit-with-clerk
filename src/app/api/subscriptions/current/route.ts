import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let currentSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
      },
    });

    // If no subscription exists, create a free plan subscription
    if (!currentSubscription) {
      const startDate = new Date();
      // Set end date to 1 year from now for free plan
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);

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
    }

    return NextResponse.json(currentSubscription);
  } catch (error) {
    console.error("[SUBSCRIPTION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
