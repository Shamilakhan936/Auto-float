import { DollarSign } from "lucide-react";

export function PaymentPlanEmpty() {
  return (
    <div className="text-center py-6">
      <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground">No active payment plans</p>
      <p className="text-xs text-muted-foreground mt-1">
        Add a bill to create a payment plan
      </p>
    </div>
  );
}


