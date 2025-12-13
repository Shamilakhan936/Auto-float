import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const BILL_CATEGORIES = [
  { value: "rent", label: "Rent/Mortgage" },
  { value: "utilities", label: "Utilities" },
  { value: "phone", label: "Phone/Internet" },
  { value: "insurance", label: "Insurance" },
  { value: "childcare", label: "Childcare" },
  { value: "daycare", label: "Daycare" },
  { value: "auto", label: "Auto" },
  { value: "tolls", label: "Tolls" },
  { value: "parking", label: "Parking Tickets" },
  { value: "beauty", label: "Beauty/Personal Care" },
  { value: "groceries", label: "Groceries" },
  { value: "medical", label: "Medical/Healthcare" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "home_maintenance", label: "Home Maintenance" },
  { value: "pest_control", label: "Pest Control" },
  { value: "lawn_care", label: "Lawn Care" },
  { value: "security", label: "Home Security" },
  { value: "hoa", label: "HOA Fees" },
  { value: "trash", label: "Trash/Recycling" },
  { value: "water", label: "Water/Sewer" },
  { value: "other", label: "Other" },
];

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
        <DialogHeader>
          <DialogTitle>Add New Bill</DialogTitle>
          <DialogDescription>
            Add a bill to be covered by AutoFloat. A 4-week payment plan will be created.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bill-name">Bill Name</Label>
            <Input
              id="bill-name"
              placeholder="e.g., Electric Bill"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {BILL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={accessRemaining}
                placeholder="0.00"
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Available access: ${accessRemaining.toFixed(2)}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" className="flex-1" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Bill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
