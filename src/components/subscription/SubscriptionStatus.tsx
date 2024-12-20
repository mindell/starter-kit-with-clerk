'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionStatusProps {
  planName: string;
  endDate?: Date | null;
  amount: number;
  planSlug: string;
}

export function SubscriptionStatus({
  planName,
  endDate,
  amount,
  planSlug,
}: SubscriptionStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      toast({
        title: "Success",
        description: "Your subscription has been cancelled.",
      });

      // Refresh the page to update subscription status
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Subscription Status</CardTitle>
          <Badge variant={planSlug === 'free' ? 'default' : 'secondary'}>
            {planName}
          </Badge>
        </div>
        <CardDescription>Your current plan and subscription details</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Plan</p>
            <p className="text-lg font-semibold">{planName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Price</p>
            <p className="text-lg font-semibold">
              ${amount}/month
            </p>
          </div>
          {endDate && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next billing date</p>
              <p className="text-lg font-semibold">
                {new Date(endDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/pricing">
              {planSlug === 'free' ? 'View Plans' : 'Change Plan'}
            </Link>
          </Button>
          {planSlug !== 'free' && (
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
