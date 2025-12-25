import { Shield, Clock, CheckCircle2 } from "lucide-react";

export function HeroTrustIndicators() {
  return (
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 animate-fade-in [animation-delay:400ms] opacity-0">
      <div className="flex items-center justify-center gap-3 text-muted-foreground">
        <Shield className="h-5 w-5 text-accent" />
        <span className="text-sm font-medium">No credit impact</span>
      </div>
      <div className="flex items-center justify-center gap-3 text-muted-foreground">
        <Clock className="h-5 w-5 text-accent" />
        <span className="text-sm font-medium">Pause anytime</span>
      </div>
      <div className="flex items-center justify-center gap-3 text-muted-foreground">
        <CheckCircle2 className="h-5 w-5 text-accent" />
        <span className="text-sm font-medium">Auto-settlement</span>
      </div>
    </div>
  );
}


