import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";

interface Plan {
  price: number;
}

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: Plan | undefined;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  processingPayment: boolean;
  onCardNameChange: (value: string) => void;
  onCardNumberChange: (value: string) => void;
  onCardExpiryChange: (value: string) => void;
  onCardCvcChange: (value: string) => void;
  onPay: () => void;
  formatCardNumber: (value: string) => string;
  formatExpiry: (value: string) => string;
}

export function PaymentModal({
  open,
  onOpenChange,
  currentPlan,
  cardName,
  cardNumber,
  cardExpiry,
  cardCvc,
  processingPayment,
  onCardNameChange,
  onCardNumberChange,
  onCardExpiryChange,
  onCardCvcChange,
  onPay,
  formatCardNumber,
  formatExpiry,
}: PaymentModalProps) {
  const totalAmount = currentPlan ? ((currentPlan.price) + ((currentPlan.price) / 2)).toFixed(2) : "0.00";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-accent" />
            Enter Payment Details
          </DialogTitle>
          <DialogDescription>
            Your card will be charged ${totalAmount} today.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Cardholder Name</Label>
            <Input
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => onCardNameChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Card Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => onCardNumberChange(formatCardNumber(e.target.value))}
                maxLength={19}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => onCardExpiryChange(formatExpiry(e.target.value))}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label>CVC</Label>
              <Input
                placeholder="123"
                value={cardCvc}
                onChange={(e) => onCardCvcChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                type="password"
              />
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount to charge</span>
              <span className="font-bold text-accent">${totalAmount}</span>
            </div>
          </div>
          
          <Button
            variant="accent"
            className="w-full"
            onClick={onPay}
            disabled={processingPayment}
          >
            {processingPayment ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Pay ${totalAmount}
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Your payment is secured with 256-bit SSL encryption.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

