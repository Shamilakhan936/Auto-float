import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Server, Key, CheckCircle2 } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "Bank-Level Encryption",
    description: "All data is encrypted using AES-256 encryption, the same standard used by major financial institutions.",
  },
  {
    icon: Server,
    title: "Secure Data Centers",
    description: "Your data is stored in SOC 2 Type II certified data centers with 24/7 monitoring.",
  },
  {
    icon: Key,
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security to your account with SMS or app-based 2FA.",
  },
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    description: "Our security team monitors for suspicious activity around the clock.",
  },
  {
    icon: Shield,
    title: "Fraud Protection",
    description: "Advanced algorithms detect and prevent fraudulent transactions in real-time.",
  },
  {
    icon: CheckCircle2,
    title: "Regular Audits",
    description: "We undergo regular third-party security audits to ensure compliance with industry standards.",
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="accent" className="mb-4">Security</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
                Your Security is Our Priority
              </h1>
              <p className="text-lg text-muted-foreground">
                We use industry-leading security measures to protect your personal and financial information.
              </p>
            </div>
          </div>
        </section>
        
        {/* Security Features */}
        <section className="py-8 pb-24">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {securityFeatures.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Compliance */}
        <section className="py-16 bg-secondary/30">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Compliance & Certifications</h2>
              <p className="text-muted-foreground mb-8">
                We maintain compliance with major security and privacy standards.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Badge variant="outline" className="py-3 px-6 text-sm">SOC 2 Type II</Badge>
                <Badge variant="outline" className="py-3 px-6 text-sm">PCI DSS Level 1</Badge>
                <Badge variant="outline" className="py-3 px-6 text-sm">CCPA Compliant</Badge>
                <Badge variant="outline" className="py-3 px-6 text-sm">GDPR Ready</Badge>
              </div>
            </div>
          </div>
        </section>
        
        {/* Report */}
        <section className="py-16">
          <div className="container px-4">
            <div className="mx-auto max-w-xl text-center p-8 rounded-2xl border border-border bg-card">
              <Shield className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Report a Security Issue</h3>
              <p className="text-muted-foreground mb-4">
                Found a vulnerability? We appreciate responsible disclosure.
              </p>
              <p className="font-medium text-accent">security@autoplus.com</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}