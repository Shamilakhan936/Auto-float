import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Clock } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Managing Your Monthly Bills Like a Pro",
    excerpt: "Learn the best strategies for staying on top of your recurring expenses without the stress.",
    date: "December 8, 2024",
    readTime: "5 min read",
    category: "Tips & Tricks",
  },
  {
    id: 2,
    title: "Understanding Auto Verification: What You Need to Know",
    excerpt: "Everything you need to know about how auto verification works and why it's safe.",
    date: "December 1, 2024",
    readTime: "4 min read",
    category: "Product",
  },
  {
    id: 3,
    title: "The Hidden Costs of Credit Card Bill Payments",
    excerpt: "Why using credit cards to pay bills might be costing you more than you think.",
    date: "November 25, 2024",
    readTime: "6 min read",
    category: "Finance",
  },
  {
    id: 4,
    title: "How AutoFloat is Different from Traditional Credit",
    excerpt: "A deep dive into why subscription-based bill coverage is a smarter choice.",
    date: "November 18, 2024",
    readTime: "7 min read",
    category: "Company",
  },
  {
    id: 5,
    title: "Building Better Financial Habits in 2025",
    excerpt: "Simple changes you can make today to improve your financial health next year.",
    date: "November 10, 2024",
    readTime: "5 min read",
    category: "Finance",
  },
  {
    id: 6,
    title: "Meet the Team: Engineering at AutoFloat",
    excerpt: "Get to know the people building the future of bill management.",
    date: "November 3, 2024",
    readTime: "4 min read",
    category: "Company",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="accent" className="mb-4">Blog</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-6">
                Insights & Updates
              </h1>
              <p className="text-lg text-muted-foreground">
                Tips, news, and stories about managing your finances smarter.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-8 pb-24">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {blogPosts.map((post, index) => (
                <Card
                  key={post.id}
                  className="hover:border-accent/30 transition-all cursor-pointer group animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-4">{post.category}</Badge>
                    <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}