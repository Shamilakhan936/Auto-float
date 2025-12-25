import { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { AccessCard } from "@/components/dashboard/AccessCard";
import { NextPaymentCard } from "@/components/dashboard/NextPaymentCard";
import { PaymentPlanCard } from "@/components/dashboard/PaymentPlanCard";
import { InstallmentPlanTable } from "@/components/dashboard/InstallmentPlanTable";
import { UpcomingBillsCard } from "@/components/dashboard/UpcomingBillsCard";
import { PaidBillsCard } from "@/components/dashboard/PaidBillsCard";
import { ReferralSection } from "@/components/dashboard/ReferralSection";
import { QuickActionsGrid } from "@/components/dashboard/QuickActionsGrid";
import { AddBillDialog } from "@/components/dashboard/AddBillDialog";
import { ManageBankDialog } from "@/components/dashboard/ManageBankDialog";
import { ManageVehicleDialog } from "@/components/dashboard/ManageVehicleDialog";
import { PaymentPlanDialog } from "@/components/dashboard/PaymentPlanDialog";
import { tierNames } from "@/components/dashboard/constants";
import type { Bill, Subscription, Vehicle, BankAccount, PaymentPlan, PaymentInstallment } from "@/components/dashboard/types";

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
      const [
        { data: subData, error: subError },
        { data: billsData, error: billsError },
        { data: vehicleData, error: vehicleError },
        { data: bankData, error: bankError },
        { data: plansData, error: plansError },
        { data: installmentsData, error: installmentsError },
        { data: profileData }
      ] = await Promise.all([
        supabase.from("subscriptions").select("*").eq("user_id", user!.id).maybeSingle(),
        supabase.from("bills").select("*").eq("user_id", user!.id).order("due_date", { ascending: true }),
        supabase.from("vehicles").select("*").eq("user_id", user!.id).maybeSingle(),
        supabase.from("bank_accounts").select("*").eq("user_id", user!.id).eq("is_primary", true).maybeSingle(),
        supabase.from("payment_plans").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
        supabase.from("payment_installments").select("*").eq("user_id", user!.id).order("due_date", { ascending: true }),
        supabase.from("profiles").select("referral_code").eq("user_id", user!.id).maybeSingle()
      ]);

      if (subError) throw subError;
      if (subData) setSubscription(subData as Subscription);

      if (billsError) throw billsError;
      setBills((billsData as Bill[]) || []);

      if (vehicleError && vehicleError.code !== "PGRST116") throw vehicleError;
      if (vehicleData) setVehicle(vehicleData as Vehicle);

      if (bankError && bankError.code !== "PGRST116") throw bankError;
      if (bankData) setBankAccount(bankData as BankAccount);

      if (plansError) throw plansError;
      setPaymentPlans((plansData as PaymentPlan[]) || []);

      if (installmentsError) throw installmentsError;
      setInstallments((installmentsData as PaymentInstallment[]) || []);

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

  const handleAddBill = async (data: { name: string; category: string; amount: number; dueDate: string }) => {
    if (!user || !subscription) return;

    const amount = data.amount;
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
        name: data.name,
        category: data.category,
        amount: amount,
        due_date: data.dueDate,
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
        description: `${data.name} has been added with a 4-week payment plan.`,
      });

      setAddBillOpen(false);
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

  if (!user && !authLoading) {
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

  const handleQuickActionClick = (action: "addBill" | "bank" | "vehicle") => {
    if (action === "addBill") {
      setAddBillOpen(true);
    } else if (action === "bank") {
      setManageBankOpen(true);
    } else if (action === "vehicle") {
      setManageVehicleOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={<div className="h-16 bg-card animate-pulse" />}>
        <Header />
      </Suspense>
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4">
          <DashboardPageHeader 
            isVerified={isVerified} 
            onAddBillClick={() => setAddBillOpen(true)} 
          />
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AccessCard
              accessUsed={accessUsed}
              accessLimit={accessLimit}
              accessRemaining={accessRemaining}
              accessPercent={accessPercent}
              nextSettlement={nextSettlement}
              tierName={tierName}
            />
            <NextPaymentCard
              daysUntilSettlement={daysUntilSettlement}
              accessUsed={accessUsed}
            />
          </div>

          {/* Payment Plan Card */}
          <PaymentPlanCard
            activePaymentPlans={activePaymentPlans}
            totalOutstanding={totalOutstanding}
            pendingInstallments={pendingInstallments}
            nextInstallment={nextInstallment}
            paymentPlans={paymentPlans}
            installments={installments}
            onViewDetails={() => setPaymentPlanOpen(true)}
            onMakePayment={handleMakePayment}
            submitting={submitting}
          />

          <InstallmentPlanTable
            paymentPlans={paymentPlans}
            installments={installments}
            onMakePayment={handleMakePayment}
            submitting={submitting}
          />
          
          {/* Bills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <UpcomingBillsCard 
              bills={bills.filter(b => b.status !== "paid")} 
              onAddBill={() => setAddBillOpen(true)} 
            />
            <PaidBillsCard bills={bills.filter(b => b.status === "paid")} />
          </div>

          <ReferralSection referralCode={referralCode} userId={user?.id} />

          <QuickActionsGrid
            onAddBill={() => setAddBillOpen(true)}
            onManageBank={() => setManageBankOpen(true)}
            onManageVehicle={() => setManageVehicleOpen(true)}
            bankAccount={bankAccount}
            isVerified={isVerified}
          />
        </div>
      </main>
      
      <Footer />

      <AddBillDialog
        open={addBillOpen}
        onOpenChange={setAddBillOpen}
        onSubmit={handleAddBill}
        accessRemaining={accessRemaining}
        submitting={submitting}
      />

      <ManageBankDialog
        open={manageBankOpen}
        onOpenChange={setManageBankOpen}
        bankAccount={bankAccount}
      />

      <ManageVehicleDialog
        open={manageVehicleOpen}
        onOpenChange={setManageVehicleOpen}
        vehicle={vehicle}
      />

      <PaymentPlanDialog
        open={paymentPlanOpen}
        onOpenChange={setPaymentPlanOpen}
        activePaymentPlans={activePaymentPlans}
        installments={installments}
        bills={bills}
        onMakePayment={handleMakePayment}
        submitting={submitting}
      />
    </div>
  );
}
