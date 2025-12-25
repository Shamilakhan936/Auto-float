import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditPaymentPlanFormProps {
  totalAmount: number;
  installmentAmount: number;
  installmentsTotal: number;
  installmentsPaid: number;
  amountPaid: number;
  status: string;
  nextPaymentDate: string;
  onTotalAmountChange: (value: number) => void;
  onInstallmentAmountChange: (value: number) => void;
  onInstallmentsTotalChange: (value: number) => void;
  onInstallmentsPaidChange: (value: number) => void;
  onAmountPaidChange: (value: number) => void;
  onStatusChange: (value: string) => void;
  onNextPaymentDateChange: (value: string) => void;
}

export function EditPaymentPlanForm({
  totalAmount,
  installmentAmount,
  installmentsTotal,
  installmentsPaid,
  amountPaid,
  status,
  nextPaymentDate,
  onTotalAmountChange,
  onInstallmentAmountChange,
  onInstallmentsTotalChange,
  onInstallmentsPaidChange,
  onAmountPaidChange,
  onStatusChange,
  onNextPaymentDateChange,
}: EditPaymentPlanFormProps) {
  return (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="totalAmount">Total Amount ($)</Label>
          <Input
            id="totalAmount"
            type="number"
            value={totalAmount}
            onChange={(e) => onTotalAmountChange(Number(e.target.value))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="installmentAmount">Installment ($)</Label>
          <Input
            id="installmentAmount"
            type="number"
            value={installmentAmount}
            onChange={(e) => onInstallmentAmountChange(Number(e.target.value))}
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
            onChange={(e) => onInstallmentsTotalChange(Number(e.target.value))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="installmentsPaid">Paid Installments</Label>
          <Input
            id="installmentsPaid"
            type="number"
            value={installmentsPaid}
            onChange={(e) => onInstallmentsPaidChange(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="amountPaid">Amount Paid ($)</Label>
        <Input
          id="amountPaid"
          type="number"
          value={amountPaid}
          onChange={(e) => onAmountPaidChange(Number(e.target.value))}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
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
          onChange={(e) => onNextPaymentDateChange(e.target.value)}
        />
      </div>
    </div>
  );
}


