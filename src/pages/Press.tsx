import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Calendar, ArrowRight } from "lucide-react";

const pressReleases = [
  {
    id: 1,
    date: "December 10, 2024",
    title: "AutoFloat Reaches 100,000 Active Subscribers",
    excerpt: "Major milestone demonstrates growing demand for subscription-based bill management solutions.",
  },
  {
    id: 2,
    date: "November 15, 2024",
    title: "AutoFloat Launches Auto Verification Feature",
    excerpt: "New feature allows users to unlock higher access limits by verifying vehicle ownership.",
  },
  {
    id: 3,
    date: "October 1, 2024",
    title: "AutoFloat Raises $25M Series A",
    excerpt: "Funding round led by top fintech investors will accelerate product development and expansion.",
  },
  {
    id: 4,
    date: "August 20, 2024",
    title: "AutoFloat Named 'Best Fintech Startup' at Innovation Awards",
    excerpt: "Recognition highlights AutoFloat's commitment to transparent, user-friendly financial solutions.",
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="accent" className="mb-4">Press & Media</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
                AutoFloat in the News
              </h1>
              <p className="text-lg text-muted-foreground">
                Stay up to date with the latest news, announcements, and media coverage.
              </p>
            </div>
          </div>
        </section>
        
        {/* Media Kit */}
        <section className="py-12 bg-secondary/30">
          <div className="container px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <p className="text-muted-foreground">Need brand assets?</p>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Media Kit
              </Button>
            </div>
          </div>
        </section>
        
        {/* Press Releases */}
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-8">Press Releases</h2>
              
              <div className="space-y-6">
                {pressReleases.map((release, index) => (
                  <Card
                    key={release.id}
                    className="hover:border-accent/30 transition-all cursor-pointer animate-fade-in opacity-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        {release.date}
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">{release.title}</h3>
                      <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                      <Button variant="link" className="p-0 h-auto text-accent">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-12 text-center p-8 rounded-2xl border border-border bg-card">
                <p className="font-semibold text-foreground mb-2">Media Inquiries</p>
                <p className="text-muted-foreground mb-4">
                  For press inquiries, please contact our communications team.
                </p>
                <Button variant="accent">
                  press@autofloat.com
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
