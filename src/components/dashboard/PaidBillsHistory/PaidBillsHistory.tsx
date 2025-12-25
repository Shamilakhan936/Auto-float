import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Home, Zap, Phone, Shield, Wifi, Baby, Car, Receipt } from "lucide-react";
import { format } from "date-fns";
import { categoryIcons } from "../categoryIcons";

const localCategoryIcons: Record<string, typeof Home> = {
  rent: Home,
  utilities: Zap,
  phone: Phone,
  insurance: Shield,
  internet: Wifi,
  childcare: Baby,
  auto: Car,
};

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
  paid_at?: string | null;
}

interface PaidBillsHistoryProps {
  bills: Bill[];
}

export function PaidBillsHistory({ bills }: PaidBillsHistoryProps) {
  const paidBills = bills.filter(b => b.status === 'paid').slice(0, 5);

  return (
    <Card className="animate-fade-in [animation-delay:300ms] opacity-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-accent" />
          Recently Paid
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paidBills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No paid bills yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paidBills.map((bill) => {
              const Icon = localCategoryIcons[bill.category.toLowerCase()] || Receipt;
              return (
                <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{bill.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {bill.paid_at 
                          ? `Paid ${format(new Date(bill.paid_at), "MMM d, yyyy")}`
                          : `Due ${format(new Date(bill.due_date), "MMM d")}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                    <Badge variant="success" className="text-xs">Paid</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

