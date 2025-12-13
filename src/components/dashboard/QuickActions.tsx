import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Building2, Receipt, Settings, ArrowUpRight } from "lucide-react";

interface QuickActionsProps {
  isVehicleVerified: boolean;
  isBankConnected: boolean;
  onAddBill: () => void;
  onManageVehicle: () => void;
  onManageBank: () => void;
}

export function QuickActions({ 
  isVehicleVerified, 
  isBankConnected, 
  onAddBill, 
  onManageVehicle, 
  onManageBank 
}: QuickActionsProps) {
  return (
    <Card className="animate-fade-in [animation-delay:600ms] opacity-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onAddBill}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <Receipt className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Add Bill</span>
          </button>
          
          <button
            onClick={onManageVehicle}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              isVehicleVerified 
                ? 'bg-success/10 text-success' 
                : 'bg-warning/10 text-warning'
            }`}>
              <Car className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">
              {isVehicleVerified ? 'Vehicle' : 'Verify Vehicle'}
            </span>
          </button>
          
          <button
            onClick={onManageBank}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              isBankConnected 
                ? 'bg-success/10 text-success' 
                : 'bg-warning/10 text-warning'
            }`}>
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">
              {isBankConnected ? 'Bank' : 'Connect Bank'}
            </span>
          </button>
          
          <Link
            to="/settings"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <Settings className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
