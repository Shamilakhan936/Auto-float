import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Clock, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent" />
      
      <div className="container relative px-4 py-12 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="accent" className="mb-6 animate-fade-in">
            No Interest • No Fees • No Lien
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in [animation-delay:100ms] opacity-0">
            Predictable Bill Coverage,{" "}
            <span className="text-accent">Simplified</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-fade-in [animation-delay:200ms] opacity-0">
            Subscribe to AutoFloat for predictable monthly bill coverage. Verify your car to unlock higher access limits with zero interest and zero penalties.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:300ms] opacity-0">
            <Link to="/plans">
              <Button variant="hero" size="xl" className="group">
                View Plans
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
          
          {/* Trust indicators */}
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
        </div>
      </div>
    </section>
  );
}