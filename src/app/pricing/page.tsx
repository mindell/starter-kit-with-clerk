'use client'
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { PricingCard } from "@/components/pricing/PricingCard";

type Subscription = {
  id: string;
  userId: string;
  status: string;
  plan: {
    id: string;
    name: string;
    price: number;
  } | null;
}

const pricingPlans = [
  {
    name: "Free",
    description: "Basic features for small projects",
    price: 0,
    features: [
      "Basic Notifications",
      "1 Virtual Event per month",
      "Community support",
      "Basic analytics",
    ],
  },
  {
    name: "Pro",
    description: "Everything you need for growing projects",
    price: 15,
    popular: true,
    features: [
      "Advanced Notifications",
      "5 Virtual Events per month",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
    ],
  },
  {
    name: "Enterprise",
    description: "Advanced features for large scale operations",
    price: 60,
    features: [
      "Unlimited Notifications",
      "Unlimited Virtual Events",
      "24/7 Priority support",
      "Advanced analytics & reporting",
      "Custom branding",
      "API access",
      "Custom integrations",
    ],
  },
];

function PricingPage() {
  const { userId, isLoaded } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !userId) {
      redirect("/");
    }
  }, [isLoaded, userId]);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscriptions/current');
        if (response.ok) {
          const data = await response.json();
          setCurrentSubscription(data);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSubscription();
    }
  }, [userId]);

  const handleSubscribe = async (price: number) => {
    if (price === 0) {
      // Handle free tier subscription
      return;
    }
    
    // Redirect to subscription page with plan details
    redirect(`/subscription?price=${price}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h1>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Choose the right plan for&nbsp;you
        </p>
      </div>
      <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.name}
            {...plan}
            currentPlan={currentSubscription?.plan?.price === plan.price}
            onSubscribe={() => handleSubscribe(plan.price)}
          />
        ))}
      </div>
    </div>
  );
}

export default PricingPage;
