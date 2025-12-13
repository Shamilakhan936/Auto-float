import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface PaymentPlan {
  id: string;
  bill_id: string | null;
  total_amount: number;
  amount_paid: number;
  installment_amount: number;
  installments_total: number;
  installments_paid: number;
  status: string;
  next_payment_date: string | null;
}

interface PaymentInstallment {
  id: string;
  payment_plan_id: string;
  amount: number;
  due_date: string;
  paid_at: string | null;
  status: string;
}

interface PaymentPlanTrackerProps {
  plans: PaymentPlan[];
  installments: PaymentInstallment[];
  bills: { id: string; name: string }[];
  onMakePayment: (installmentId: string, amount: number, planId: string) => void;
  submitting: boolean;
}

export function PaymentPlanTracker({ plans, installments, bills, onMakePayment, submitting }: PaymentPlanTrackerProps) {
  const activePlans = plans.filter(p => p.status === 'active');
  const totalOutstanding = activePlans.reduce((sum, p) => sum + (p.total_amount - p.amount_paid), 0);
  const pendingInstallments = installments.filter(i => i.status === 'pending' || i.status === 'overdue');

  const getBillName = (billId: string | null) => {
    if (!billId) return 'Payment Plan';
    const bill = bills.find(b => b.id === billId);
    return bill?.name || 'Payment Plan';
  };

  const getInstallmentStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success"><CheckCircle2 className="h-3 w-3 mr-1" />Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <Card className="animate-fade-in [animation-delay:400ms] opacity-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Payment Plans
          </CardTitle>
          {totalOutstanding > 0 && (
            <Badge variant="secondary">${totalOutstanding.toFixed(2)} outstanding</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {activePlans.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No active payment plans</p>
            <p className="text-xs mt-1">Add a bill to create a payment plan</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activePlans.map((plan) => {
              const planInstallments = installments.filter(i => i.payment_plan_id === plan.id);
              const progress = (plan.installments_paid / plan.installments_total) * 100;
              const nextInstallment = planInstallments.find(i => i.status === 'pending');
              
              return (
                <div key={plan.id} className="p-4 rounded-lg bg-secondary/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{getBillName(plan.bill_id)}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${plan.amount_paid.toFixed(2)} of ${plan.total_amount.toFixed(2)} paid
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {plan.installments_paid}/{plan.installments_total}
                      </p>
                      <p className="text-xs text-muted-foreground">installments</p>
                    </div>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="grid grid-cols-4 gap-2">
                    {planInstallments.map((inst, idx) => (
                      <div 
                        key={inst.id} 
                        className={`p-2 rounded text-center text-xs ${
                          inst.status === 'paid' 
                            ? 'bg-success/20 text-success' 
                            : inst.status === 'overdue'
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p className="font-medium">#{idx + 1}</p>
                        <p>${inst.amount.toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                  
                  {nextInstallment && (
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Next: {format(new Date(nextInstallment.due_date), "MMM d")}</span>
                        <span className="text-accent font-medium">${nextInstallment.amount.toFixed(2)}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="accent"
                        onClick={() => onMakePayment(nextInstallment.id, nextInstallment.amount, plan.id)}
                        disabled={submitting}
                      >
                        Pay Now
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
