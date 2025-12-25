import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { Bill, PaymentPlan, PaymentInstallment } from "../types";
import { PaymentInstallmentItem } from "./PaymentInstallmentItem";

interface PaymentPlanItemProps {
  plan: PaymentPlan;
  installments: PaymentInstallment[];
  bills: Bill[];
  onMakePayment: (installmentId: string, amount: number, planId: string) => void;
  submitting: boolean;
}

export function PaymentPlanItem({
  plan,
  installments,
  bills,
  onMakePayment,
  submitting,
}: PaymentPlanItemProps) {
  const planInstallments = installments.filter(i => i.payment_plan_id === plan.id);
  const bill = bills.find(b => b.id === plan.bill_id);
  const progressPercent = (plan.amount_paid / plan.total_amount) * 100;

  return (
    <div className="rounded-xl border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-foreground">{bill?.name || "Bill Payment"}</p>
          <p className="text-sm text-muted-foreground">
            ${plan.amount_paid.toFixed(2)} of ${plan.total_amount.toFixed(2)} paid
          </p>
        </div>
        <Badge variant={plan.status === "completed" ? "success" : "outline"}>
          {plan.installments_paid}/{plan.installments_total} payments
        </Badge>
      </div>
      
      <Progress value={progressPercent} className="h-2" />
      
      <div className="space-y-2">
        {planInstallments.map((inst) => (
          <PaymentInstallmentItem
            key={inst.id}
            installment={inst}
            onMakePayment={() => onMakePayment(inst.id, inst.amount, plan.id)}
            submitting={submitting}
          />
        ))}
      </div>
    </div>
  );
}


