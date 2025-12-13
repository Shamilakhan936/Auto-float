import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-12 md:px-12 md:py-16">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to simplify your bills?
            </h2>
            <p className="mt-6 text-lg text-white/80">
              Join thousands of users who trust Auto+ for predictable, stress-free bill management.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/plans">
                <Button
                  size="xl"
                  className="bg-white text-background hover:bg-white/90 group"
                >
                  Get Started Today
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                variant="hero-outline"
                size="xl"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}