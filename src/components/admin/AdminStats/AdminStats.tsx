import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, FileText, Shield, Car, CheckCircle, XCircle, 
  DollarSign, Activity 
} from "lucide-react";
import { StatCard } from "./StatCard";

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

