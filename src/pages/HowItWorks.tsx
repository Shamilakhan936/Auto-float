import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, CreditCard, Car, Building2, Receipt, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Header = lazy(() => import("@/components/layout/Header").then(m => ({ default: m.Header })));
const Footer = lazy(() => import("@/components/layout/Footer").then(m => ({ default: m.Footer })));

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

const ANIMATION_DELAY_MS = 150;

const steps: Step[] = [
  {
    number: "01",
    icon: CreditCard,
    title: "Choose Your Plan",
    description: "Select from Basic, Plus, or AutoFloat tiers based on your monthly bill coverage needs. Each plan offers different access limits to match your lifestyle.",
    features: ["No credit check required", "Cancel anytime", "Instant approval"],
  },
  {
    number: "02",
    icon: Car,
    title: "Verify Your Vehicle",
    description: "Optionally verify your car to unlock higher access limits. We verify your VIN and insurance—no lien on your vehicle, ever.",
    features: ["No lien on your car", "Quick verification", "Higher limits unlocked"],
  },
  {
    number: "03",
    icon: Building2,
    title: "Connect Your Bank",
    description: "Link your primary bank account and set your preferred auto-settlement timing. Choose weekly, bi-weekly, or monthly settlements.",
    features: ["Secure bank connection", "Flexible settlement dates", "Automatic payments"],
  },
  {
    number: "04",
    icon: Receipt,
    title: "Start Paying Bills",
    description: "Use your access to pay approved bills like utilities, insurance, and subscriptions. Your balance clears automatically each cycle.",
    features: ["Pay bills instantly", "Track all payments", "Auto-settlement"],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={<div className="h-16 bg-card animate-pulse" />}>
        <Header />
      </Suspense>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="accent" className="mb-4">How It Works</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
                Get started in minutes, not days
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                AutoFloat makes bill payments simple with a straightforward four-step process. 
                No complicated applications, no credit checks, no hidden fees.
              </p>
              <Link to="/auth">
                <Button variant="accent" size="lg">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Steps Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl space-y-12">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative flex flex-col md:flex-row gap-8 animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * ANIMATION_DELAY_MS}ms` }}
                >
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0 flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl">
                      {step.number}
                    </div>
                    <div className="md:hidden flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <step.icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 rounded-2xl border border-border bg-card p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                      {step.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute left-8 top-20 w-0.5 h-[calc(100%-2rem)] bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-4">
                Ready to simplify your bill payments?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of customers who trust AutoFloat to manage their monthly expenses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button variant="accent" size="lg">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/plans">
                  <Button variant="outline" size="lg">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Suspense fallback={<div className="h-32 bg-card animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  );
}