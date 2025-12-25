import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PaidBillsHeader } from "./PaidBillsHeader";
import { PaidBillsEmpty } from "./PaidBillsEmpty";
import { PaidBillsList } from "./PaidBillsList";

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
}

interface PaidBillsCardProps {
  bills: Bill[];
}

export const PaidBillsCard = memo(function PaidBillsCard({ bills }: PaidBillsCardProps) {
  const paidBills = bills.filter(b => b.status === "paid");

  return (
    <Card className="animate-fade-in [animation-delay:250ms] opacity-0">
      <PaidBillsHeader />
      <CardContent>
        {paidBills.length === 0 ? (
          <PaidBillsEmpty />
        ) : (
          <PaidBillsList bills={paidBills} />
        )}
      </CardContent>
    </Card>
  );
});
