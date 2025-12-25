import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function PaidBillsHeader() {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Paid Bills</CardTitle>
          <CardDescription>Bills that have been completed</CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}


