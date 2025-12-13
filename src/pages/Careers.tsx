import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";

const positions = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
  },
  {
    id: 3,
    title: "Customer Success Manager",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
  },
  {
    id: 4,
    title: "Data Analyst",
    department: "Analytics",
    location: "New York, NY",
    type: "Full-time",
  },
  {
    id: 5,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
  },
];

const benefits = [
  "Competitive salary & equity",
  "Remote-first culture",
  "Unlimited PTO",
  "Health, dental & vision",
  "401(k) matching",
  "Learning & development budget",
];

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="accent" className="mb-4">We're Hiring</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
                Join the Auto+ Team
              </h1>
              <p className="text-lg text-muted-foreground">
                Help us build the future of bill management. We're looking for passionate 
                people who want to make a real difference in people's financial lives.
              </p>
            </div>
          </div>
        </section>
        
        {/* Benefits */}
        <section className="py-12 bg-secondary/30">
          <div className="container px-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {benefits.map((benefit) => (
                <Badge key={benefit} variant="outline" className="py-2 px-4 text-sm">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        </section>
        
        {/* Open Positions */}
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-8">Open Positions</h2>
              
              <div className="space-y-4">
                {positions.map((position, index) => (
                  <Card
                    key={position.id}
                    className="hover:border-accent/30 transition-all cursor-pointer animate-fade-in opacity-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{position.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{position.department}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {position.location}
                          </span>
                          <Badge variant="secondary">{position.type}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Apply
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-12 text-center p-8 rounded-2xl border border-border bg-card">
                <p className="text-muted-foreground mb-4">
                  Don't see a role that fits? We're always looking for great people.
                </p>
                <Button variant="outline">
                  Send General Application
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}