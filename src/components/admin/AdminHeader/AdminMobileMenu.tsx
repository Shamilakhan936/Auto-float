import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AdminMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminMobileMenu({ isOpen, onClose }: AdminMobileMenuProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    onClose();
  };

  return (
    <div
      className={cn(
        "md:hidden border-t border-border/50 bg-background/95 backdrop-blur transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <nav className="container flex flex-col gap-2 px-4 py-4">
        <div className="px-3 py-2 mb-2 border-b border-border/30">
          <p className="text-sm font-medium">{user?.email}</p>
          <p className="text-xs text-muted-foreground">Admin Account</p>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => {
            navigate("/dashboard");
            onClose();
          }}
        >
          <User className="h-4 w-4" />
          Dashboard
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => {
            navigate("/settings");
            onClose();
          }}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        
        <div className="border-t border-border/30 my-2" />
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </nav>
    </div>
  );
}

