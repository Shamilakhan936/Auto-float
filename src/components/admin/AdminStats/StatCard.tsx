import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "info";
  prefix?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = "default",
  prefix = ""
}: StatCardProps) => {
  const gradients = {
    default: "from-muted/50 to-muted/20",
    success: "from-primary/20 to-primary/5",
    warning: "from-warning/20 to-warning/5",
    info: "from-info/20 to-info/5"
  };

  const variants = {
    default: "text-foreground",
    success: "text-primary",
    warning: "text-warning",
    info: "text-info"
  };

  const iconBg = {
    default: "bg-muted/50 text-muted-foreground",
    success: "bg-primary/15 text-primary",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/15 text-info"
  };

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]} opacity-50`} />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
      <CardContent className="relative p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              {title}
            </p>
            <p className={`text-3xl font-bold ${variants[variant]}`}>
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${iconBg[variant]} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

