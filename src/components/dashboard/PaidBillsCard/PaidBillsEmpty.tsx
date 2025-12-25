import { CheckCircle2 } from "lucide-react";

export function PaidBillsEmpty() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">No paid bills yet</p>
      <p className="text-xs text-muted-foreground mt-1">
        Bills will appear here once paid
      </p>
    </div>
  );
}


