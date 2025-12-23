import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Car, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  Plus,
  Zap,
  Home,
  Phone,
  Shield,
  Wifi,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  Receipt,
  Users,
  Gift,
  Copy
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

const categoryIcons: Record<string, typeof Home> = {
  Rent: Home,
  Utilities: Zap,
  Phone: Phone,
  Insurance: Shield,
  Internet: Wifi,
};

const tierLimits = {
  basic: 500,
  plus: 1500,
  auto_plus: 3000,
};

const tierNames = {
  basic: "Basic",
  plus: "Plus",
  auto_plus: "AutoFloat",
};

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
}

interface Subscription {
  tier: "basic" | "plus" | "auto_plus";
  access_limit: number;
  access_used: number;
  is_active: boolean;
  next_settlement_date: string | null;
}

interface Vehicle {
  is_verified: boolean;
  make: string | null;
  model: string | null;
  year: number | null;
  insurance_provider: string | null;
  insurance_verified: boolean;
  vin: string | null;
  license_plate: string | null;
}

interface BankAccount {
  bank_name: string;
  account_last_four: string | null;
  is_connected: boolean;
}

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

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [bills, setBills] = useState<Bill[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [installments, setInstallments] = useState<PaymentInstallment[]>([]);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addBillOpen, setAddBillOpen] = useState(false);
  const [manageBankOpen, setManageBankOpen] = useState(false);
  const [manageVehicleOpen, setManageVehicleOpen] = useState(false);
  const [paymentPlanOpen, setPaymentPlanOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [newBillName, setNewBillName] = useState("");
  const [newBillCategory, setNewBillCategory] = useState("");
  const [newBillAmount, setNewBillAmount] = useState("");
  const [newBillDueDate, setNewBillDueDate] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      
      if (subError) throw subError;
      if (subData) {
        setSubscription(subData as Subscription);
      }

      const { data: billsData, error: billsError } = await supabase
        .from("bills")
        .select("*")
        .eq("user_id", user!.id)
        .order("due_date", { ascending: true });
      
      if (billsError) throw billsError;
      setBills((billsData as Bill[]) || []);

      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      
      if (vehicleError && vehicleError.code !== "PGRST116") throw vehicleError;
      if (vehicleData) {
        setVehicle(vehicleData as Vehicle);
      }

      const { data: bankData, error: bankError } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_primary", true)
        .maybeSingle();
      
      if (bankError && bankError.code !== "PGRST116") throw bankError;
      if (bankData) {
        setBankAccount(bankData as BankAccount);
      }

      const { data: plansData, error: plansError } = await supabase
        .from("payment_plans")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      
      if (plansError) throw plansError;
      setPaymentPlans((plansData as PaymentPlan[]) || []);

      const { data: installmentsData, error: installmentsError } = await supabase
        .from("payment_installments")
        .select("*")
        .eq("user_id", user!.id)
        .order("due_date", { ascending: true });
      
      if (installmentsError) throw installmentsError;
      setInstallments((installmentsData as PaymentInstallment[]) || []);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("user_id", user!.id)
        .maybeSingle();
      
      if (profileData?.referral_code) {
        setReferralCode(profileData.referral_code);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subscription) return;

    const amount = parseFloat(newBillAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bill amount.",
        variant: "destructive",
      });
      return;
    }

    if (subscription.access_used + amount > subscription.access_limit) {
      toast({
        title: "Access limit exceeded",
        description: "This bill would exceed your monthly access limit.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: billData, error: billError } = await supabase.from("bills").insert({
        user_id: user.id,
        name: newBillName,
        category: newBillCategory,
        amount: amount,
        due_date: newBillDueDate,
        status: "scheduled",
      }).select().single();

      if (billError) throw billError;

      const installmentAmount = amount / 4;
      const { data: planData, error: planError } = await supabase.from("payment_plans").insert({
        user_id: user.id,
        bill_id: billData.id,
        total_amount: amount,
        installment_amount: installmentAmount,
        installments_total: 4,
        next_payment_date: addDays(new Date(), 7).toISOString().split("T")[0],
      }).select().single();

      if (planError) throw planError;

      const installmentsToCreate = [];
      for (let i = 0; i < 4; i++) {
        installmentsToCreate.push({
          payment_plan_id: planData.id,
          user_id: user.id,
          amount: installmentAmount,
          due_date: addDays(new Date(), 7 * (i + 1)).toISOString().split("T")[0],
          status: "pending",
        });
      }

      const { error: installmentsError } = await supabase.from("payment_installments").insert(installmentsToCreate);
      if (installmentsError) throw installmentsError;

      const { error: subError } = await supabase
        .from("subscriptions")
        .update({ access_used: subscription.access_used + amount })
        .eq("user_id", user.id);

      if (subError) throw subError;

      toast({
        title: "Bill added",
        description: `${newBillName} has been added with a 4-week payment plan.`,
      });

      setAddBillOpen(false);
      setNewBillName("");
      setNewBillCategory("");
      setNewBillAmount("");
      setNewBillDueDate("");
      fetchData();
    } catch (error) {
      console.error("Error adding bill:", error);
      toast({
        title: "Error",
        description: "Failed to add bill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const accessUsed = subscription?.access_used || 0;
  const accessLimit = subscription?.access_limit || 500;
  const accessRemaining = accessLimit - accessUsed;
  const accessPercent = (accessUsed / accessLimit) * 100;
  const isVerified = vehicle?.is_verified || false;
  const tierName = subscription ? tierNames[subscription.tier] : "Basic";
  
  const nextSettlement = subscription?.next_settlement_date 
    ? format(new Date(subscription.next_settlement_date), "MMMM d, yyyy")
    : format(addDays(new Date(), 18), "MMMM d, yyyy");

  const daysUntilSettlement = subscription?.next_settlement_date
    ? Math.ceil((new Date(subscription.next_settlement_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 18;

  // Payment plan calculations
  const activePaymentPlans = paymentPlans.filter(p => p.status === 'active');
  const totalOutstanding = activePaymentPlans.reduce((sum, p) => sum + (p.total_amount - p.amount_paid), 0);
  const pendingInstallments = installments.filter(i => i.status === 'pending' || i.status === 'overdue');
  const nextInstallment = pendingInstallments[0];

  const handleMakePayment = async (installmentId: string, amount: number, planId: string) => {
    if (!user) return;
    setSubmitting(true);

    try {
      const { error: installmentError } = await supabase
        .from("payment_installments")
        .update({ 
          status: "paid",
          paid_at: new Date().toISOString()
        })
        .eq("id", installmentId);

      if (installmentError) throw installmentError;

      const plan = paymentPlans.find(p => p.id === planId);
      if (plan) {
        const newAmountPaid = plan.amount_paid + amount;
        const newInstallmentsPaid = plan.installments_paid + 1;
        const isCompleted = newInstallmentsPaid >= plan.installments_total;

        const { error: planError } = await supabase
          .from("payment_plans")
          .update({ 
            amount_paid: newAmountPaid,
            installments_paid: newInstallmentsPaid,
            status: isCompleted ? "completed" : "active",
          })
          .eq("id", planId);

        if (planError) throw planError;
      }

      toast({
        title: "Payment successful!",
        description: `$${amount.toFixed(2)} payment has been processed.`,
      });

      fetchData();
    } catch (error) {
      console.error("Error making payment:", error);
      toast({
        title: "Payment failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyReferralCode = () => {
    const code = referralCode || `REF-${user?.id?.slice(0, 8).toUpperCase()}`;
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const handlePayNextInstallment = (installment: PaymentInstallment) => {
    const plan = paymentPlans.find(p => 
      installments.some(i => i.payment_plan_id === p.id && i.id === installment.id)
    );
    if (plan) {
      handleMakePayment(installment.id, installment.amount, plan.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Manage your bills and track your access.</p>
            </div>
            <div className="flex items-center gap-3">
              {isVerified && (
                <Badge variant="verified" className="py-2 px-4">
                  <Car className="h-4 w-4 mr-2" />
                  AutoFloat Verified
                </Badge>
              )}
              <Button variant="accent" onClick={() => setAddBillOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bill
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-2 animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Current Access</CardTitle>
                  <Badge variant="outline">{accessPercent.toFixed(0)}% used</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-4xl font-bold text-foreground">${accessUsed.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">of ${accessLimit.toLocaleString()} limit</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-accent">${accessRemaining.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">remaining</p>
                  </div>
                </div>
                <Progress value={accessPercent} className="h-3 rounded-full" />
                <div className="mt-6 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Resets {nextSettlement}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>{tierName} Plan</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in [animation-delay:100ms] opacity-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Next Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {format(addDays(new Date(), daysUntilSettlement), "MMM d")}
                    </p>
                    <p className="text-sm text-muted-foreground">{daysUntilSettlement} days away</p>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount due</span>
                    <span className="text-lg font-semibold text-foreground">${accessUsed.toLocaleString()}</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Balance clears automatically via ACH on payment date.
                </p>
              </CardContent>
            </Card>
          </div>

          {(activePaymentPlans.length > 0 || totalOutstanding > 0) && (
            <Card className="mb-8 animate-fade-in [animation-delay:150ms] opacity-0 border-accent/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Your Payment Plan</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPaymentPlanOpen(true)}>
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Outstanding Balance</p>
                    <p className="text-2xl font-bold text-foreground">${totalOutstanding.toFixed(2)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Active Plans</p>
                    <p className="text-2xl font-bold text-foreground">{activePaymentPlans.length}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
                    <p className="text-2xl font-bold text-foreground">{pendingInstallments.length}</p>
                  </div>
                </div>
                
                {nextInstallment && (
                  <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Next Payment Due</p>
                        <p className="text-lg font-semibold text-foreground">
                          ${nextInstallment.amount.toFixed(2)} on {format(new Date(nextInstallment.due_date), "MMM d")}
                        </p>
                      </div>
                      <Button 
                        variant="accent" 
                        size="sm"
                        onClick={() => handlePayNextInstallment(nextInstallment)}
                        disabled={submitting}
                      >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay Now"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {paymentPlans.length > 0 && (
            <Card className="mb-8 animate-fade-in [animation-delay:175ms] opacity-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Installment Plan</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {installments.filter(i => i.status === 'paid').length} of {installments.length} paid
                  </Badge>
                </div>
                <CardDescription>
                  Your 4-installment repayment schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Installment</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {installments.slice(0, 4).map((installment, index) => {
                        const isPaid = installment.status === 'paid';
                        const isOverdue = installment.status === 'overdue';
                        const isPending = installment.status === 'pending';
                        const plan = paymentPlans.find(p => 
                          installments.some(i => i.payment_plan_id === p.id && i.id === installment.id)
                        );
                        
                        return (
                          <tr 
                            key={installment.id} 
                            className={`border-b border-border/50 last:border-0 ${isPaid ? 'bg-success/5' : ''}`}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                  isPaid 
                                    ? 'bg-success/20 text-success' 
                                    : isOverdue 
                                      ? 'bg-destructive/20 text-destructive'
                                      : 'bg-secondary text-muted-foreground'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="font-medium text-foreground">
                                  {index < 2 ? 'Signup Payment' : `Week ${index + 1}`}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-foreground">
                                ${installment.amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-muted-foreground">
                                {format(new Date(installment.due_date), "MMM d, yyyy")}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {isPaid ? (
                                <Badge variant="success" className="gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Paid
                                </Badge>
                              ) : isOverdue ? (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Overdue
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1">
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              {isPaid ? (
                                <span className="text-sm text-success">
                                  {installment.paid_at ? format(new Date(installment.paid_at), "MMM d") : 'Completed'}
                                </span>
                              ) : (
                                <Button 
                                  variant="accent" 
                                  size="sm"
                                  onClick={() => handlePayNextInstallment(installment)}
                                  disabled={submitting || (index > 0 && installments[index - 1]?.status !== 'paid')}
                                >
                                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay Now"}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-success"></div>
                      <span className="text-sm text-muted-foreground">
                        {installments.filter(i => i.status === 'paid').length} Paid
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-muted-foreground"></div>
                      <span className="text-sm text-muted-foreground">
                        {installments.filter(i => i.status === 'pending').length} Remaining
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Remaining</p>
                    <p className="text-lg font-bold text-foreground">
                      ${installments.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="animate-fade-in [animation-delay:200ms] opacity-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Bills</CardTitle>
                    <CardDescription>Your scheduled and pending bill payments</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setAddBillOpen(true)}>
                    Add Bill
                    <Plus className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {bills.filter(b => b.status !== "paid").length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">No upcoming bills</p>
                    <Button variant="accent" onClick={() => setAddBillOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Bill
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bills.filter(b => b.status !== "paid").map((bill) => {
                      const IconComponent = categoryIcons[bill.category] || CreditCard;
                      return (
                        <div
                          key={bill.id}
                          className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                              <IconComponent className="h-6 w-6 text-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{bill.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {bill.category} • Due {format(new Date(bill.due_date), "MMM d")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-lg font-semibold text-foreground">${bill.amount}</p>
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {bill.status === "scheduled" ? "Scheduled" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="animate-fade-in [animation-delay:250ms] opacity-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Paid Bills</CardTitle>
                    <CardDescription>Bills that have been completed</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {bills.filter(b => b.status === "paid").length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                      <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No paid bills yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bills will appear here once paid
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {bills.filter(b => b.status === "paid").map((bill) => {
                      const IconComponent = categoryIcons[bill.category] || CreditCard;
                      return (
                        <div
                          key={bill.id}
                          className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                              <IconComponent className="h-6 w-6 text-success" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{bill.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {bill.category} • {format(new Date(bill.due_date), "MMM d")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-lg font-semibold text-foreground">${bill.amount}</p>
                            <Badge variant="success" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Paid
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 animate-fade-in [animation-delay:280ms] opacity-0 border-accent/30 bg-gradient-to-r from-accent/5 to-transparent">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 shrink-0">
                  <Gift className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    Refer a Friend, Get $5
                  </h3>
                  <p className="text-muted-foreground">
                    Share AutoFloat with friends and earn $5 for each successful referral. Your friend gets $5 too!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border">
                    <span className="text-sm font-mono text-foreground">
                      {referralCode || `REF-${user?.id?.slice(0, 8).toUpperCase()}`}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={handleCopyReferralCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="accent">
                    <Users className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <Card 
              className="hover:border-accent/30 transition-colors cursor-pointer animate-fade-in [animation-delay:300ms] opacity-0"
              onClick={() => setAddBillOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Plus className="h-8 w-8 text-accent mb-3" />
                <p className="font-medium text-foreground">Add Bill</p>
                <p className="text-xs text-muted-foreground">Schedule new payment</p>
              </CardContent>
            </Card>
            <Card 
              className="hover:border-accent/30 transition-colors cursor-pointer animate-fade-in [animation-delay:400ms] opacity-0"
              onClick={() => setManageBankOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <CreditCard className="h-8 w-8 text-accent mb-3" />
                <p className="font-medium text-foreground">Bank Account</p>
                <p className="text-xs text-muted-foreground">
                  {bankAccount ? bankAccount.bank_name : "Connect bank"}
                </p>
              </CardContent>
            </Card>
            <Card 
              className="hover:border-accent/30 transition-colors cursor-pointer animate-fade-in [animation-delay:500ms] opacity-0"
              onClick={() => setManageVehicleOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Car className="h-8 w-8 text-accent mb-3" />
                <p className="font-medium text-foreground">Vehicle Info</p>
                <p className="text-xs text-muted-foreground">
                  {isVerified ? "Verified" : "Not verified"}
                </p>
              </CardContent>
            </Card>
            <Link to="/settings">
              <Card className="hover:border-accent/30 transition-colors cursor-pointer h-full animate-fade-in [animation-delay:550ms] opacity-0">
                <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                  <Shield className="h-8 w-8 text-accent mb-3" />
                  <p className="font-medium text-foreground">Settings</p>
                  <p className="text-xs text-muted-foreground">Manage account</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/plans">
              <Card className="hover:border-accent/30 transition-colors cursor-pointer h-full animate-fade-in [animation-delay:600ms] opacity-0">
                <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                  <ArrowUpRight className="h-8 w-8 text-accent mb-3" />
                  <p className="font-medium text-foreground">Upgrade Plan</p>
                  <p className="text-xs text-muted-foreground">Increase your limit</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />

      <Dialog open={addBillOpen} onOpenChange={setAddBillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Bill</DialogTitle>
            <DialogDescription>
              Add a bill to your upcoming payments. It will count against your monthly access.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBill} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billName">Bill Name</Label>
              <Input
                id="billName"
                placeholder="e.g., Electric Bill"
                value={newBillName}
                onChange={(e) => setNewBillName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newBillCategory} onValueChange={setNewBillCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent/Mortgage</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="phone">Phone/Internet</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="childcare">Childcare</SelectItem>
                  <SelectItem value="daycare">Daycare</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="tolls">Tolls</SelectItem>
                  <SelectItem value="parking">Parking Tickets</SelectItem>
                  <SelectItem value="beauty">Beauty/Personal Care</SelectItem>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="medical">Medical/Healthcare</SelectItem>
                  <SelectItem value="subscriptions">Subscriptions</SelectItem>
                  <SelectItem value="home_maintenance">Home Maintenance</SelectItem>
                  <SelectItem value="pest_control">Pest Control</SelectItem>
                  <SelectItem value="lawn_care">Lawn Care</SelectItem>
                  <SelectItem value="security">Home Security</SelectItem>
                  <SelectItem value="hoa">HOA Fees</SelectItem>
                  <SelectItem value="trash">Trash/Recycling</SelectItem>
                  <SelectItem value="water">Water/Sewer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newBillAmount}
                onChange={(e) => setNewBillAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newBillDueDate}
                onChange={(e) => setNewBillDueDate(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setAddBillOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="accent" className="flex-1" disabled={submitting}>
                {submitting ? "Adding..." : "Add Bill"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={manageBankOpen} onOpenChange={setManageBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bank Account</DialogTitle>
            <DialogDescription>
              Manage your connected bank account for auto-settlement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {bankAccount ? (
              <div className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <CreditCard className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{bankAccount.bank_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ••••{bankAccount.account_last_four || "4567"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={bankAccount.is_connected ? "success" : "outline"}>
                    {bankAccount.is_connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No bank account connected</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setManageBankOpen(false)}>
                Close
              </Button>
              <Link to="/connect-bank" className="flex-1">
                <Button variant="accent" className="w-full">
                  {bankAccount ? "Update Bank" : "Connect Bank"}
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={manageVehicleOpen} onOpenChange={setManageVehicleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vehicle Information</DialogTitle>
            <DialogDescription>
              View and manage your vehicle verification status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {vehicle ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <Car className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.vin ? `VIN: ${vehicle.vin.slice(0, 8)}...` : vehicle.license_plate ? `Plate: ${vehicle.license_plate}` : "Vehicle Info"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={vehicle.is_verified ? "verified" : "outline"}>
                      {vehicle.is_verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  
                  {vehicle.insurance_provider && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Insurance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{vehicle.insurance_provider}</span>
                          <Badge variant={vehicle.insurance_verified ? "success" : "outline"} className="text-xs">
                            {vehicle.insurance_verified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {vehicle.is_verified && (
                  <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
                    <Badge variant="verified" className="mb-2">
                      <Car className="h-3 w-3 mr-1" />
                      AutoFloat Verified
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      You have access to the maximum $3,000 monthly limit
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-2">No vehicle verified</p>
                <p className="text-xs text-muted-foreground">
                  Verify your vehicle to unlock up to $3,000 monthly access
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setManageVehicleOpen(false)}>
                Close
              </Button>
              <Link to="/verify" className="flex-1">
                <Button variant="accent" className="w-full">
                  {vehicle?.is_verified ? "Update Vehicle" : "Verify Vehicle"}
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentPlanOpen} onOpenChange={setPaymentPlanOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Plans</DialogTitle>
            <DialogDescription>
              Manage your repayment installments for covered bills.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activePaymentPlans.length === 0 ? (
              <div className="text-center py-6">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No active payment plans</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add a bill to create a payment plan
                </p>
              </div>
            ) : (
              activePaymentPlans.map((plan) => {
                const planInstallments = installments.filter(i => i.payment_plan_id === plan.id);
                const bill = bills.find(b => b.id === plan.bill_id);
                const progressPercent = (plan.amount_paid / plan.total_amount) * 100;
                
                return (
                  <div key={plan.id} className="rounded-xl border border-border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{bill?.name || "Bill Payment"}</p>
                        <p className="text-sm text-muted-foreground">
                          ${plan.amount_paid.toFixed(2)} of ${plan.total_amount.toFixed(2)} paid
                        </p>
                      </div>
                      <Badge variant={plan.status === "completed" ? "success" : "outline"}>
                        {plan.installments_paid}/{plan.installments_total} payments
                      </Badge>
                    </div>
                    
                    <Progress value={progressPercent} className="h-2" />
                    
                    <div className="space-y-2">
                      {planInstallments.map((inst) => (
                        <div 
                          key={inst.id} 
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            inst.status === "paid" ? "bg-success/10" : 
                            inst.status === "overdue" ? "bg-destructive/10" : "bg-secondary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {inst.status === "paid" ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : inst.status === "overdue" ? (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-foreground">${inst.amount.toFixed(2)}</p>
                              <p className="text-xs text-muted-foreground">
                                {inst.status === "paid" 
                                  ? `Paid ${inst.paid_at ? format(new Date(inst.paid_at), "MMM d") : ""}`
                                  : `Due ${format(new Date(inst.due_date), "MMM d")}`
                                }
                              </p>
                            </div>
                          </div>
                          {inst.status === "pending" && (
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => handleMakePayment(inst.id, inst.amount, plan.id)}
                              disabled={submitting}
                            >
                              {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Pay"}
                            </Button>
                          )}
                          {inst.status === "overdue" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleMakePayment(inst.id, inst.amount, plan.id)}
                              disabled={submitting}
                            >
                              {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Pay Now"}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <Button variant="outline" className="w-full" onClick={() => setPaymentPlanOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}