import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ArrowUpRight } from "lucide-react";

interface QuickActionLinkProps {
  to: string;
  icon: "Shield" | "ArrowUpRight";
  title: string;
  description: string;
  delay: string;
}

const iconMap = {
  Shield,
  ArrowUpRight,
};

export function QuickActionLink({
  to,
  icon,
  title,
  description,
  delay,
}: QuickActionLinkProps) {
  const IconComponent = iconMap[icon];

  return (
    <Link to={to}>
      <Card className="hover:border-accent/30 transition-colors cursor-pointer h-full animate-fade-in opacity-0" style={{ animationDelay: delay }}>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <IconComponent className="h-8 w-8 text-accent mb-3" />
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}


