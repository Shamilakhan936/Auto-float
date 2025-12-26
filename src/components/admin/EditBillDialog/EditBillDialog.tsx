import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditBillDialogHeader } from "./EditBillDialogHeader";
import { EditBillDialogForm } from "./EditBillDialogForm";

interface Bill {
  id: string;
  user_id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
  created_at: string;
}

interface EditBillDialogProps {
  bill: Bill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedBill: Bill) => void;
}

export function EditBillDialog({ bill, open, onOpenChange, onUpdate }: EditBillDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bill) {
      setName(bill.name);
      setCategory(bill.category);
      setAmount(bill.amount.toString());
      setDueDate(bill.due_date.split("T")[0]);
      setStatus(bill.status);
    }
  }, [bill]);

  const handleSave = async () => {
    if (!bill) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("bills")
      .update({
        name,
        category,
        amount: parseFloat(amount),
        due_date: dueDate,
        status: status as "pending" | "scheduled" | "paid" | "failed"
      })
      .eq("id", bill.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to update bill");
      return;
    }

    toast.success("Bill updated successfully");
    onUpdate({
      ...bill,
      name,
      category,
      amount: parseFloat(amount),
      due_date: dueDate,
      status
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <EditBillDialogHeader />
        <EditBillDialogForm
          name={name}
          category={category}
          amount={amount}
          dueDate={dueDate}
          status={status}
          onNameChange={setName}
          onCategoryChange={setCategory}
          onAmountChange={setAmount}
          onDueDateChange={setDueDate}
          onStatusChange={setStatus}
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
