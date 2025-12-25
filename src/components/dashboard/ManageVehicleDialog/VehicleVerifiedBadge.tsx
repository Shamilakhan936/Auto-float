import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

export function VehicleVerifiedBadge() {
  return (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
      <Badge variant="verified" className="mb-2">
        <Car className="h-3 w-3 mr-1" />
        AutoFloat Verified
      </Badge>
      <p className="text-sm text-muted-foreground">
        You have access to the maximum $3,000 monthly limit
      </p>
    </div>
  );
}


