import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Zap, Phone, Shield, Wifi, Baby, Car, Receipt, Plus } from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";

const categoryIcons: Record<string, typeof Home> = {
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
}

interface UpcomingBillsProps {
  bills: Bill[];
  onAddBill: () => void;
}

export function UpcomingBills({ bills, onAddBill }: UpcomingBillsProps) {
  const upcomingBills = bills.filter(b => 
    b.status !== 'paid' && isAfter(new Date(b.due_date), addDays(new Date(), -1))
  ).slice(0, 5);

  const getStatusBadge = (status: string, dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const isOverdue = isBefore(due, today) && status !== 'paid';
    
    if (status === 'paid') return <Badge variant="success">Paid</Badge>;
    if (isOverdue) return <Badge variant="destructive">Overdue</Badge>;
    if (status === 'scheduled') return <Badge variant="secondary">Scheduled</Badge>;
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <Card className="animate-fade-in [animation-delay:200ms] opacity-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5 text-accent" />
            Upcoming Bills
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onAddBill}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingBills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No upcoming bills</p>
            <Button variant="link" size="sm" onClick={onAddBill} className="mt-2">
              Add your first bill
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBills.map((bill) => {
              const Icon = categoryIcons[bill.category.toLowerCase()] || Receipt;
              return (
                <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{bill.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {format(new Date(bill.due_date), "MMM d")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                    {getStatusBadge(bill.status, bill.due_date)}
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
