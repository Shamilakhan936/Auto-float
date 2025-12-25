import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

const privacySections = [
  {
    number: 1,
    title: "Information We Collect",
    content: "We collect information you provide directly, including your name, email address, phone number, bank account information, and vehicle information when you use our auto verification feature.",
  },
  {
    number: 2,
    title: "How We Use Your Information",
    content: "We use your information to provide and improve our services, process payments, verify your identity and vehicle ownership, communicate with you, and comply with legal obligations.",
  },
  {
    number: 3,
    title: "Information Sharing",
    content: "We do not sell your personal information. We may share information with service providers who help us operate our platform, with your consent, or as required by law.",
  },
  {
    number: 4,
    title: "Data Security",
    content: "We implement industry-standard security measures to protect your information, including encryption, secure data storage, and regular security audits.",
  },
  {
    number: 5,
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal information. You may also request a copy of your data or opt out of certain communications.",
  },
  {
    number: 6,
    title: "Contact Us",
    content: "If you have questions about this Privacy Policy, please contact us at privacy@autofloat.com or call 1-800-AUTO-FLOAT.",
  },
];

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
              {privacySections.map((section) => (
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