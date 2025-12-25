import { FeaturesHeader } from "./FeaturesHeader";
import { FeaturesGrid } from "./FeaturesGrid";

export function Features() {
  return (
    <section id="features" className="py-12 md:py-16 bg-secondary/30">
      <div className="container px-4">
        <FeaturesHeader />
        <FeaturesGrid />
      </div>
    </section>
  );
}


