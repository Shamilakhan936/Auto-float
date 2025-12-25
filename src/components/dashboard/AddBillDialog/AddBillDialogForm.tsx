import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BILL_CATEGORIES } from "./constants";

interface AddBillDialogFormProps {
  name: string;
  category: string;
  amount: string;
  dueDate: string;
  accessRemaining: number;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddBillDialogForm({
  name,
  category,
  amount,
  dueDate,
  accessRemaining,
  onNameChange,
  onCategoryChange,
  onAmountChange,
  onDueDateChange,
  onSubmit,
}: AddBillDialogFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bill-name">Bill Name</Label>
        <Input
          id="bill-name"
          placeholder="e.g., Electric Bill"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange} required>
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
            onChange={(e) => onAmountChange(e.target.value)}
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
          onChange={(e) => onDueDateChange(e.target.value)}
          required
        />
      </div>
    </form>
  );
}


