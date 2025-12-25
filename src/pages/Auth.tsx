import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Crown, Car } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { addDays } from "date-fns";
import { AuthLogo } from "@/components/auth/AuthLogo/AuthLogo";
import { SignInForm } from "@/components/auth/SignInForm/SignInForm";
import { AuthProgress } from "@/components/auth/AuthProgress/AuthProgress";
import { AccountStep } from "@/components/auth/SignUpSteps/AccountStep/AccountStep";
import { VerifyStep } from "@/components/auth/SignUpSteps/VerifyStep/VerifyStep";
import { PlanStep } from "@/components/auth/SignUpSteps/PlanStep/PlanStep";
import { BillsStep } from "@/components/auth/SignUpSteps/BillsStep/BillsStep";
import { PaymentStep } from "@/components/auth/SignUpSteps/PaymentStep/PaymentStep";
import { CompleteStep } from "@/components/auth/SignUpSteps/CompleteStep/CompleteStep";
import { PaymentModal } from "@/components/auth/PaymentModal/PaymentModal";
import { AuthTerms } from "@/components/auth/AuthTerms/AuthTerms";

const billCategories = [
  { value: "rent", label: "Rent/Mortgage" },
  { value: "utilities", label: "Utilities" },
  { value: "phone", label: "Phone/Internet" },
  { value: "insurance", label: "Insurance" },
  { value: "childcare", label: "Childcare" },
  { value: "daycare", label: "Daycare" },
  { value: "auto", label: "Auto" },
  { value: "tolls", label: "Tolls" },
  { value: "parking", label: "Parking Tickets" },
  { value: "beauty", label: "Beauty/Personal Care" },
  { value: "groceries", label: "Groceries" },
  { value: "medical", label: "Medical/Healthcare" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "home_maintenance", label: "Home Maintenance" },
  { value: "pest_control", label: "Pest Control" },
  { value: "lawn_care", label: "Lawn Care" },
  { value: "security", label: "Home Security" },
  { value: "hoa", label: "HOA Fees" },
  { value: "trash", label: "Trash/Recycling" },
  { value: "water", label: "Water/Sewer" },
  { value: "other", label: "Other" },
];

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

type SignupStep = "account" | "verify" | "plan" | "bills" | "payment" | "complete";

