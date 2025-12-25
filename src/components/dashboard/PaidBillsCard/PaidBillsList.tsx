import { PaidBillItem } from "./PaidBillItem";

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
}

interface PaidBillsListProps {
  bills: Bill[];
}

export function PaidBillsList({ bills }: PaidBillsListProps) {
  return (
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {bills.map((bill) => (
        <PaidBillItem key={bill.id} bill={bill} />
      ))}
    </div>
  );
}


