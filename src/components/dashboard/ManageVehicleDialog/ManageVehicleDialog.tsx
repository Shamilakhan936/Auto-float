import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Vehicle } from "../types";
import { ManageVehicleDialogHeader } from "./ManageVehicleDialogHeader";
import { ManageVehicleInfo } from "./ManageVehicleInfo";
import { ManageVehicleEmpty } from "./ManageVehicleEmpty";

interface ManageVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export function ManageVehicleDialog({ open, onOpenChange, vehicle }: ManageVehicleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ManageVehicleDialogHeader />
        <div className="space-y-4">
          {vehicle ? (
            <ManageVehicleInfo vehicle={vehicle} />
          ) : (
            <ManageVehicleEmpty />
          )}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Link to="/verify" className="flex-1">
              <Button variant="accent" className="w-full">
                {vehicle?.is_verified ? "Update Vehicle" : "Verify Vehicle"}
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
