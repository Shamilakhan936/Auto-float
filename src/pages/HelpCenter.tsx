import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronRight, MessageCircle, Book, CreditCard, Car, Shield, Clock } from "lucide-react";

const categories = [
  { icon: Book, label: "Getting Started", count: 8 },
  { icon: CreditCard, label: "Billing & Payments", count: 12 },
  { icon: Car, label: "Auto Verification", count: 6 },
  { icon: Shield, label: "Security", count: 5 },
  { icon: Clock, label: "Settlement", count: 7 },
  { icon: MessageCircle, label: "Account", count: 9 },
];

const popularArticles = [
  { id: 1, title: "How do I verify my vehicle?", category: "Auto Verification" },
  { id: 2, title: "What happens if settlement fails?", category: "Settlement" },
  { id: 3, title: "How do I upgrade my plan?", category: "Billing & Payments" },
  { id: 4, title: "Which bill categories are supported?", category: "Getting Started" },
  { id: 5, title: "How to connect my bank account", category: "Getting Started" },
  { id: 6, title: "Can I pause my subscription?", category: "Account" },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
                  className="hover:border-accent/30 transition-all cursor-pointer animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
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
        
        {/* Popular Articles */}
        <section className="py-16 bg-secondary/30">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-foreground mb-6">Popular Articles</h2>
              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <Card
                    key={article.id}
                    className="hover:border-accent/30 transition-all cursor-pointer animate-fade-in opacity-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-foreground">{article.title}</p>
                        <p className="text-sm text-muted-foreground">{article.category}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact */}
        <section className="py-16">
          <div className="container px-4">
            <div className="mx-auto max-w-xl text-center p-8 rounded-2xl border border-border bg-card">
              <MessageCircle className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is available 24/7 to assist you.
              </p>
              <Button variant="accent">Contact Support</Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}