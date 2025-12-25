import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import type { Vehicle } from "../types";

interface VehicleInsuranceInfoProps {
  vehicle: Vehicle;
}

export function VehicleInsuranceInfo({ vehicle }: VehicleInsuranceInfoProps) {
  if (!vehicle.insurance_provider) return null;

  return (
    <div className="pt-3 border-t border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Insurance</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{vehicle.insurance_provider}</span>
          <Badge variant={vehicle.insurance_verified ? "success" : "outline"} className="text-xs">
            {vehicle.insurance_verified ? "Verified" : "Pending"}
          </Badge>
        </div>
      </div>
    </div>
  );
}


