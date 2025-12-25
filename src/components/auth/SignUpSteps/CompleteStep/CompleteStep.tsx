import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Car, ArrowRight } from "lucide-react";

interface Plan {
  maxAccess: number;
}

interface CompleteStepProps {
  currentPlan: Plan | undefined;
  onGoToDashboard: () => void;
}

export function CompleteStep({
  currentPlan,
  onGoToDashboard,
}: CompleteStepProps) {
  return (
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
        Your AutoFloat subscription is now active. Start adding bills to your dashboard.
      </p>
      
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 mb-8">
        <Badge variant="verified" className="mb-4">
          <Car className="h-4 w-4 mr-2" />
          AutoFloat Verified
        </Badge>
        <p className="text-sm text-muted-foreground mb-2">Your monthly access</p>
        <p className="text-5xl font-bold text-accent">${currentPlan?.maxAccess.toLocaleString() || "3,000"}</p>
        <p className="text-sm text-muted-foreground mt-2">Ready to use for approved bills</p>
      </div>
      
      <Button variant="accent" size="xl" onClick={onGoToDashboard}>
        Go to Dashboard
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
}

