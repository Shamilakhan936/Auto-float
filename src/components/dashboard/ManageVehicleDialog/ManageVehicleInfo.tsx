import { Badge } from "@/components/ui/badge";
import { Car, Shield } from "lucide-react";
import type { Vehicle } from "../types";
import { VehicleDetails } from "./VehicleDetails";
import { VehicleInsuranceInfo } from "./VehicleInsuranceInfo";
import { VehicleVerifiedBadge } from "./VehicleVerifiedBadge";

interface ManageVehicleInfoProps {
  vehicle: Vehicle;
}

export function ManageVehicleInfo({ vehicle }: ManageVehicleInfoProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border p-4">
        <VehicleDetails vehicle={vehicle} />
        {vehicle.insurance_provider && (
          <VehicleInsuranceInfo vehicle={vehicle} />
        )}
      </div>
      {vehicle.is_verified && <VehicleVerifiedBadge />}
    </div>
  );
}


