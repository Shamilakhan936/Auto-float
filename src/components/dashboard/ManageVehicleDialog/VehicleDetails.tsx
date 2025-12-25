import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";
import type { Vehicle } from "../types";

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <Car className="h-5 w-5 text-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
          <p className="text-sm text-muted-foreground">
            {vehicle.vin ? `VIN: ${vehicle.vin.slice(0, 8)}...` : vehicle.license_plate ? `Plate: ${vehicle.license_plate}` : "Vehicle Info"}
          </p>
        </div>
      </div>
      <Badge variant={vehicle.is_verified ? "verified" : "outline"}>
        {vehicle.is_verified ? "Verified" : "Pending"}
      </Badge>
    </div>
  );
}


