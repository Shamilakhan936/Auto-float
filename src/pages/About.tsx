import { lazy, Suspense } from "react";
import { Users, Target, Heart, Zap, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Header = lazy(() => import("@/components/layout/Header").then(m => ({ default: m.Header })));
const Footer = lazy(() => import("@/components/layout/Footer").then(m => ({ default: m.Footer })));

interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ANIMATION_DELAY_MS = 100;

const values: Value[] = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Every decision we make starts with how it benefits our users.",
  },
  {
    icon: Target,
    title: "Transparency",
    description: "No hidden fees, no surprises. What you see is what you get.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "Financial tools should be available to everyone, not just the privileged few.",
  },
  {
    icon: Zap,
    title: "Simplicity",
    description: "We make complex financial processes feel effortless.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={<div className="h-16 bg-card animate-pulse" />}>
        <Header />
      </Suspense>
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="accent" className="mb-4">About Us</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
                Making bill payments predictable and stress-free
              </h1>
              <p className="text-lg text-muted-foreground">
                AutoFloat was founded with a simple mission: help people manage their recurring expenses 
                without the anxiety of unexpected costs or predatory interest rates.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-secondary/30">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Our Founder</h2>
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-16 h-16 text-accent" />
                  </div>
                </div>
                <div className="prose prose-lg text-muted-foreground space-y-4">
                  <p className="text-lg font-semibold text-foreground">Akeem Egbeyemi, Founder</p>
                  <p>
                    With prior experience building PayLaterr, Akeem Egbeyemi created AutoFloat to solve a 
                    critical gap in the market. He recognized that consumers with vehicles have an untapped 
                    asset that could help them access credit where traditional routes fall short.
                  </p>
                  <p>
                    AutoFloat was built to help consumers use their cars as part of the underwriting process 
                    to get their recurring expenses paid—empowering people who have been overlooked by 
                    conventional financial systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Our Values</h2>
              <p className="mt-4 text-muted-foreground">
                The principles that guide everything we do.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-border bg-card p-8 animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * ANIMATION_DELAY_MS}ms` }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
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