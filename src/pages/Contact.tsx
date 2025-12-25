import { useState } from "react";
import { lazy, Suspense } from "react";

const Header = lazy(() => import("@/components/layout/Header").then(m => ({ default: m.Header })));
const Footer = lazy(() => import("@/components/layout/Footer").then(m => ({ default: m.Footer })));
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@autoplus.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "1-800-AUTO-PLUS",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Finance Street, San Francisco, CA 94102",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "24/7 Available",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={<div className="h-16 bg-card animate-pulse" />}>
        <Header />
      </Suspense>
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="accent" className="mb-4">Contact Us</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground">
                Have a question or need help? We're here for you.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-8 pb-24">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Contact Information</h2>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <Card key={index}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <Icon className="h-5 w-5" />
                      </div>
                      <div>
                            <p className="text-sm text-muted-foreground">{info.label}</p>
                            <p className="font-medium text-foreground">{info.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                    );
                  })}
                </div>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="How can we help?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Tell us more..." rows={5} required />
                    </div>
                    <Button variant="accent" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <MessageCircle className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
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