import { CreditCard } from "lucide-react";

export function ManageBankEmpty() {
  return (
    <div className="text-center py-6">
      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground">No bank account connected</p>
    </div>
  );
}


