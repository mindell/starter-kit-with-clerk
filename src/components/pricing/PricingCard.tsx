import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
  currentPlan?: boolean;
  onSubscribe: () => void;
}

export function PricingCard({
  name,
  description,
  price,
  features,
  popular,
  currentPlan,
  onSubscribe,
}: PricingCardProps) {
  return (
    <Card className={cn(
      "flex flex-col",
      popular && "border-primary shadow-lg"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {name}
          {currentPlan && (
            <span className="text-sm font-normal text-primary">Current Plan</span>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 flex-1">
        <div className="text-3xl font-bold">
          ${price}
          <span className="text-sm font-normal text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={popular ? "default" : "outline"}
          onClick={onSubscribe}
          disabled={currentPlan}
        >
          {currentPlan ? "Current Plan" : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
}
