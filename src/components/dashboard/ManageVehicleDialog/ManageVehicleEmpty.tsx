import { Car } from "lucide-react";

export function ManageVehicleEmpty() {
  return (
    <div className="text-center py-6">
      <Car className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground mb-2">No vehicle verified</p>
      <p className="text-xs text-muted-foreground">
        Verify your vehicle to unlock up to $3,000 monthly access
      </p>
    </div>
  );
}


