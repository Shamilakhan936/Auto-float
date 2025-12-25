import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Plus } from "lucide-react";

interface DashboardHeaderProps {
  isVerified: boolean;
  onAddBillClick: () => void;
}

export function DashboardHeader({ isVerified, onAddBillClick }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Manage your bills and track your access.</p>
      </div>
      <div className="flex items-center gap-3">
        {isVerified && (
          <Badge variant="verified" className="py-2 px-4">
            <Car className="h-4 w-4 mr-2" />
            AutoFloat Verified
          </Badge>
        )}
        <Button variant="accent" onClick={onAddBillClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bill
        </Button>
      </div>
    </div>
  );
}

