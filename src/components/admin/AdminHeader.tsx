import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Sparkles, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-info/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="relative container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Admin Panel
                  </h1>
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground">AutoFloat Management Console</p>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 px-4 py-2 text-sm font-medium shadow-glow hover:from-primary/30 hover:to-primary/20 transition-all"
              >
                <Shield className="h-4 w-4 mr-2" />
                Administrator
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-0 shadow-xl rounded-xl p-2">
              <div className="px-3 py-2 mb-1">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Admin Account</p>
              </div>
              <DropdownMenuSeparator className="bg-border/30" />
              <DropdownMenuItem 
                onClick={() => navigate("/dashboard")}
                className="rounded-lg cursor-pointer"
              >
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate("/settings")}
                className="rounded-lg cursor-pointer"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/30" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
