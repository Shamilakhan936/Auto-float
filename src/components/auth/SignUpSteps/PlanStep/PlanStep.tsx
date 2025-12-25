import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Crown, Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  tier: "basic" | "plus" | "auto_plus";
  icon: typeof Zap;
  price: number;
  maxAccess: number;
  description: string;
  features: string[];
  popular?: boolean;
}

interface PlanStepProps {
  plans: Plan[];
  selectedPlan: "basic" | "plus" | "auto_plus";
  isLoading: boolean;
  onPlanSelect: (tier: "basic" | "plus" | "auto_plus") => void;
  onContinue: () => void;
}

export function PlanStep({
  plans,
  selectedPlan,
  isLoading,
  onPlanSelect,
  onContinue,
}: PlanStepProps) {
  return (
    <Card className="animate-scale-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
        <CardDescription>
          Select the plan that fits your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <button
                key={plan.tier}
                onClick={() => onPlanSelect(plan.tier)}
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
                    <IconComponent className="h-6 w-6" />
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
            );
          })}
        </div>
        
        <Button
          variant="accent"
          className="w-full"
          onClick={onContinue}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Continue"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

