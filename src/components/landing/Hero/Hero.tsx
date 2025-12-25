import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Clock, CheckCircle2 } from "lucide-react";
import { HeroBadge } from "./HeroBadge";
import { HeroTitle } from "./HeroTitle";
import { HeroDescription } from "./HeroDescription";
import { HeroActions } from "./HeroActions";
import { HeroTrustIndicators } from "./HeroTrustIndicators";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent" />
      
      <div className="container relative px-4 py-12 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <HeroBadge />
          <HeroTitle />
          <HeroDescription />
          <HeroActions />
          <HeroTrustIndicators />
        </div>
      </div>
    </section>
  );
}


