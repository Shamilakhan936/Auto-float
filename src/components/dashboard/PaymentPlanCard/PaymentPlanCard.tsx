import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { PaymentPlan, PaymentInstallment } from "../types";

interface PaymentPlanCardProps {
  activePaymentPlans: PaymentPlan[];
  totalOutstanding: number;
  pendingInstallments: PaymentInstallment[];
  nextInstallment: PaymentInstallment | undefined;
  paymentPlans: PaymentPlan[];
  installments: PaymentInstallment[];
  onViewDetails: () => void;
  onMakePayment: (installmentId: string, amount: number, planId: string) => void;
  submitting: boolean;
}

export function PaymentPlanCard({
  activePaymentPlans,
  totalOutstanding,
  pendingInstallments,
  nextInstallment,
  paymentPlans,
  installments,
  onViewDetails,
  onMakePayment,
  submitting,
}: PaymentPlanCardProps) {
  if (activePaymentPlans.length === 0 && totalOutstanding === 0) {
    return null;
  }

  return (
    <Card className="mb-8 animate-fade-in [animation-delay:150ms] opacity-0 border-accent/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Your Payment Plan</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-sm text-muted-foreground mb-1">Outstanding Balance</p>
            <p className="text-2xl font-bold text-foreground">${totalOutstanding.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Plans</p>
            <p className="text-2xl font-bold text-foreground">{activePaymentPlans.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
            <p className="text-2xl font-bold text-foreground">{pendingInstallments.length}</p>
          </div>
        </div>
        
        {nextInstallment && (
          <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Payment Due</p>
                <p className="text-lg font-semibold text-foreground">
                  ${nextInstallment.amount.toFixed(2)} on {format(new Date(nextInstallment.due_date), "MMM d")}
                </p>
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  const plan = paymentPlans.find(p =>
                    installments.some(i => i.payment_plan_id === p.id && i.id === nextInstallment.id)
                  );
                  if (plan) {
                    onMakePayment(nextInstallment.id, nextInstallment.amount, plan.id);
                  }
                }}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay Now"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


