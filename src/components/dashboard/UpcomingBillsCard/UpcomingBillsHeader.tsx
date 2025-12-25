import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface UpcomingBillsHeaderProps {
  onAddBill: () => void;
}

export function UpcomingBillsHeader({ onAddBill }: UpcomingBillsHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Upcoming Bills</CardTitle>
          <CardDescription>Your scheduled and pending bill payments</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onAddBill}>
          Add Bill
          <Plus className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </CardHeader>
  );
}