const plans = [
  {
    name: "Basic",
    tier: "basic" as const,
    icon: Zap,
    price: 15,
    maxAccess: 200,
    description: "Essential bill coverage",
    features: ["Auto Verification", "Insurance Verification"],
  },
  {
    name: "Plus",
    tier: "plus" as const,
    icon: Crown,
    price: 25,
    maxAccess: 300,
    description: "Extended coverage",
    features: ["Auto Verification", "Insurance Verification"],
    popular: true,
  },
  {
    name: "AutoFloat",
    tier: "auto_plus" as const,
    icon: Car,
    price: 75,
    maxAccess: 1000,
    description: "Maximum coverage",
    features: ["Auto Verification", "Insurance Verification", "Priority Support"],
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
  
  const [signupStep, setSignupStep] = useState<SignupStep>("account");
  const [userId, setUserId] = useState<string | null>(null);
  
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "plus" | "auto_plus">("plus");
  
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"vin" | "plate" | null>(null);
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [settlementTiming, setSettlementTiming] = useState<"payday" | "month-end" | null>(null);
  
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ssn, setSsn] = useState("");
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  const [paystubFile, setPaystubFile] = useState<File | null>(null);
  const [carInsuranceFile, setCarInsuranceFile] = useState<File | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);

  const [bills, setBills] = useState<Array<{ name: string; amount: string; category: string; dueDate: string }>>([]);
  const [newBillName, setNewBillName] = useState("");
  const [newBillAmount, setNewBillAmount] = useState("");
  const [newBillCategory, setNewBillCategory] = useState("");
  const [newBillDueDate, setNewBillDueDate] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  
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
        setFullName(`${firstName} ${lastName}`);
        setSignupStep("verify");
        toast({
          title: "Account created!",
          description: "Now let's verify your information.",
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

  const handleIdentityVerification = async () => {
    if (!userId) return;
    
    if (!fullName.trim() || !address.trim() || !phoneNumber.trim() || !ssn.trim()) {
      toast({
        title: "All fields required",
        description: "Please fill in all personal information fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!driverLicenseFile || !paystubFile || !carInsuranceFile) {
      toast({
        title: "Documents required",
        description: "Please upload your driver's license, paystub, and car insurance card.",
        variant: "destructive",
      });
      return;
    }
    
    setUploadingDocs(true);
    
    try {
      const dlPath = `${userId}/drivers-license-${Date.now()}`;
      const { error: dlError } = await supabase.storage
        .from("user-documents")
        .upload(dlPath, driverLicenseFile);
      
      if (dlError) throw dlError;
      
      const psPath = `${userId}/paystub-${Date.now()}`;
      const { error: psError } = await supabase.storage
        .from("user-documents")
        .upload(psPath, paystubFile);
      
      if (psError) throw psError;

      const ciPath = `${userId}/car-insurance-${Date.now()}`;
      const { error: ciError } = await supabase.storage
        .from("user-documents")
        .upload(ciPath, carInsuranceFile);
      
      if (ciError) throw ciError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          drivers_license_url: dlPath,
          paystub_url: psPath,
          car_insurance_url: ciPath,
        })
        .eq("user_id", userId);

      if (profileError) console.error("Profile update error:", profileError);
      
      toast({
        title: "Identity verified!",
        description: "Your information has been saved.",
      });
      
      setSignupStep("plan");
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingDocs(false);
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

      setSignupStep("bills");
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

      setSignupStep("plan");
    } catch (error) {
      console.error("Error verifying:", error);
      toast({
        title: "Error",
        description: "Failed to verify. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const skipVerification = () => {
    setSignupStep("plan");
  };

  const handleBankConnection = async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
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

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment processed!",
        description: "First two installments have been collected.",
      });
      
      setSignupStep("complete");
    } catch (error) {
      console.error("Error in setup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const addBill = () => {
    if (!newBillName || !newBillAmount || !newBillCategory || !newBillDueDate) {
      toast({
        title: "All fields required",
        description: "Please fill in all bill details.",
        variant: "destructive",
      });
      return;
    }
    setBills([...bills, { 
      name: newBillName, 
      amount: newBillAmount, 
      category: newBillCategory, 
      dueDate: newBillDueDate 
    }]);
    setNewBillName("");
    setNewBillAmount("");
    setNewBillCategory("");
    setNewBillDueDate("");
  };

  const removeBill = (index: number) => {
    setBills(bills.filter((_, i) => i !== index));
  };

  const handleBillsSubmit = async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      for (const bill of bills) {
        await supabase.from("bills").insert({
          user_id: userId,
          name: bill.name,
          amount: parseFloat(bill.amount),
          category: bill.category,
          due_date: bill.dueDate,
          status: "pending",
        });
      }

      setSignupStep("payment");
    } catch (error) {
      console.error("Error saving bills:", error);
      toast({
        title: "Error",
        description: "Failed to save bills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreditCardPayment = async () => {
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      toast({
        title: "All fields required",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    setProcessingPayment(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Payment successful!",
        description: `$${((currentPlan?.price || 0) + ((currentPlan?.price || 0) / 2)).toFixed(2)} has been charged.`,
      });

      setShowPaymentModal(false);
      setSignupStep("complete");
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again or use a different card.",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Sign in form
  if (!isSignUp) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <AuthLogo />
            </div>
            
            <SignInForm
              email={email}
              password={password}
              errors={errors}
              isLoading={isLoading}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleSignIn}
              onSwitchToSignUp={() => {
                setIsSignUp(true);
                setSignupStep("account");
                setErrors({});
              }}
            />
            
            <AuthTerms />
          </div>
        </div>
      </div>
    );
  }

  // Sign up flow
  const signupSteps = [
    { id: "account", label: "Account" },
    { id: "verify", label: "Verify" },
    { id: "plan", label: "Plan" },
    { id: "bills", label: "Bills" },
    { id: "payment", label: "Payment" },
  ];

  const currentStepIndex = signupSteps.findIndex(s => s.id === signupStep);
  const currentPlan = plans.find(p => p.tier === selectedPlan);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-xl">
          <AuthLogo />

          {signupStep !== "complete" && (
            <AuthProgress steps={signupSteps} currentStep={signupStep} />
          )}

          {signupStep === "account" && (
            <AccountStep
              firstName={firstName}
              lastName={lastName}
              email={email}
              password={password}
              errors={errors}
              isLoading={isLoading}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleCreateAccount}
              onSwitchToSignIn={() => {
                setIsSignUp(false);
                setErrors({});
              }}
            />
          )}

          {signupStep === "verify" && (
            <VerifyStep
              verificationMethod={verificationMethod}
              vin={vin}
              licensePlate={licensePlate}
              insuranceProvider={insuranceProvider}
              fullName={fullName}
              address={address}
              phoneNumber={phoneNumber}
              ssn={ssn}
              driverLicenseFile={driverLicenseFile}
              paystubFile={paystubFile}
              carInsuranceFile={carInsuranceFile}
              isLoading={isLoading}
              uploadingDocs={uploadingDocs}
              onVerificationMethodChange={setVerificationMethod}
              onVinChange={setVin}
              onLicensePlateChange={setLicensePlate}
              onInsuranceProviderChange={setInsuranceProvider}
              onFullNameChange={setFullName}
              onAddressChange={setAddress}
              onPhoneNumberChange={setPhoneNumber}
              onSsnChange={(value) => setSsn(value.replace(/\D/g, '').slice(0, 4))}
              onDriverLicenseFileChange={setDriverLicenseFile}
              onPaystubFileChange={setPaystubFile}
              onCarInsuranceFileChange={setCarInsuranceFile}
              onSkip={skipVerification}
              onContinue={async () => {
                await handleVehicleVerification();
                if (fullName && address && phoneNumber && ssn && driverLicenseFile && paystubFile && carInsuranceFile) {
                  await handleIdentityVerification();
                }
              }}
            />
          )}

          {signupStep === "plan" && (
            <PlanStep
              plans={plans}
              selectedPlan={selectedPlan}
              isLoading={isLoading}
              onPlanSelect={setSelectedPlan}
              onContinue={handlePlanSelection}
            />
          )}

          {signupStep === "bills" && (
            <BillsStep
              bills={bills}
              newBillName={newBillName}
              newBillAmount={newBillAmount}
              newBillCategory={newBillCategory}
              newBillDueDate={newBillDueDate}
              billCategories={billCategories}
              isLoading={isLoading}
              onNewBillNameChange={setNewBillName}
              onNewBillAmountChange={setNewBillAmount}
              onNewBillCategoryChange={setNewBillCategory}
              onNewBillDueDateChange={setNewBillDueDate}
              onAddBill={addBill}
              onRemoveBill={removeBill}
              onSkip={() => setSignupStep("payment")}
              onContinue={handleBillsSubmit}
            />
          )}

          {signupStep === "payment" && (
            <PaymentStep
              currentPlan={currentPlan}
              onEnterCardDetails={() => setShowPaymentModal(true)}
              onSkip={() => setSignupStep("complete")}
            />
          )}

          {signupStep === "complete" && (
            <CompleteStep
              currentPlan={currentPlan}
              onGoToDashboard={goToDashboard}
            />
          )}

          {signupStep !== "complete" && <AuthTerms />}
        </div>
      </div>

      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        currentPlan={currentPlan}
        cardName={cardName}
        cardNumber={cardNumber}
        cardExpiry={cardExpiry}
        cardCvc={cardCvc}
        processingPayment={processingPayment}
        onCardNameChange={setCardName}
        onCardNumberChange={(value) => setCardNumber(formatCardNumber(value))}
        onCardExpiryChange={(value) => setCardExpiry(formatExpiry(value))}
        onCardCvcChange={(value) => setCardCvc(value.replace(/\D/g, "").slice(0, 4))}
        onPay={handleCreditCardPayment}
        formatCardNumber={formatCardNumber}
        formatExpiry={formatExpiry}
      />
    </div>
  );
}