import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CreditCard } from "lucide-react";

interface AccessCardProps {
  accessUsed: number;
  accessLimit: number;
  accessRemaining: number;
  accessPercent: number;
  nextSettlement: string;
  tierName: string;
}

export const AccessCard = memo(function AccessCard({
  accessUsed,
  accessLimit,
  accessRemaining,
  accessPercent,
  nextSettlement,
  tierName,
}: AccessCardProps) {
  return (
    <Card className="md:col-span-2 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Current Access</CardTitle>
          <Badge variant="outline">{accessPercent.toFixed(0)}% used</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-4xl font-bold text-foreground">${accessUsed.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">of ${accessLimit.toLocaleString()} limit</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-accent">${accessRemaining.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">remaining</p>
          </div>
        </div>
        <Progress value={accessPercent} className="h-3 rounded-full" />
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Resets {nextSettlement}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>{tierName} Plan</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});


