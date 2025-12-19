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

export const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
