import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";

interface UpcomingBillsEmptyProps {
  onAddBill: () => void;
}

export function UpcomingBillsEmpty({ onAddBill }: UpcomingBillsEmptyProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <CreditCard className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground mb-4">No upcoming bills</p>
      <Button variant="accent" onClick={onAddBill}>
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Bill
      </Button>
    </div>
  );
}


