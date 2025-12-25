import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User, Mail, Calendar, FileCheck, FileText, Car } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  documents_verified: boolean | null;
  created_at: string;
  drivers_license_url?: string | null;
  paystub_url?: string | null;
  car_insurance_url?: string | null;
  referral_code?: string | null;
  referred_by?: string | null;
}

interface UserDetailDialogProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({ user, open, onOpenChange }: UserDetailDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            User Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {user.first_name || user.last_name 
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    : 'Not provided'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user.email || 'Not provided'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(user.created_at), "MMM d, yyyy")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Verification Status</p>
                <Badge 
                  variant={user.documents_verified ? "default" : "secondary"}
                  className={user.documents_verified ? "bg-primary/20 text-primary" : ""}
                >
                  {user.documents_verified ? "Verified" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Documents</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Driver's License</span>
                </div>
                <Badge variant={user.drivers_license_url ? "default" : "secondary"} className="text-xs">
                  {user.drivers_license_url ? "Uploaded" : "Missing"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Paystub</span>
                </div>
                <Badge variant={user.paystub_url ? "default" : "secondary"} className="text-xs">
                  {user.paystub_url ? "Uploaded" : "Missing"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Car Insurance</span>
                </div>
                <Badge variant={user.car_insurance_url ? "default" : "secondary"} className="text-xs">
                  {user.car_insurance_url ? "Uploaded" : "Missing"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Referral Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Referral</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Referral Code</p>
                <p className="font-mono text-sm">{user.referral_code || 'Not generated'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Referred By</p>
                <p className="font-mono text-sm">{user.referred_by || 'None'}</p>
              </div>
            </div>
          </div>

          {/* IDs */}
          <div className="space-y-3 pt-3 border-t border-border/50">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">System IDs</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Profile ID</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{user.id}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">User ID</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{user.user_id}</code>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

