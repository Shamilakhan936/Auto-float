import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { format, addDays } from "date-fns";

interface NextPaymentCardProps {
  daysUntilSettlement: number;
  accessUsed: number;
}

export const NextPaymentCard = memo(function NextPaymentCard({ daysUntilSettlement, accessUsed }: NextPaymentCardProps) {
  return (
    <Card className="animate-fade-in [animation-delay:100ms] opacity-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Next Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {format(addDays(new Date(), daysUntilSettlement), "MMM d")}
            </p>
            <p className="text-sm text-muted-foreground">{daysUntilSettlement} days away</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Amount due</span>
            <span className="text-lg font-semibold text-foreground">${accessUsed.toLocaleString()}</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Balance clears automatically via ACH on payment date.
        </p>
      </CardContent>
    </Card>
  );
});


