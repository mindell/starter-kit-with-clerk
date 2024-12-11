'use client'
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getStripeCustomerId, createCheckoutSession } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PRICE_IDS: { [key: string]: string } = {
  '15': 'price_XXXXX', // Replace with your Stripe price ID for $15 plan
  '60': 'price_XXXXX', // Replace with your Stripe price ID for $60 plan
};

async function SubscriptionPage({
  searchParams,
}: {
  searchParams: { price: string };
}) {
  const { userId, isLoaded } = useAuth();
  
  if (isLoaded && !userId) {
    redirect("/");
  }

  const price = searchParams.price;
  if (!price || !PRICE_IDS[price]) {
    redirect("/pricing");
  }

  const handleSubscribe = async () => {
    const customerId = await getStripeCustomerId(userId as string);
    
    const session = await createCheckoutSession({
      priceId: PRICE_IDS[price],
      customerId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });

    if (session.url) {
      redirect(session.url);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Confirm Your Subscription</CardTitle>
          <CardDescription>
            You're about to subscribe to our ${price}/month plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You will be redirected to Stripe to complete your payment securely.
            Your subscription will start immediately after successful payment.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubscribe} className="w-full">
            Proceed to Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SubscriptionPage;
