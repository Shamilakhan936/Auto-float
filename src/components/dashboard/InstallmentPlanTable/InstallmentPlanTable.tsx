import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { PaymentPlan, PaymentInstallment } from "../types";

interface InstallmentPlanTableProps {
  paymentPlans: PaymentPlan[];
  installments: PaymentInstallment[];
  onMakePayment: (installmentId: string, amount: number, planId: string) => void;
  submitting: boolean;
}

export function InstallmentPlanTable({
  paymentPlans,
  installments,
  onMakePayment,
  submitting,
}: InstallmentPlanTableProps) {
  if (paymentPlans.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 animate-fade-in [animation-delay:175ms] opacity-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Installment Plan</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {installments.filter(i => i.status === 'paid').length} of {installments.length} paid
          </Badge>
        </div>
        <CardDescription>
          Your 4-installment repayment schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Installment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {installments.slice(0, 4).map((installment, index) => {
                const isPaid = installment.status === 'paid';
                const isOverdue = installment.status === 'overdue';
                const plan = paymentPlans.find(p =>
                  installments.some(i => i.payment_plan_id === p.id && i.id === installment.id)
                );
                
                return (
                  <tr
                    key={installment.id}
                    className={`border-b border-border/50 last:border-0 ${isPaid ? 'bg-success/5' : ''}`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                          isPaid
                            ? 'bg-success/20 text-success'
                            : isOverdue
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-secondary text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-foreground">
                          {index < 2 ? 'Signup Payment' : `Week ${index + 1}`}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-foreground">
                        ${installment.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-muted-foreground">
                        {format(new Date(installment.due_date), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {isPaid ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Paid
                        </Badge>
                      ) : isOverdue ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Overdue
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {isPaid ? (
                        <span className="text-sm text-success">
                          {installment.paid_at ? format(new Date(installment.paid_at), "MMM d") : 'Completed'}
                        </span>
                      ) : (
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => {
                            if (plan) {
                              onMakePayment(installment.id, installment.amount, plan.id);
                            }
                          }}
                          disabled={submitting || (index > 0 && installments[index - 1]?.status !== 'paid')}
                        >
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay Now"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Summary Footer */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success"></div>
              <span className="text-sm text-muted-foreground">
                {installments.filter(i => i.status === 'paid').length} Paid
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-muted-foreground"></div>
              <span className="text-sm text-muted-foreground">
                {installments.filter(i => i.status === 'pending').length} Remaining
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Remaining</p>
            <p className="text-lg font-bold text-foreground">
              ${installments.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


