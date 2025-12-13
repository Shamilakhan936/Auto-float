import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Car, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Shield, 
  CreditCard,
  Zap,
  Crown,
  Building2,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { addDays } from "date-fns";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupStep = "account" | "plan" | "vehicle" | "bank" | "payment" | "complete";

const plans = [
  {
    name: "Basic",
    tier: "basic" as const,
    icon: Zap,
    price: 15,
    maxAccess: 500,
    description: "Essential bill coverage",
  },
  {
    name: "Plus",
    tier: "plus" as const,
    icon: Crown,
    price: 25,
    maxAccess: 1500,
    description: "Extended coverage",
    popular: true,
  },
  {
    name: "Auto+",
    tier: "auto_plus" as const,
    icon: Car,
    price: 40,
    maxAccess: 3000,
    description: "Maximum coverage",
  },
];

const banks = [
  { id: "chase", name: "Chase", logo: "🏦" },
  { id: "bofa", name: "Bank of America", logo: "🏛️" },
  { id: "wells", name: "Wells Fargo", logo: "🏪" },
  { id: "citi", name: "Citibank", logo: "💳" },
  { id: "capital", name: "Capital One", logo: "🔷" },
  { id: "other", name: "Other Bank", logo: "🏢" },
];

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Signup flow state
  const [signupStep, setSignupStep] = useState<SignupStep>("account");
  const [userId, setUserId] = useState<string | null>(null);
  
  // Plan selection
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "plus" | "auto_plus">("plus");
  
  // Vehicle verification
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"vin" | "plate" | null>(null);
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  
  // Bank connection
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [settlementTiming, setSettlementTiming] = useState<"payday" | "month-end" | null>(null);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = signInSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Sign in failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have signed in successfully.",
        });
        navigate("/dashboard");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = signUpSchema.safeParse({ firstName, lastName, email, password });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      const { error, data } = await signUp(email, password, firstName, lastName);
      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        setUserId(data?.user?.id || null);
        setSignupStep("plan");
        toast({
          title: "Account created!",
          description: "Now let's set up your plan.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelection = async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      const plan = plans.find(p => p.tier === selectedPlan);
      if (!plan) return;

      const { error } = await supabase
        .from("subscriptions")
        .update({ 
          tier: selectedPlan,
          access_limit: plan.maxAccess,
        })
        .eq("user_id", userId);

      if (error) throw error;

      setSignupStep("vehicle");
    } catch (error) {
      console.error("Error updating plan:", error);
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleVerification = async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      // Only insert vehicle if user provided info
      if (verificationMethod && (vin || licensePlate)) {
        const { error: vehicleError } = await supabase.from("vehicles").insert({
          user_id: userId,
          vin: verificationMethod === "vin" ? vin : null,
          license_plate: verificationMethod === "plate" ? licensePlate : null,
          make: "Verified",
          model: "Vehicle",
          year: new Date().getFullYear(),
          insurance_provider: insuranceProvider || null,
          is_verified: true,
          insurance_verified: !!insuranceProvider,
          verified_at: new Date().toISOString(),
        });

        if (vehicleError) throw vehicleError;

        // Update subscription to auto_plus with higher limit
        const { error: subError } = await supabase
          .from("subscriptions")
          .update({ 
            tier: "auto_plus",
            access_limit: 3000,
          })
          .eq("user_id", userId);

        if (subError) throw subError;

        setSelectedPlan("auto_plus");
        toast({
          title: "Vehicle verified!",
          description: "Your access limit has been increased to $3,000.",
        });
      }

      setSignupStep("bank");
    } catch (error) {
      console.error("Error verifying vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to verify vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const skipVehicleVerification = () => {
    setSignupStep("bank");
  };

  const handleBankConnection = async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      // Only insert bank if user selected one
      if (selectedBank) {
        const bankName = banks.find(b => b.id === selectedBank)?.name || "Bank";
        
        const { error: bankError } = await supabase.from("bank_accounts").insert({
          user_id: userId,
          bank_name: bankName,
          account_last_four: "4567",
          is_primary: true,
          is_connected: true,
        });

        if (bankError) console.error("Bank insert error:", bankError);
      }

      // Update subscription with settlement timing if selected
      if (settlementTiming) {
        const nextSettlement = addDays(new Date(), 30);
        const { error: subError } = await supabase
          .from("subscriptions")
          .update({ 
            settlement_timing: settlementTiming,
            next_settlement_date: nextSettlement.toISOString().split("T")[0],
            is_active: true,
          })
          .eq("user_id", userId);

        if (subError) console.error("Subscription update error:", subError);
      }

      setSignupStep("payment");
    } catch (error) {
      console.error("Error connecting bank:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const skipBankConnection = () => {
    setSignupStep("payment");
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    // Simulate payment processing for first two installments
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Payment processed!",
      description: "First two installments have been collected.",
    });
    
    setSignupStep("complete");
    setIsLoading(false);
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const signupSteps = [
    { id: "account", label: "Account" },
    { id: "plan", label: "Plan" },
    { id: "vehicle", label: "Vehicle" },
    { id: "bank", label: "Bank" },
    { id: "payment", label: "Payment" },
  ];

  const currentStepIndex = signupSteps.findIndex(s => s.id === signupStep);
  const currentPlan = plans.find(p => p.tier === selectedPlan);

  // Sign in form
  if (!isSignUp) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                  <Car className="h-6 w-6 text-accent-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">Auto+</span>
              </Link>
            </div>
            
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <Badge variant="accent" className="w-fit mx-auto mb-2">
                  Welcome Back
                </Badge>
                <CardTitle className="text-2xl">Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    variant="accent"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Please wait..." : "Sign In"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setSignupStep("account");
                        setErrors({});
                      }}
                      className="text-accent font-medium hover:underline"
                    >
                      Create one
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-accent hover:underline">Terms</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sign up flow
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <Car className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Auto+</span>
            </Link>
          </div>

          {/* Progress Steps */}
          {signupStep !== "complete" && (
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2">
                {signupSteps.map((s, index) => (
                  <div key={s.id} className="flex items-center">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                        index <= currentStepIndex
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {index < currentStepIndex ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < signupSteps.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 w-8 sm:w-12 mx-1 rounded-full transition-colors",
                          index < currentStepIndex ? "bg-accent" : "bg-secondary"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {signupSteps[currentStepIndex]?.label}
                </span>
              </div>
            </div>
          )}

          {/* Step: Account Creation */}
          {signupStep === "account" && (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <Badge variant="accent" className="w-fit mx-auto mb-2">
                  Create Account
                </Badge>
                <CardTitle className="text-2xl">Get started with Auto+</CardTitle>
                <CardDescription>
                  Create your account to start managing your bills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-xs text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    variant="accent"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Continue"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setErrors({});
                      }}
                      className="text-accent font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Plan Selection */}
          {signupStep === "plan" && (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
                <CardDescription>
                  Select the plan that fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.tier}
                      onClick={() => setSelectedPlan(plan.tier)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all",
                        selectedPlan === plan.tier
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/30"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl",
                          selectedPlan === plan.tier ? "bg-accent text-accent-foreground" : "bg-secondary"
                        )}>
                          <plan.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{plan.name}</p>
                            {plan.popular && (
                              <Badge variant="accent" className="text-xs">Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">${plan.price}</p>
                        <p className="text-xs text-muted-foreground">Up to ${plan.maxAccess.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
                
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={handlePlanSelection}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Continue"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step: Vehicle Verification */}
          {signupStep === "vehicle" && (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Car className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">Verify Your Vehicle</CardTitle>
                <CardDescription>
                  Verify your car and insurance to unlock $3,000 access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setVerificationMethod("vin")}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-all",
                      verificationMethod === "vin"
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/30"
                    )}
                  >
                    <p className="font-semibold text-foreground">VIN Number</p>
                    <p className="text-xs text-muted-foreground">17-character ID</p>
                  </button>
                  <button
                    onClick={() => setVerificationMethod("plate")}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-all",
                      verificationMethod === "plate"
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/30"
                    )}
                  >
                    <p className="font-semibold text-foreground">License Plate</p>
                    <p className="text-xs text-muted-foreground">State + plate</p>
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

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-accent" />
                    <span className="font-semibold text-foreground">Insurance Verification</span>
                  </div>
                  
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
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={skipVehicleVerification}
                    disabled={isLoading}
                  >
                    Skip for Now
                  </Button>
                  <Button
                    variant="accent"
                    className="flex-1"
                    onClick={handleVehicleVerification}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Bank Connection */}
          {signupStep === "bank" && (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Building2 className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">Connect Your Bank</CardTitle>
                <CardDescription>
                  Link your bank for auto-settlement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={cn(
                        "rounded-xl border-2 p-3 text-center transition-all",
                        selectedBank === bank.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/30"
                      )}
                    >
                      <span className="text-xl block mb-1">{bank.logo}</span>
                      <p className="text-xs font-medium text-foreground">{bank.name}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label>Settlement Timing</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSettlementTiming("payday")}
                      className={cn(
                        "rounded-xl border-2 p-4 text-left transition-all",
                        settlementTiming === "payday"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/30"
                      )}
                    >
                      <p className="font-semibold text-foreground">On Payday</p>
                      <p className="text-xs text-muted-foreground">When your check arrives</p>
                    </button>
                    <button
                      onClick={() => setSettlementTiming("month-end")}
                      className={cn(
                        "rounded-xl border-2 p-4 text-left transition-all",
                        settlementTiming === "month-end"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/30"
                      )}
                    >
                      <p className="font-semibold text-foreground">Month-End</p>
                      <p className="text-xs text-muted-foreground">Last day of month</p>
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={skipBankConnection}
                    disabled={isLoading}
                  >
                    Skip for Now
                  </Button>
                  <Button
                    variant="accent"
                    className="flex-1"
                    onClick={handleBankConnection}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Payment (First Two Installments) */}
          {signupStep === "payment" && (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <CreditCard className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">Complete Your Setup</CardTitle>
                <CardDescription>
                  Collect first two monthly installments to activate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl border border-border bg-secondary/30 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-semibold text-foreground">{currentPlan?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monthly Fee</span>
                    <span className="font-semibold text-foreground">${currentPlan?.price}/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Access Limit</span>
                    <span className="font-semibold text-accent">${currentPlan?.maxAccess.toLocaleString()}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold text-foreground">First 2 Months Total</span>
                    <span className="font-bold text-accent">${(currentPlan?.price || 0) * 2}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Why 2 months upfront?</strong> This ensures your account is active and ready to use immediately. Your next billing will be in 60 days.
                  </p>
                </div>
                
                <Button
                  variant="accent"
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Pay ${(currentPlan?.price || 0) * 2} & Activate
                      <CheckCircle2 className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step: Complete */}
          {signupStep === "complete" && (
            <div className="text-center animate-scale-in">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10 text-success animate-pulse-glow">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              
              <Badge variant="success" className="mb-4 py-2 px-4">
                Account Activated
              </Badge>
              
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                You're all set!
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Your Auto+ subscription is now active. Start adding bills to your dashboard.
              </p>
              
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 mb-8">
                <Badge variant="verified" className="mb-4">
                  <Car className="h-4 w-4 mr-2" />
                  Auto+ Verified
                </Badge>
                <p className="text-sm text-muted-foreground mb-2">Your monthly access</p>
                <p className="text-5xl font-bold text-accent">$3,000</p>
                <p className="text-sm text-muted-foreground mt-2">Ready to use for approved bills</p>
              </div>
              
              <Button variant="accent" size="xl" onClick={goToDashboard}>
                Go to Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Terms */}
          {signupStep !== "complete" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-accent hover:underline">Terms</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}