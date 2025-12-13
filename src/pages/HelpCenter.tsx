import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Book, CreditCard, Car, Shield, Clock, User } from "lucide-react";

const categories = [
  { icon: Book, label: "Getting Started", count: 5 },
  { icon: CreditCard, label: "Billing & Payments", count: 6 },
  { icon: Car, label: "Auto Verification", count: 5 },
  { icon: Shield, label: "Security", count: 4 },
  { icon: Clock, label: "Settlement", count: 5 },
  { icon: User, label: "Account", count: 5 },
];

const faqData = [
  {
    category: "Getting Started",
    questions: [
      { q: "How do I sign up for AutoFloat?", a: "To sign up, click 'Get Started' on our homepage, create an account with your email and password, then follow the onboarding steps to verify your identity, select a plan, and connect your bank account." },
      { q: "What documents do I need to sign up?", a: "You'll need a valid driver's license and a recent paystub for identity verification and income confirmation. These documents are uploaded securely during the onboarding process." },
      { q: "Which bill categories are supported?", a: "AutoFloat supports rent, utilities, phone bills, insurance, childcare, and auto-related expenses. Cash advances, P2P transfers, gambling, crypto, and investments are not supported." },
      { q: "What are the subscription tiers?", a: "We offer three tiers: Basic ($15/month, up to $200 access), Plus ($25/month, up to $300 access), and Auto+ ($75/month, up to $1,000 access). All plans include auto verification features." },
      { q: "Can I skip steps during signup?", a: "Yes, you can skip the vehicle verification and bank connection steps during signup. However, connecting these later is required to fully use AutoFloat's features." },
    ]
  },
  {
    category: "Billing & Payments",
    questions: [
      { q: "How does bill payment work?", a: "Once you're set up, you can use your AutoFloat access to pay approved bills. We cover the bill for you, and you repay through a 4-installment payment plan with the first two installments due at signup." },
      { q: "What is 'Total Dues Today' at signup?", a: "Total Dues Today includes your monthly subscription fee plus the first two installments of your payment plan. This covers your upfront costs to start using AutoFloat." },
      { q: "Are there any interest charges or late fees?", a: "No. AutoFloat charges no interest and no late fees. Your only cost is the predictable monthly subscription fee." },
      { q: "How do I upgrade or downgrade my plan?", a: "You can change your plan anytime from your dashboard. Upgrades take effect immediately, while downgrades apply at the start of your next billing cycle." },
      { q: "Can I pause my subscription?", a: "Yes, you can pause your subscription anytime without penalties. Your access will be paused, and you can resume whenever you're ready." },
      { q: "What payment methods are accepted?", a: "We accept payments via connected bank accounts through ACH transfers. Credit and debit cards are not currently supported for subscription payments." },
    ]
  },
  {
    category: "Auto Verification",
    questions: [
      { q: "How do I verify my vehicle?", a: "During onboarding or from your dashboard, enter your VIN (Vehicle Identification Number) or license plate number. Our system will verify your vehicle ownership automatically." },
      { q: "What does auto verification unlock?", a: "Auto verification unlocks higher access limits and grants you a verified badge on your account. It's required for the Auto+ tier's full benefits." },
      { q: "Is auto insurance verification required?", a: "Yes, we verify your auto insurance to ensure your vehicle is properly covered. This is part of our verification process and helps maintain account access." },
      { q: "What happens if my insurance lapses?", a: "If your insurance lapses, your account access will be automatically paused. Once you update your insurance information and it's verified, access is restored automatically." },
      { q: "Do you place a lien on my vehicle?", a: "No. AutoFloat never places a lien on your vehicle. Your car remains fully yours with no encumbrances." },
    ]
  },
  {
    category: "Security",
    questions: [
      { q: "How is my personal information protected?", a: "We use bank-level encryption (256-bit SSL) to protect all your data. Your information is stored securely and never shared with third parties without your consent." },
      { q: "Is my bank connection secure?", a: "Yes. We use secure, read-only connections to verify your bank account. We cannot move money without your authorization and use industry-standard security protocols." },
      { q: "What happens to my uploaded documents?", a: "Your documents are encrypted and stored securely. They're only used for verification purposes and are handled in compliance with data protection regulations." },
      { q: "How do I report suspicious activity?", a: "If you notice any suspicious activity on your account, contact our support team immediately through the Help Center. We'll investigate and secure your account." },
    ]
  },
  {
    category: "Settlement",
    questions: [
      { q: "What is auto-settlement?", a: "Auto-settlement automatically collects your payment installments via ACH on your selected schedule (weekly or bi-weekly). It ensures you stay on track without manual payments." },
      { q: "What happens if a settlement fails?", a: "If a settlement fails, your access is automatically paused (no penalties). Once you resolve the payment issue, your access is restored automatically." },
      { q: "Can I choose my settlement frequency?", a: "Yes, during setup you can choose between weekly or bi-weekly settlement. You can change this preference from your account settings." },
      { q: "When are settlements processed?", a: "Settlements are processed on your chosen frequency starting from your signup date. You'll receive notifications before each scheduled settlement." },
      { q: "What if I want to pay off early?", a: "You can make additional payments anytime from your dashboard. Early payments reduce your remaining balance and can help you access more funds sooner." },
    ]
  },
  {
    category: "Account",
    questions: [
      { q: "How do I update my profile information?", a: "Go to your Dashboard and click on Settings or your profile icon. From there, you can update your personal information, contact details, and preferences." },
      { q: "How do I connect a different bank account?", a: "From your Dashboard, navigate to Bank Settings and select 'Add Bank Account'. Follow the secure connection process to link your new account." },
      { q: "What if I disconnect my bank?", a: "If you disconnect your bank, your account access will be paused until you connect a valid bank account. No penalties are charged during this time." },
      { q: "How do I cancel my account?", a: "You can cancel anytime from your Dashboard settings. Any outstanding balance must be paid, but there are no cancellation fees." },
      { q: "How does the referral program work?", a: "Share your unique referral code with friends. When they sign up and complete onboarding, you both receive a $5 reward credited to your account." },
    ]
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = faqData.filter(section => 
    !selectedCategory || section.category === selectedCategory
  ).map(section => ({
    ...section,
    questions: section.questions.filter(item =>
      !searchQuery || 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="accent" className="mb-4">Help Center</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
                How can we help you?
              </h1>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories */}
        <section className="py-16">
          <div className="container px-4">
            <h2 className="text-xl font-bold text-foreground mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <Card
                  key={category.label}
                  className={`hover:border-accent/30 transition-all cursor-pointer animate-fade-in opacity-0 ${selectedCategory === category.label ? 'border-accent bg-accent/5' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedCategory(selectedCategory === category.label ? null : category.label)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${selectedCategory === category.label ? 'bg-accent text-accent-foreground' : 'bg-accent/10 text-accent'}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <p className="font-medium text-foreground text-sm mb-1">{category.label}</p>
                    <p className="text-xs text-muted-foreground">{category.count} articles</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Accordion */}
        <section className="py-16 bg-secondary/30">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {selectedCategory ? `${selectedCategory} FAQ` : 'Frequently Asked Questions'}
              </h2>
              
              {filteredFaqs.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No questions found matching your search.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredFaqs.map((section) => (
                  <div key={section.category} className="mb-8">
                    {!selectedCategory && (
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        {section.category}
                      </h3>
                    )}
                    <Accordion type="single" collapsible className="space-y-2">
                      {section.questions.map((item, index) => (
                        <AccordionItem 
                          key={index} 
                          value={`${section.category}-${index}`}
                          className="bg-card border border-border rounded-lg px-4"
                        >
                          <AccordionTrigger className="text-left text-foreground hover:no-underline">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}