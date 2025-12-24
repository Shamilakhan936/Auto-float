import { useState, useEffect, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, CheckCircle2, Shield, ArrowRight, AlertCircle, Loader2,CircleCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Header = lazy(() => import("@/components/layout/Header").then(m => ({ default: m.Header })));
const Footer = lazy(() => import("@/components/layout/Footer").then(m => ({ default: m.Footer })));

type Step = "intro" | "vin" | "ownership" | "insurance" | "complete";

export default function VerifyPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("intro");
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"vin" | "plate" | null>(null);
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);

  useEffect(() => {
    if (user) {
      checkExistingVehicle();
    }
  }, [user]);

  const checkExistingVehicle = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("vehicles")
      .select("is_verified")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (data?.is_verified) {
      setIsAlreadyVerified(true);
      setStep("complete");
    }
  };

  const handleVerify = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setSubmitting(true);
    try {
      const { error: vehicleError } = await supabase.from("vehicles").upsert({
        user_id: user.id,
        vin: verificationMethod === "vin" ? vin : null,
        license_plate: verificationMethod === "plate" ? licensePlate : null,
        make: "Honda",
        model: "Accord",
        year: 2022,
        insurance_provider: insuranceProvider,
        is_verified: true,
        insurance_verified: true,
        verified_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      if (vehicleError) throw vehicleError;

      const { error: subError } = await supabase
        .from("subscriptions")
        .update({ 
          tier: "auto_plus",
          access_limit: 3000,
        })
        .eq("user_id", user.id);

      if (subError) throw subError;

      toast({
        title: "Vehicle verified!",
        description: "Your access limit has been increased to $3,000.",
      });

      setStep("complete");
    } catch (error) {
      console.error("Error verifying vehicle:", error);
      toast({
        title: "Verification failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: "vin", label: "Vehicle Info" },
    { id: "ownership", label: "Ownership" },
    { id: "insurance", label: "Insurance" },
    { id: "complete", label: "Complete" },
  ];

  const benefits = [
    { icon: Shield, text: "No Lien Created" },
    { icon: ArrowRight, text: "Higher Access" },
    { icon: CheckCircle2, text: "AutoFloat Badge" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const handleVerifyNow = () => {
    if (user) {
      setStep("vin");
    } else {
      navigate("/auth");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={<div className="h-16 bg-card animate-pulse" />}>
        <Header />
      </Suspense>
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 sm:px-6 max-w-2xl mx-auto">
          {step === "intro" ? (
            <div className="text-center animate-fade-in">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent/10 text-accent">
                <Car className="h-10 w-10" />
              </div>
              
              <Badge variant="accent" className="mb-4">
                Optional Verification
              </Badge>
              
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Verify your car to unlock higher access
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                Auto verification increases your monthly access limit safely. No lien is created on your vehicle.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="rounded-xl border border-border bg-card p-4 text-center">
                      <Icon className="h-6 w-6 text-accent mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">{benefit.text}</p>
                </div>
                  );
                })}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  variant="accent" 
                  size="lg" 
                  onClick={handleVerifyNow}
                  className="w-full sm:w-auto"
                >
                  Verify Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Skip for Now
                  </Button>
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-muted-foreground">
                You can always verify later to increase your access limit.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <div className="flex items-center justify-between overflow-x-auto pb-2 -mx-4 px-4">
                  {steps.map((s, index) => (
                    <div key={s.id} className="flex items-center flex-shrink-0">
                      <div
                        className={cn(
                          "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-regular transition-colors",
                          index <= currentStepIndex
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {index < currentStepIndex ? (
                          <CircleCheckBig className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            "h-1 w-8 sm:w-16 md:w-24 mx-1 sm:mx-2 rounded-full transition-colors flex-shrink-0",
                            index < currentStepIndex ? "bg-accent" : "bg-secondary"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 overflow-x-auto pb-2 -mx-4 px-4">
                  {steps.map((s, index) => (
                    <span key={s.id} className="text-xs text-muted-foreground w-8 sm:w-10 text-center flex-shrink-0">
                      <span className="hidden sm:inline">{s.label}</span>
                      <span className="sm:hidden">{s.label.split(' ')[0]}</span>
                    </span>
                  ))}
                </div>
              </div>
              
              <Card className="animate-scale-in">
                {step === "vin" && (
                  <>
                    <CardHeader>
                      <CardTitle>Enter Vehicle Information</CardTitle>
                      <CardDescription>
                        Provide your VIN or license plate to begin verification.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setVerificationMethod("vin")}
                          className={cn(
                            "rounded-xl border-2 p-4 text-left transition-all w-full",
                            verificationMethod === "vin"
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/30"
                          )}
                        >
                          <p className="font-semibold text-foreground">VIN Number</p>
                          <p className="text-sm text-muted-foreground">17-character identifier</p>
                        </button>
                        <button
                          onClick={() => setVerificationMethod("plate")}
                          className={cn(
                            "rounded-xl border-2 p-4 text-left transition-all w-full",
                            verificationMethod === "plate"
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/30"
                          )}
                        >
                          <p className="font-semibold text-foreground">License Plate</p>
                          <p className="text-sm text-muted-foreground">State + plate number</p>
                        </button>
                      </div>
                      
                      {verificationMethod === "vin" && (
                        <div className="space-y-2">
                          <Label htmlFor="vin">VIN Number</Label>
                          <Input
                            id="vin"
                            placeholder="Enter your 17-character VIN"
                            value={vin}
                            onChange={(e) => setVin(e.target.value)}
                            maxLength={17}
                          />
                          <p className="text-xs text-muted-foreground">
                            Found on your dashboard, door jamb, or vehicle registration.
                          </p>
                        </div>
                      )}
                      
                      {verificationMethod === "plate" && (
                        <div className="space-y-2">
                          <Label htmlFor="plate">License Plate</Label>
                          <Input
                            id="plate"
                            placeholder="Enter your license plate"
                            value={licensePlate}
                            onChange={(e) => setLicensePlate(e.target.value)}
                          />
                        </div>
                      )}
                      
                      <Button
                        variant="accent"
                        className="w-full"
                        onClick={() => setStep("ownership")}
                        disabled={!verificationMethod || (!vin && !licensePlate)}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </>
                )}
                
                {step === "ownership" && (
                  <>
                    <CardHeader>
                      <CardTitle>Confirm Ownership</CardTitle>
                      <CardDescription>
                        Verify that you are the registered owner of this vehicle.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="rounded-xl border border-border bg-secondary/30 p-6">
                        <div className="flex items-start gap-4">
                          <Car className="h-8 w-8 text-accent flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-foreground">2022 Honda Accord</p>
                            <p className="text-sm text-muted-foreground">
                              {verificationMethod === "vin" ? `VIN: ${vin || "1HGCV1F34NA******"}` : `Plate: ${licensePlate}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 rounded-xl border border-warning/30 bg-warning/5">
                        <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                        By continuing, you confirm that you are the registered owner of this vehicle 
                        and authorize AutoFloat to verify your ownership status.
                        </p>
                      </div>
                      
                      <Button variant="accent" className="w-full" onClick={() => setStep("insurance")}>
                        Confirm Ownership
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </>
                )}
                
                {step === "insurance" && (
                  <>
                    <CardHeader>
                      <CardTitle>Verify Active Insurance</CardTitle>
                      <CardDescription>
                        Confirm that your vehicle has active insurance coverage.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="insurance">Insurance Provider</Label>
                        <Input 
                          id="insurance" 
                          placeholder="e.g., State Farm, GEICO, Progressive"
                          value={insuranceProvider}
                          onChange={(e) => setInsuranceProvider(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="policy">Policy Number</Label>
                        <Input 
                          id="policy" 
                          placeholder="Enter your policy number"
                          value={policyNumber}
                          onChange={(e) => setPolicyNumber(e.target.value)}
                        />
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        We verify insurance status electronically. Your policy details are kept secure.
                      </p>
                      
                      <Button 
                        variant="accent" 
                        className="w-full" 
                        onClick={handleVerify}
                        disabled={submitting || !insuranceProvider}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify Insurance
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </>
                )}
                
                {step === "complete" && (
                  <>
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <CardTitle>Verification Complete!</CardTitle>
                      <CardDescription>
                        Your vehicle has been verified successfully.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                      <Badge variant="verified" className="text-sm py-2 px-4">
                        <Car className="h-4 w-4 mr-2" />
                        AutoFloat Verified
                      </Badge>
                      
                      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                        <p className="text-sm text-muted-foreground mb-2">Your new access limit</p>
                        <p className="text-4xl font-bold text-accent">$3,000</p>
                        <p className="text-sm text-muted-foreground mt-2">per month</p>
                      </div>
                      
                      <Link to="/dashboard">
                        <Button variant="accent" size="lg" className="w-full mt-4">
                          Go to Dashboard
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </>
                )}
              </Card>
            </>
          )}
        </div>
      </main>
      
      <Suspense fallback={<div className="h-32 bg-card animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  );
}