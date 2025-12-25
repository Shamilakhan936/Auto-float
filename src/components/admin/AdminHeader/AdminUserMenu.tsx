import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminUserMenu() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 px-4 py-2 text-sm font-medium shadow-glow hover:from-primary/30 hover:to-primary/20 transition-all"
        >
          <Shield className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Administrator</span>
          <span className="sm:hidden">Admin</span>
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
  );
}

