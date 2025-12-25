import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CreditCard, Clock } from "lucide-react";
import { format, addDays } from "date-fns";
import { AccessCard } from "../AccessCard";
import { NextPaymentCard } from "../NextPaymentCard";

interface DashboardStatsGridProps {
  accessUsed: number;
  accessLimit: number;
  accessRemaining: number;
  accessPercent: number;
  nextSettlement: string;
  tierName: string;
  daysUntilSettlement: number;
}

export function DashboardStatsGrid({
  accessUsed,
  accessLimit,
  accessRemaining,
  accessPercent,
  nextSettlement,
  tierName,
  daysUntilSettlement,
}: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <AccessCard
        accessUsed={accessUsed}
        accessLimit={accessLimit}
        accessRemaining={accessRemaining}
        accessPercent={accessPercent}
        nextSettlement={nextSettlement}
        tierName={tierName}
      />
      <NextPaymentCard
        daysUntilSettlement={daysUntilSettlement}
        accessUsed={accessUsed}
      />
    </div>
  );
}


