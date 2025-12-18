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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        <DialogHeader>
          <DialogTitle>Edit Payment Plan</DialogTitle>
          <DialogDescription>
            Update payment plan details
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="totalAmount">Total Amount ($)</Label>
              <Input
                id="totalAmount"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="installmentAmount">Installment ($)</Label>
              <Input
                id="installmentAmount"
                type="number"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="installmentsTotal">Total Installments</Label>
              <Input
                id="installmentsTotal"
                type="number"
                value={installmentsTotal}
                onChange={(e) => setInstallmentsTotal(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="installmentsPaid">Paid Installments</Label>
              <Input
                id="installmentsPaid"
                type="number"
                value={installmentsPaid}
                onChange={(e) => setInstallmentsPaid(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amountPaid">Amount Paid ($)</Label>
            <Input
              id="amountPaid"
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
            <Input
              id="nextPaymentDate"
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
            />
          </div>
        </div>
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
