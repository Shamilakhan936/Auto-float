import { Badge } from "@/components/ui/badge";
import { Clock, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { categoryIcons } from "../categoryIcons";
import { UpcomingBillItem } from "./UpcomingBillItem";

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
}

interface UpcomingBillsListProps {
  bills: Bill[];
}

export function UpcomingBillsList({ bills }: UpcomingBillsListProps) {
  return (
    <div className="space-y-4">
      {bills.map((bill) => (
        <UpcomingBillItem key={bill.id} bill={bill} />
      ))}
    </div>
  );
}


