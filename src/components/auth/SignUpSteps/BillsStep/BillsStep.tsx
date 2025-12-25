import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Plus, Trash2, DollarSign, ArrowRight, Loader2 } from "lucide-react";

interface Bill {
  name: string;
  amount: string;
  category: string;
  dueDate: string;
}

interface BillsStepProps {
  bills: Bill[];
  newBillName: string;
  newBillAmount: string;
  newBillCategory: string;
  newBillDueDate: string;
  billCategories: Array<{ value: string; label: string }>;
  isLoading: boolean;
  onNewBillNameChange: (value: string) => void;
  onNewBillAmountChange: (value: string) => void;
  onNewBillCategoryChange: (value: string) => void;
  onNewBillDueDateChange: (value: string) => void;
  onAddBill: () => void;
  onRemoveBill: (index: number) => void;
  onSkip: () => void;
  onContinue: () => void;
}

export function BillsStep({
  bills,
  newBillName,
  newBillAmount,
  newBillCategory,
  newBillDueDate,
  billCategories,
  isLoading,
  onNewBillNameChange,
  onNewBillAmountChange,
  onNewBillCategoryChange,
  onNewBillDueDateChange,
  onAddBill,
  onRemoveBill,
  onSkip,
  onContinue,
}: BillsStepProps) {
  return (
    <Card className="animate-scale-in">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Receipt className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">Add Your Bills</CardTitle>
        <CardDescription className="text-sm">
          Add bills you want AutoFloat to help cover
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Added Bills List */}
        {bills.length > 0 && (
          <div className="space-y-2">
            {bills.map((bill, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Receipt className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{bill.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {billCategories.find(c => c.value === bill.category)?.label} • Due: {bill.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">${parseFloat(bill.amount).toFixed(2)}</span>
                  <button
                    onClick={() => onRemoveBill(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="font-medium text-foreground">Total Monthly Bills</span>
              <span className="font-bold text-accent">
                ${bills.reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Add Bill Form */}
        <div className="space-y-3 border border-border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-accent" />
            <span className="font-medium text-sm text-foreground">Add a Bill</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Bill Name</Label>
              <Input
                placeholder="e.g., Electric Bill"
                value={newBillName}
                onChange={(e) => onNewBillNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newBillAmount}
                  onChange={(e) => onNewBillAmountChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Category</Label>
              <Select value={newBillCategory} onValueChange={onNewBillCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {billCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Due Date</Label>
              <Input
                type="date"
                value={newBillDueDate}
                onChange={(e) => onNewBillDueDateChange(e.target.value)}
              />
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onAddBill}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Bill
          </Button>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSkip}
            disabled={isLoading}
          >
            Skip
          </Button>
          <Button
            variant="accent"
            className="flex-1"
            onClick={onContinue}
            disabled={isLoading || bills.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

