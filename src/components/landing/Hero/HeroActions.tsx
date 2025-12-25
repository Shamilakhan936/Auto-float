import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroActions() {
  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:300ms] opacity-0">
      <Link to="/plans">
        <Button variant="hero" size="xl" className="group">
          View Plans
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
      <Button 
        variant="outline" 
        size="xl"
        onClick={() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        Learn More
      </Button>
    </div>
  );
}


