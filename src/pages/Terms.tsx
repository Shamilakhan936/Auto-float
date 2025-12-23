import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

const termsSections = [
  {
    number: 1,
    title: "Acceptance of Terms",
    content: "By accessing or using AutoFloat services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.",
  },
  {
    number: 2,
    title: "Description of Service",
    content: "AutoFloat provides a subscription-based bill coverage service that allows users to pay approved bills up to their tier limit. Access is not cash or credit; it is restricted to specific bill categories.",
  },
  {
    number: 3,
    title: "Subscription Terms",
    content: "Subscriptions are billed monthly in advance. You may cancel, pause, or downgrade your subscription at any time. Outstanding balances must be cleared before deactivation. There are no cancellation fees.",
  },
  {
    number: 4,
    title: "Auto-Settlement",
    content: "By using AutoFloat, you authorize us to automatically debit your connected bank account on your chosen settlement date. If settlement fails, your access will be paused until the balance is cleared. No late fees or penalties apply.",
  },
  {
    number: 5,
    title: "Auto Verification",
    content: "Auto verification is optional and allows users to unlock higher access limits. No lien is created on your vehicle. You must be the registered owner and maintain active insurance to remain verified.",
  },
  {
    number: 6,
    title: "Prohibited Uses",
    content: "Access may not be used for cash withdrawals, peer-to-peer transfers, gambling, cryptocurrency, or investments. Misuse may result in account suspension.",
  },
  {
    number: 7,
    title: "Limitation of Liability",
    content: "AutoFloat is provided \"as is\" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.",
  },
  {
    number: 8,
    title: "Contact",
    content: "Questions about these Terms should be directed to legal@autofloat.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-16 md:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl">
            <Badge variant="accent" className="mb-4">Legal</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: December 13, 2024</p>
            
            <div className="prose prose-lg text-muted-foreground space-y-8">
              {termsSections.map((section) => (
                <section key={section.number}>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {section.number}. {section.title}
                  </h2>
                  <p>{section.content}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}