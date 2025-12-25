import { Card, CardContent } from "@/components/ui/card";
import { Plus, CreditCard, Car } from "lucide-react";

interface QuickActionCardProps {
  icon: "Plus" | "CreditCard" | "Car";
  title: string;
  description: string;
  onClick: () => void;
  delay: string;
}

const iconMap = {
  Plus,
  CreditCard,
  Car,
};

export function QuickActionCard({
  icon,
  title,
  description,
  onClick,
  delay,
}: QuickActionCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <Card
      className="hover:border-accent/30 transition-colors cursor-pointer animate-fade-in opacity-0"
      style={{ animationDelay: delay }}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center py-6 text-center">
        <IconComponent className="h-8 w-8 text-accent mb-3" />
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}


