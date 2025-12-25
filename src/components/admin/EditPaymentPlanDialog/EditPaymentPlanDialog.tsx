import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditPaymentPlanHeader } from "./EditPaymentPlanHeader";
import { EditPaymentPlanForm } from "./EditPaymentPlanForm";

interface PaymentPlan {
  id: string;
  user_id: string;
  bill_id: string | null;
  total_amount: number;
  installment_amount: number;
  installments_total: number;
  installments_paid: number;
  amount_paid: number;
  status: string;
  next_payment_date: string | null;
  created_at: string;
}

interface EditPaymentPlanDialogProps {
  plan: PaymentPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (plan: PaymentPlan) => void;
}

export function EditPaymentPlanDialog({
  plan,
  open,
  onOpenChange,
  onUpdate
}: EditPaymentPlanDialogProps) {
  const [totalAmount, setTotalAmount] = useState(0);
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [installmentsTotal, setInstallmentsTotal] = useState(4);
  const [installmentsPaid, setInstallmentsPaid] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [status, setStatus] = useState("active");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plan) {
      setTotalAmount(plan.total_amount);
      setInstallmentAmount(plan.installment_amount);
      setInstallmentsTotal(plan.installments_total);
      setInstallmentsPaid(plan.installments_paid);
      setAmountPaid(plan.amount_paid);
      setStatus(plan.status);
      setNextPaymentDate(plan.next_payment_date || "");
    }
  }, [plan]);

  const handleSave = async () => {
    if (!plan) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("payment_plans")
      .update({
        total_amount: totalAmount,
        installment_amount: installmentAmount,
        installments_total: installmentsTotal,
        installments_paid: installmentsPaid,
        amount_paid: amountPaid,
        status,
        next_payment_date: nextPaymentDate || null
      })
      .eq("id", plan.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to update payment plan");
      return;
    }

    toast.success("Payment plan updated successfully");
    onUpdate({
      ...plan,
      total_amount: totalAmount,
      installment_amount: installmentAmount,
      installments_total: installmentsTotal,
      installments_paid: installmentsPaid,
      amount_paid: amountPaid,
      status,
      next_payment_date: nextPaymentDate || null
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <EditPaymentPlanHeader />
        <EditPaymentPlanForm
          totalAmount={totalAmount}
          installmentAmount={installmentAmount}
          installmentsTotal={installmentsTotal}
          installmentsPaid={installmentsPaid}
          amountPaid={amountPaid}
          status={status}
          nextPaymentDate={nextPaymentDate}
          onTotalAmountChange={setTotalAmount}
          onInstallmentAmountChange={setInstallmentAmount}
          onInstallmentsTotalChange={setInstallmentsTotal}
          onInstallmentsPaidChange={setInstallmentsPaid}
          onAmountPaidChange={setAmountPaid}
          onStatusChange={setStatus}
          onNextPaymentDateChange={setNextPaymentDate}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
