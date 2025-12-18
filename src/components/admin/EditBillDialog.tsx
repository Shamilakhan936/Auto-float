import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

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

const CATEGORIES = [
  "rent/mortgage", "utilities", "phone/internet", "insurance", "childcare",
  "daycare", "auto", "tolls", "parking tickets", "beauty/personal care",
  "groceries", "medical/healthcare", "subscriptions", "home maintenance",
  "pest control", "lawn care", "home security", "HOA fees", "trash/recycling",
  "water/sewer", "other"
];

const STATUSES = ["pending", "scheduled", "paid", "failed"];

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
      setAmount(String(bill.amount));
      setDueDate(bill.due_date);
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
        status: status as "pending" | "scheduled" | "paid" | "failed",
        paid_at: status === 'paid' ? new Date().toISOString() : null
      })
      .eq("id", bill.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to update bill");
    } else {
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
    }
  };

  if (!bill) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" />
            Edit Bill
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bill Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
