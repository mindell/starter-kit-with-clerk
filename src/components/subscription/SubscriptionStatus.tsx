import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SubscriptionStatusProps {
  planName: string;
  status: string;
  endDate?: Date;
  amount: number;
}

export function SubscriptionStatus({
  planName,
  status,
  endDate,
  amount,
}: SubscriptionStatusProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Subscription Status</CardTitle>
          <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
            {status}
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
        <Button asChild>
          <Link href="/pricing">
            {status === 'ACTIVE' ? 'Change Plan' : 'View Plans'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
