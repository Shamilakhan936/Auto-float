import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UpcomingBillsHeader } from "./UpcomingBillsHeader";
import { UpcomingBillsEmpty } from "./UpcomingBillsEmpty";
import { UpcomingBillsList } from "./UpcomingBillsList";
import { categoryIcons } from "../categoryIcons";

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
}

interface UpcomingBillsCardProps {
  bills: Bill[];
  onAddBill: () => void;
}

export function UpcomingBillsCard({ bills, onAddBill }: UpcomingBillsCardProps) {
  const upcomingBills = bills.filter(b => b.status !== "paid");

  return (
    <Card className="animate-fade-in [animation-delay:200ms] opacity-0">
      <UpcomingBillsHeader onAddBill={onAddBill} />
      <CardContent>
        {upcomingBills.length === 0 ? (
          <UpcomingBillsEmpty onAddBill={onAddBill} />
        ) : (
          <UpcomingBillsList bills={upcomingBills} />
        )}
      </CardContent>
    </Card>
  );
}
