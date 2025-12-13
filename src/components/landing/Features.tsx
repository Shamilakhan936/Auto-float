import { 
  CreditCard, 
  Car, 
  BanknoteIcon, 
  ShieldCheck, 
  RefreshCw,
  Zap
} from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Tiered Subscriptions",
    description: "Choose from Basic, Plus, or Auto+ plans with monthly access limits from $500 to $3,000.",
  },
  {
    icon: Car,
    title: "Auto Verification",
    description: "Verify your vehicle to unlock higher access limits. No lien created on your car.",
  },
  {
    icon: BanknoteIcon,
    title: "Zero Interest, Ever",
    description: "Predictable monthly cost with no interest charges or hidden fees.",
  },
  {
    icon: ShieldCheck,
    title: "Bill Category Limits",
    description: "Access restricted to approved categories: rent, utilities, insurance, and more.",
  },
  {
    icon: RefreshCw,
    title: "Auto-Settlement",
    description: "Balance clears automatically on your payday or month-end. Simple and stress-free.",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Connect your bank, verify your car, and get instant access to pay your bills.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-12 md:py-16 bg-secondary/30">
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to manage bills
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A smarter way to handle recurring expenses with complete transparency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-accent/30 animate-fade-in opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}