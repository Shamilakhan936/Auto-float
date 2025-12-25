import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { PaymentInstallment } from "../types";

interface PaymentInstallmentItemProps {
  installment: PaymentInstallment;
  onMakePayment: () => void;
  submitting: boolean;
}

export function PaymentInstallmentItem({
  installment,
  onMakePayment,
  submitting,
}: PaymentInstallmentItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${
        installment.status === "paid" ? "bg-success/10" :
        installment.status === "overdue" ? "bg-destructive/10" : "bg-secondary/50"
      }`}
    >
      <div className="flex items-center gap-3">
        {installment.status === "paid" ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : installment.status === "overdue" ? (
          <AlertCircle className="h-4 w-4 text-destructive" />
        ) : (
          <Clock className="h-4 w-4 text-muted-foreground" />
        )}
        <div>
          <p className="text-sm font-medium text-foreground">${installment.amount.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            {installment.status === "paid"
              ? `Paid ${installment.paid_at ? format(new Date(installment.paid_at), "MMM d") : ""}`
              : `Due ${format(new Date(installment.due_date), "MMM d")}`
            }
          </p>
        </div>
      </div>
      {installment.status === "pending" && (
        <Button
          variant="accent"
          size="sm"
          onClick={onMakePayment}
          disabled={submitting}
        >
          {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Pay"}
        </Button>
      )}
      {installment.status === "overdue" && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onMakePayment}
          disabled={submitting}
        >
          {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Pay Now"}
        </Button>
      )}
    </div>
  );
}


