import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Clock, CheckCircle2 } from "lucide-react";

const trustIndicators = [
  { icon: Shield, text: "No credit impact" },
  { icon: Clock, text: "Pause anytime" },
  { icon: CheckCircle2, text: "Auto-settlement" },
];

export function Hero() {
  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent" />
      
      <div className="container relative px-4 py-12 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="accent" className="mb-6 animate-fade-in">
            No Interest • No Fees • No Lien
          </Badge>
          
          <h1 
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in opacity-0"
            style={{ animationDelay: '100ms' }}
          >
            Predictable Bill Coverage,{" "}
            <span className="text-accent">Simplified</span>
          </h1>
          
          <p 
            className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-fade-in opacity-0"
            style={{ animationDelay: '200ms' }}
          >
            Subscribe to AutoFloat for predictable monthly bill coverage. Verify your car to unlock higher access limits with zero interest and zero penalties.
          </p>
          
          <div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in opacity-0"
            style={{ animationDelay: '300ms' }}
          >
            <Link to="/plans">
              <Button variant="hero" size="xl" className="group">
                View Plans
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="xl"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>
          
          <div 
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 animate-fade-in opacity-0"
            style={{ animationDelay: '400ms' }}
          >
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div key={index} className="flex items-center justify-center gap-3 text-muted-foreground">
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium">{indicator.text}</span>
            </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}