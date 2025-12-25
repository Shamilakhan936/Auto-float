import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface Plan {
  name: string;
  price: number;
}

interface PaymentStepProps {
  currentPlan: Plan | undefined;
  onEnterCardDetails: () => void;
  onSkip: () => void;
}

export function PaymentStep({
  currentPlan,
  onEnterCardDetails,
  onSkip,
}: PaymentStepProps) {
  const totalDue = currentPlan ? ((currentPlan.price) + ((currentPlan.price) / 2)).toFixed(2) : "0.00";
  const firstTwoInstallments = currentPlan ? ((currentPlan.price) / 2).toFixed(2) : "0.00";

  return (
    <Card className="animate-scale-in">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <CreditCard className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">Payment</CardTitle>
        <CardDescription className="text-sm">
          Pay for your subscription to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Summary */}
        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-medium text-foreground">{currentPlan?.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Monthly Fee</span>
            <span className="font-medium text-foreground">${currentPlan?.price}/mo</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">First 2 Installments</span>
            <span className="font-medium text-foreground">${firstTwoInstallments}</span>
          </div>
          <hr className="border-border" />
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Total Due Today</span>
            <span className="font-bold text-accent text-lg">${totalDue}</span>
          </div>
        </div>

        <Button
          variant="accent"
          className="w-full"
          onClick={onEnterCardDetails}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Enter Card Details
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={onSkip}
        >
          Skip for now
        </Button>
      </CardContent>
    </Card>
  );
}

