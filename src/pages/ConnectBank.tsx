import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, ArrowRight, Lock, Shield, AlertCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const banks = [
  { id: "chase", name: "Chase", logo: "🏦" },
  { id: "bofa", name: "Bank of America", logo: "🏛️" },
  { id: "wells", name: "Wells Fargo", logo: "🏪" },
  { id: "citi", name: "Citibank", logo: "💳" },
  { id: "capital", name: "Capital One", logo: "🔷" },
  { id: "other", name: "Other Bank", logo: "🏢" },
];

type Step = "connect" | "settlement" | "confirm" | "complete";

export default function ConnectBankPage() {
  const [step, setStep] = useState<Step>("connect");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [settlementTiming, setSettlementTiming] = useState<"payday" | "month-end" | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setStep("settlement");
    }, 2000);
  };

  const handleActivate = () => {
    setStep("complete");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 max-w-2xl mx-auto">
          {/* Progress */}
          {step !== "complete" && (
            <div className="mb-10">
              <div className="flex items-center justify-center gap-4">
                {["connect", "settlement", "confirm"].map((s, index) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                        step === s || ["settlement", "confirm"].indexOf(step) > ["connect", "settlement", "confirm"].indexOf(s)
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {["settlement", "confirm"].indexOf(step) > ["connect", "settlement", "confirm"].indexOf(s) ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 2 && (
                      <div
                        className={cn(
                          "h-1 w-16 sm:w-24 mx-2 rounded-full transition-colors",
                          ["settlement", "confirm"].indexOf(step) > index ? "bg-accent" : "bg-secondary"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Step: Connect Bank */}
          {step === "connect" && (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Building2 className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Connect Your Bank</CardTitle>
                <CardDescription>
                  Link your primary bank account for auto-settlement.
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
                  {isConnecting ? "Connecting..." : "Connect Bank"}
                  {!isConnecting && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Step: Settlement Timing */}
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
                  <button
                    onClick={() => setSettlementTiming("payday")}
                    className={cn(
                      "rounded-xl border-2 p-6 text-left transition-all",
                      settlementTiming === "payday"
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/30"
                    )}
                  >
                    <p className="text-lg font-semibold text-foreground mb-2">On Payday</p>
                    <p className="text-sm text-muted-foreground">
                      Balance clears when your paycheck arrives (you set the date).
                    </p>
                  </button>
                  <button
                    onClick={() => setSettlementTiming("month-end")}
                    className={cn(
                      "rounded-xl border-2 p-6 text-left transition-all",
                      settlementTiming === "month-end"
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/30"
                    )}
                  >
                    <p className="text-lg font-semibold text-foreground mb-2">Month-End</p>
                    <p className="text-sm text-muted-foreground">
                      Balance clears on the last day of each month.
                    </p>
                  </button>
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
          
          {/* Step: Confirm */}
          {step === "confirm" && (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Activate Your Subscription</CardTitle>
                <CardDescription>
                  Review your settings and activate Auto+.
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
                    <span className="font-medium text-accent">$40/month • Auto+</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-xl border border-warning/30 bg-warning/5">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Your balance clears at the end of each cycle. If settlement fails, 
                    access pauses — no penalties. You can cancel anytime.
                  </p>
                </div>
                
                <Button variant="accent" size="lg" className="w-full" onClick={handleActivate}>
                  Activate Subscription
                  <CheckCircle2 className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Step: Complete */}
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
                Your Auto+ subscription is now active. Start adding bills to your dashboard.
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
      
      <Footer />
    </div>
  );
}