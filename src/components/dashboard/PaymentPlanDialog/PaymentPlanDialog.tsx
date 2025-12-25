import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Bill, PaymentPlan, PaymentInstallment } from "../types";
import { PaymentPlanDialogHeader } from "./PaymentPlanDialogHeader";
import { PaymentPlanDialogContent } from "./PaymentPlanDialogContent";

interface PaymentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePaymentPlans: PaymentPlan[];
  installments: PaymentInstallment[];
  bills: Bill[];
  onMakePayment: (installmentId: string, amount: number, planId: string) => void;
  submitting: boolean;
}

export function PaymentPlanDialog({
  open,
  onOpenChange,
  activePaymentPlans,
  installments,
  bills,
  onMakePayment,
  submitting,
}: PaymentPlanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <PaymentPlanDialogHeader />
        <PaymentPlanDialogContent
          activePaymentPlans={activePaymentPlans}
          installments={installments}
          bills={bills}
          onMakePayment={onMakePayment}
          submitting={submitting}
        />
        <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
