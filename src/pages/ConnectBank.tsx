import { useState, useEffect, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, ArrowRight, Lock, Shield, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { addDays } from "date-fns";

const Header = lazy(() => import("@/components/layout/Header").then(m => ({ default: m.Header })));
const Footer = lazy(() => import("@/components/layout/Footer").then(m => ({ default: m.Footer })));

const banks = [
  { id: "chase", name: "Chase", logo: "🏦" },
  { id: "bofa", name: "Bank of America", logo: "🏛️" },
  { id: "wells", name: "Wells Fargo", logo: "🏪" },
  { id: "citi", name: "Citibank", logo: "💳" },
  { id: "capital", name: "Capital One", logo: "🔷" },
  { id: "other", name: "Other Bank", logo: "🏢" },
];

type Step = "connect" | "settlement" | "confirm" | "complete";

const settlementOptions = [
  {
    id: "payday" as const,
    title: "On Payday",
    description: "Balance clears when your paycheck arrives (you set the date).",
  },
  {
    id: "month-end" as const,
    title: "Month-End",
    description: "Balance clears on the last day of each month.",
  },
];

const stepLabels = ["connect", "settlement", "confirm"];

export default function ConnectBankPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("connect");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [settlementTiming, setSettlementTiming] = useState<"payday" | "month-end" | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingBank, setExistingBank] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkExistingBank();
    }
  }, [user]);

  const checkExistingBank = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("bank_name")
      .eq("user_id", user.id)
      .eq("is_primary", true)
      .maybeSingle();
    
    if (data) {
      setExistingBank(data.bank_name);
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setStep("settlement");
    }, 2000);
  };

  const handleActivate = async () => {
    if (!user || !selectedBank || !settlementTiming) return;

    setSubmitting(true);
    try {
      const bankName = banks.find(b => b.id === selectedBank)?.name || "Bank";
      
      const { error: bankError } = await supabase.from("bank_accounts").upsert({
        user_id: user.id,
        bank_name: bankName,
        account_last_four: "4567",
        is_primary: true,
        is_connected: true,
      }, { onConflict: "user_id,is_primary" });

      const nextSettlement = addDays(new Date(), 30);
      const { error: subError } = await supabase
        .from("subscriptions")
        .update({ 
          settlement_timing: settlementTiming,
          next_settlement_date: nextSettlement.toISOString().split("T")[0],
          is_active: true,
        })
        .eq("user_id", user.id);

      if (bankError) throw bankError;
      if (subError) throw subError;

      toast({
        title: "Subscription activated!",
        description: "Your AutoFloat subscription is now active.",
      });

      setStep("complete");
    } catch (error) {
      console.error("Error activating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to activate subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={<div className="h-16 bg-card animate-pulse" />}>
        <Header />
      </Suspense>
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 max-w-2xl mx-auto">
          {step !== "complete" && (
            <div className="mb-10">
              <div className="flex items-center justify-center gap-4">
                {stepLabels.map((s, index) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                        step === s || ["settlement", "confirm"].indexOf(step) > ["connect", "settlement", "confirm"].indexOf(s)
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {stepLabels.indexOf(step) > stepLabels.indexOf(s) ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 2 && (
                      <div
                        className={cn(
                          "h-1 w-16 sm:w-24 mx-2 rounded-full transition-colors",
                          stepLabels.indexOf(step) > index ? "bg-accent" : "bg-secondary"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {step === "connect" && (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Building2 className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Connect Your Bank</CardTitle>
                <CardDescription>
                  {existingBank 
                    ? `You have ${existingBank} connected. Select a different bank to update.`
                    : "Link your primary bank account for auto-settlement."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={cn(
                        "rounded-xl border-2 p-4 text-center transition-all hover:border-accent/30",
                        selectedBank === bank.id
                          ? "border-accent bg-accent/5"
                          : "border-border"
                      )}
                    >
                      <span className="text-2xl block mb-2">{bank.logo}</span>
                      <p className="text-sm font-medium text-foreground">{bank.name}</p>
                    </button>
                  ))}
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-secondary/30">
                  <Lock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Your bank credentials are encrypted and never stored on our servers.
                    We use bank-level security to protect your information.
                  </p>
                </div>
                
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={handleConnect}
                  disabled={!selectedBank || isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Connect Bank
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {step === "settlement" && (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Set Auto-Settlement Timing</CardTitle>
                <CardDescription>
                  Choose when your balance should clear each cycle.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {settlementOptions.map((option) => (
                  <button
                      key={option.id}
                      onClick={() => setSettlementTiming(option.id)}
                    className={cn(
                      "rounded-xl border-2 p-6 text-left transition-all",
                        settlementTiming === option.id
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/30"
                    )}
                  >
                      <p className="text-lg font-semibold text-foreground mb-2">{option.title}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                  </button>
                  ))}
                </div>
                
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={() => setStep("confirm")}
                  disabled={!settlementTiming}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
          
          {step === "confirm" && (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Activate Your Subscription</CardTitle>
                <CardDescription>
                  Review your settings and activate AutoFloat.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Bank Account</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {banks.find(b => b.id === selectedBank)?.name} ••••4567
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Settlement</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {settlementTiming === "payday" ? "On Payday" : "Month-End"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-accent/30 bg-accent/5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">Monthly Plan</span>
                    </div>
                    <span className="font-medium text-accent">$40/month • AutoFloat</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-xl border border-warning/30 bg-warning/5">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Your balance clears at the end of each cycle. If settlement fails, 
                    access pauses — no penalties. You can cancel anytime.
                  </p>
                </div>
                
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="w-full" 
                  onClick={handleActivate}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Activating...
                    </>
                  ) : (
                    <>
                      Activate Subscription
                      <CheckCircle2 className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {step === "complete" && (
            <div className="text-center animate-scale-in">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10 text-success animate-pulse-glow">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              
              <Badge variant="success" className="mb-4 py-2 px-4">
                Subscription Active
              </Badge>
              
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                You're all set!
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Your AutoFloat subscription is now active. Start adding bills to your dashboard.
              </p>
              
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 mb-8">
                <p className="text-sm text-muted-foreground mb-2">Your monthly access</p>
                <p className="text-5xl font-bold text-accent">$3,000</p>
                <p className="text-sm text-muted-foreground mt-2">Ready to use for approved bills</p>
              </div>
              
              <Link to="/dashboard">
                <Button variant="accent" size="xl">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Suspense fallback={<div className="h-32 bg-card animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  );
}