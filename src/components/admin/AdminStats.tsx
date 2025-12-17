import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, FileText, Shield, Car, CheckCircle, XCircle, 
  DollarSign, Activity 
} from "lucide-react";

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalBills: number;
    totalRevenue: number;
    activeSubscriptions: number;
    totalVehicles: number;
    verifiedVehicles: number;
    pendingBills: number;
    paidBills: number;
  };
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = "default",
  prefix = ""
}: { 
  title: string; 
  value: number | string; 
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "info";
  prefix?: string;
}) => {
  const variants = {
    default: "text-foreground",
    success: "text-primary",
    warning: "text-yellow-500",
    info: "text-blue-400"
  };

  const iconVariants = {
    default: "text-muted-foreground",
    success: "text-primary",
    warning: "text-yellow-500",
    info: "text-blue-400"
  };

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {title}
            </p>
            <p className={`text-2xl font-bold ${variants[variant]}`}>
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
          <div className={`p-2 rounded-lg bg-muted/50 ${iconVariants[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard 
        title="Total Users" 
        value={stats.totalUsers} 
        icon={Users} 
      />
      <StatCard 
        title="Active Subscriptions" 
        value={stats.activeSubscriptions} 
        icon={Activity}
        variant="info"
      />
      <StatCard 
        title="Total Bills" 
        value={stats.totalBills} 
        icon={FileText} 
      />
      <StatCard 
        title="Pending Bills" 
        value={stats.pendingBills} 
        icon={XCircle}
        variant="warning"
      />
      <StatCard 
        title="Paid Bills" 
        value={stats.paidBills} 
        icon={CheckCircle}
        variant="success"
      />
      <StatCard 
        title="Bill Value" 
        value={stats.totalRevenue} 
        icon={DollarSign}
        prefix="$"
      />
      <StatCard 
        title="Total Vehicles" 
        value={stats.totalVehicles} 
        icon={Car} 
      />
      <StatCard 
        title="Verified Vehicles" 
        value={stats.verifiedVehicles} 
        icon={Shield}
        variant="success"
      />
    </div>
  );
};
