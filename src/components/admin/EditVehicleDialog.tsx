import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Car } from "lucide-react";

interface Vehicle {
  id: string;
  user_id: string;
  vin: string | null;
  license_plate: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  is_verified: boolean;
  insurance_verified: boolean;
  insurance_provider: string | null;
  created_at: string;
}

interface EditVehicleDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedVehicle: Vehicle) => void;
}

export function EditVehicleDialog({ vehicle, open, onOpenChange, onUpdate }: EditVehicleDialogProps) {
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [insuranceVerified, setInsuranceVerified] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setVin(vehicle.vin || "");
      setLicensePlate(vehicle.license_plate || "");
      setMake(vehicle.make || "");
      setModel(vehicle.model || "");
      setYear(vehicle.year ? String(vehicle.year) : "");
      setInsuranceProvider(vehicle.insurance_provider || "");
      setIsVerified(vehicle.is_verified);
      setInsuranceVerified(vehicle.insurance_verified);
    }
  }, [vehicle]);

  const handleSave = async () => {
    if (!vehicle) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("vehicles")
      .update({
        vin: vin || null,
        license_plate: licensePlate || null,
        make: make || null,
        model: model || null,
        year: year ? parseInt(year) : null,
        insurance_provider: insuranceProvider || null,
        is_verified: isVerified,
        insurance_verified: insuranceVerified
      })
      .eq("id", vehicle.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to update vehicle");
    } else {
      toast.success("Vehicle updated successfully");
      onUpdate({
        ...vehicle,
        vin: vin || null,
        license_plate: licensePlate || null,
        make: make || null,
        model: model || null,
        year: year ? parseInt(year) : null,
        insurance_provider: insuranceProvider || null,
        is_verified: isVerified,
        insurance_verified: insuranceVerified
      });
      onOpenChange(false);
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Edit Vehicle
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input
              id="vin"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="bg-background border-border font-mono"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
            <Input
              id="insuranceProvider"
              value={insuranceProvider}
              onChange={(e) => setInsuranceProvider(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <Label htmlFor="isVerified" className="cursor-pointer">Vehicle Verified</Label>
              <Switch
                id="isVerified"
                checked={isVerified}
                onCheckedChange={setIsVerified}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <Label htmlFor="insuranceVerified" className="cursor-pointer">Insurance Verified</Label>
              <Switch
                id="insuranceVerified"
                checked={insuranceVerified}
                onCheckedChange={setInsuranceVerified}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
