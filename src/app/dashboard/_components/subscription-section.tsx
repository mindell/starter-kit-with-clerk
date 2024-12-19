import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { fetchPlan } from "@/lib/strapi";
async function getSubscriptionData() {
  const { userId } = await auth();
  if (!userId) return null;
  
  let subscription = await prisma.subscription.findFirst({
    where: { userId },
  });
  if(!subscription) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      subscription =  await prisma.subscription.create({
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
  const plan = await fetchPlan(subscription.planId);
  if (plan) {
    return {
      planName: plan.name || 'Free',
      status: subscription.status || 'FREE',
      endDate: subscription.endDate,
      amount: plan.price || 0,
    };
  }
  return null;
}

export async function SubscriptionSection() {
  const subscription = await getSubscriptionData();
  
  if (!subscription) {
    return (
      <div className="max-w-md">
        <SubscriptionStatus
          planName="Free"
          status="FREE"
          amount={0}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <SubscriptionStatus {...subscription} />
    </div>
  );
}
