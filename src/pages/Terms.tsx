import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

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
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using Auto+ services, you agree to be bound by these Terms of 
                  Service. If you do not agree to these terms, you may not use our services.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p>
                  Auto+ provides a subscription-based bill coverage service that allows users to 
                  pay approved bills up to their tier limit. Access is not cash or credit; it is 
                  restricted to specific bill categories.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Subscription Terms</h2>
                <p>
                  Subscriptions are billed monthly in advance. You may cancel, pause, or downgrade 
                  your subscription at any time. Outstanding balances must be cleared before 
                  deactivation. There are no cancellation fees.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Auto-Settlement</h2>
                <p>
                  By using Auto+, you authorize us to automatically debit your connected bank 
                  account on your chosen settlement date. If settlement fails, your access will 
                  be paused until the balance is cleared. No late fees or penalties apply.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Auto Verification</h2>
                <p>
                  Auto verification is optional and allows users to unlock higher access limits. 
                  No lien is created on your vehicle. You must be the registered owner and 
                  maintain active insurance to remain verified.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Prohibited Uses</h2>
                <p>
                  Access may not be used for cash withdrawals, peer-to-peer transfers, gambling, 
                  cryptocurrency, or investments. Misuse may result in account suspension.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
                <p>
                  Auto+ is provided "as is" without warranties of any kind. We are not liable 
                  for any indirect, incidental, or consequential damages arising from your use 
                  of our services.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Contact</h2>
                <p>
                  Questions about these Terms should be directed to legal@autoplus.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}