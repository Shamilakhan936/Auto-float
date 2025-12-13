import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Plan",
    description: "Select from Basic, Plus, or Auto+ tiers based on your monthly bill coverage needs.",
  },
  {
    number: "02",
    title: "Verify Your Vehicle",
    description: "Optionally verify your car to unlock higher access limits. Quick and secure process.",
  },
  {
    number: "03",
    title: "Connect Your Bank",
    description: "Link your primary bank account and set your preferred auto-settlement timing.",
  },
  {
    number: "04",
    title: "Start Paying Bills",
    description: "Use your access to pay approved bills. Balance clears automatically each cycle.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-32">
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How Auto+ Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started in minutes with our simple four-step process.
          </p>
        </div>
        
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex gap-6 animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && index % 2 === 0 && (
                  <ArrowRight className="hidden md:block absolute -right-4 top-5 h-5 w-5 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}