import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Car, Zap, Crown, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Basic",
    tier: "basic" as const,
    icon: Zap,
    price: 15,
    maxAccess: 200,
    description: "Essential bill coverage for everyday needs",
    categories: ["Utilities", "Phone", "Internet"],
    features: ["Auto Verification", "Insurance Verification"],
    popular: false,
  },
  {
    name: "Plus",
    tier: "plus" as const,
    icon: Crown,
    price: 25,
    maxAccess: 300,
    description: "Extended coverage for growing expenses",
    categories: ["Utilities", "Insurance", "Phone", "Internet"],
    features: ["Auto Verification", "Insurance Verification"],
    popular: true,
  },
  {
    name: "AutoFloat",
    tier: "auto_plus" as const,
    icon: Car,
    price: 75,
    maxAccess: 1000,
    description: "Maximum coverage with auto verification benefits",
    categories: ["Rent", "Utilities", "Insurance", "Auto bills", "Phone"],
    features: ["Auto Verification", "Insurance Verification", "Priority Support"],
    popular: false,
  },
];

const trustBadges = [
  "No Interest",
  "No Late Fees",
  "Pause Anytime",
  "Auto-Settlement",
];

export default function PlansPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCurrentSubscription();
    }
  }, [user]);

  const fetchCurrentSubscription = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("subscriptions")
      .select("tier")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (data) {
      setCurrentTier(data.tier);
      setSelectedPlan(data.tier);
    }
  };

  const handleSelectPlan = async (tier: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setSelectedPlan(tier);
    setUpdating(true);

    try {
      const plan = plans.find(p => p.tier === tier);
      if (!plan) return;

      const { error } = await supabase
        .from("subscriptions")
        .update({ 
          tier: tier as "basic" | "plus" | "auto_plus",
          access_limit: plan.maxAccess,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setCurrentTier(tier);
      toast({
        title: "Plan updated!",
        description: `You're now on the ${plan.name} plan.`,
      });

      if (tier === "auto_plus") {
        navigate("/verify");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePlanButtonClick = (e: React.MouseEvent, tier: string) => {
    e.stopPropagation();
    handleSelectPlan(tier);
  };

  const getButtonContent = (tier: string) => {
    if (updating && selectedPlan === tier) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (currentTier === tier) {
      return "Current Plan";
    }
    return "Choose Plan";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <Badge variant="accent" className="mb-4">
                Choose Your Plan
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Simple, transparent pricing
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                No hidden fees, no interest charges. Just predictable monthly coverage for your bills.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <Card
                  key={plan.name}
                  className={cn(
                    "relative cursor-pointer transition-all duration-300 animate-fade-in opacity-0",
                    selectedPlan === plan.tier && "ring-2 ring-accent shadow-glow",
                    plan.popular && "border-accent/50",
                    currentTier === plan.tier && "border-accent"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedPlan(plan.tier)}
                >
                  <CardHeader className="text-center pb-2 pt-6">
                  {currentTier === plan.tier && (
                      <div className="mb-4">
                      <Badge variant="success" className="shadow-md">
                        Current Plan
                      </Badge>
                    </div>
                  )}
                  {plan.popular && currentTier !== plan.tier && (
                      <div className="mb-4">
                      <Badge variant="accent" className="shadow-md">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                    <div className={cn(
                      "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
                      plan.popular ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"
                    )}>
                      <plan.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    
                    <div className="mb-6 p-4 rounded-xl bg-secondary/50">
                      <p className="text-sm text-muted-foreground mb-1">Maximum Monthly Access</p>
                      <p className="text-2xl font-bold text-accent">${plan.maxAccess.toLocaleString()}</p>
                    </div>
                    
                    <ul className="space-y-3 text-left mb-6">
                      {plan.categories.map((category) => (
                        <li key={category} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-accent flex-shrink-0" />
                          {category}
                        </li>
                      ))}
                      {plan.features?.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-accent font-medium">
                          <Car className="h-4 w-4 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      variant={plan.popular ? "accent" : "outline"}
                      className="w-full"
                      onClick={(e) => handlePlanButtonClick(e, plan.tier)}
                      disabled={updating || currentTier === plan.tier}
                    >
                      {getButtonContent(plan.tier)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-sm text-muted-foreground mb-4">All plans include:</p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {trustBadges.map((badge) => (
                  <Badge key={badge} variant="outline" className="text-sm py-2 px-4">
                    {badge}
                </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}