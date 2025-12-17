import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft } from "lucide-react";

export const AdminHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">AutoFloat Management</p>
              </div>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            Administrator
          </Badge>
        </div>
      </div>
    </div>
  );
};
