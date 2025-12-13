import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-16 md:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl">
            <Badge variant="accent" className="mb-4">Legal</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: December 13, 2024</p>
            
            <div className="prose prose-lg text-muted-foreground space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                <p>
                  We collect information you provide directly, including your name, email address, 
                  phone number, bank account information, and vehicle information when you use our 
                  auto verification feature.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                <p>
                  We use your information to provide and improve our services, process payments, 
                  verify your identity and vehicle ownership, communicate with you, and comply 
                  with legal obligations.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
                <p>
                  We do not sell your personal information. We may share information with service 
                  providers who help us operate our platform, with your consent, or as required by law.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your information, 
                  including encryption, secure data storage, and regular security audits.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Your Rights</h2>
                <p>
                  You have the right to access, correct, or delete your personal information. 
                  You may also request a copy of your data or opt out of certain communications.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at 
                  privacy@autofloat.com or call 1-800-AUTO-FLOAT.
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