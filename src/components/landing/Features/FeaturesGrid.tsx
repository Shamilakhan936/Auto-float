import { 
  CreditCard, 
  Car, 
  BanknoteIcon, 
  ShieldCheck, 
  RefreshCw,
  Zap
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: CreditCard,
    title: "Tiered Subscriptions",
    description: "Choose from Basic, Plus, or AutoFloat plans with monthly access limits from $500 to $3,000.",
  },
  {
    icon: Car,
    title: "Auto Verification",
    description: "Verify your vehicle to unlock higher access limits. No lien created on your car.",
  },
  {
    icon: BanknoteIcon,
    title: "Zero Interest, Ever",
    description: "Predictable monthly cost with no interest charges or hidden fees.",
  },
  {
    icon: ShieldCheck,
    title: "Bill Category Limits",
    description: "Access restricted to approved categories: rent, utilities, insurance, and more.",
  },
  {
    icon: RefreshCw,
    title: "Auto-Settlement",
    description: "Balance clears automatically on your payday or month-end. Simple and stress-free.",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Connect your bank, verify your car, and get instant access to pay your bills.",
  },
];

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          feature={feature}
          index={index}
        />
      ))}
    </div>
  );
}


