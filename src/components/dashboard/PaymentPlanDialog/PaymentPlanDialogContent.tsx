import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { Bill, PaymentPlan, PaymentInstallment } from "../types";
import { PaymentPlanEmpty } from "./PaymentPlanEmpty";
import { PaymentPlanItem } from "./PaymentPlanItem";

interface PaymentPlanDialogContentProps {
  activePaymentPlans: PaymentPlan[];
  installments: PaymentInstallment[];
  bills: Bill[];
  onMakePayment: (installmentId: string, amount: number, planId: string) => void;
  submitting: boolean;
}

export function PaymentPlanDialogContent({
  activePaymentPlans,
  installments,
  bills,
  onMakePayment,
  submitting,
}: PaymentPlanDialogContentProps) {
  if (activePaymentPlans.length === 0) {
    return <PaymentPlanEmpty />;
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {activePaymentPlans.map((plan) => (
        <PaymentPlanItem
          key={plan.id}
          plan={plan}
          installments={installments}
          bills={bills}
          onMakePayment={onMakePayment}
          submitting={submitting}
        />
      ))}
    </div>
  );
}


