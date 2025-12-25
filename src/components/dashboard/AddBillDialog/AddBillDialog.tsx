import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AddBillDialogHeader } from "./AddBillDialogHeader";
import { AddBillDialogForm } from "./AddBillDialogForm";
import { AddBillDialogFooter } from "./AddBillDialogFooter";

interface AddBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; category: string; amount: number; dueDate: string }) => Promise<void>;
  accessRemaining: number;
  submitting: boolean;
}

export function AddBillDialog({ open, onOpenChange, onSubmit, accessRemaining, submitting }: AddBillDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    await onSubmit({ name, category, amount: numAmount, dueDate });
    
    // Reset form
    setName("");
    setCategory("");
    setAmount("");
    setDueDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <AddBillDialogHeader />
        <AddBillDialogForm
          name={name}
          category={category}
          amount={amount}
          dueDate={dueDate}
          accessRemaining={accessRemaining}
          onNameChange={setName}
          onCategoryChange={setCategory}
          onAmountChange={setAmount}
          onDueDateChange={setDueDate}
          onSubmit={handleSubmit}
        />
        <AddBillDialogFooter
          onClose={() => onOpenChange(false)}
          submitting={submitting}
        />
      </DialogContent>
    </Dialog>
  );
}
