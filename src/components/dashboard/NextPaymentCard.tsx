import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { format, addDays } from "date-fns";

interface PaymentInstallment {
  id: string;
  amount: number;
  due_date: string;
  status: string;
}

interface NextPaymentCardProps {
  daysUntilSettlement: number;
  nextInstallment: PaymentInstallment | null;
  totalOutstanding: number;
}

export function NextPaymentCard({ daysUntilSettlement, nextInstallment, totalOutstanding }: NextPaymentCardProps) {
  const hasUpcoming = nextInstallment !== null;
  const nextDate = hasUpcoming 
    ? new Date(nextInstallment.due_date)
    : addDays(new Date(), daysUntilSettlement);

  return (
    <Card className="animate-fade-in [animation-delay:100ms] opacity-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Next Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            hasUpcoming ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
          }`}>
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {format(nextDate, "MMM d")}
            </p>
            <p className="text-sm text-muted-foreground">
              {hasUpcoming 
                ? `${Math.max(0, Math.ceil((nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days away`
                : 'No payments due'
              }
            </p>
          </div>
        </div>
        
        {hasUpcoming ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
              <span className="text-sm">Next installment</span>
              <span className="font-semibold text-accent">${nextInstallment.amount.toFixed(2)}</span>
            </div>
            {totalOutstanding > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <span className="text-sm text-muted-foreground">Total outstanding</span>
                <span className="font-medium">${totalOutstanding.toFixed(2)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">All caught up!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
