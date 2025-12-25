import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { categoryIcons } from "../categoryIcons";

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
}

interface PaidBillItemProps {
  bill: Bill;
}

export function PaidBillItem({ bill }: PaidBillItemProps) {
  const IconComponent = categoryIcons[bill.category] || CreditCard;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
          <IconComponent className="h-6 w-6 text-success" />
        </div>
        <div>
          <p className="font-medium text-foreground">{bill.name}</p>
          <p className="text-sm text-muted-foreground">
            {bill.category} • {format(new Date(bill.due_date), "MMM d")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-lg font-semibold text-foreground">${bill.amount}</p>
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </Badge>
      </div>
    </div>
  );
}


