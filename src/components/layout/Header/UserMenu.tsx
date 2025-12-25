import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  variant?: "desktop" | "mobile";
  onAction?: () => void;
}

export function UserMenu({ variant = "desktop", onAction }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    onAction?.();
  };

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-3 pt-4 border-t border-border">
        <Link to="/admin" onClick={onAction}>
          <Button variant="outline" className="w-full text-accent">
            <Shield className="h-4 w-4 mr-2" />
            Admin Panel
          </Button>
        </Link>
        {user ? (
          <>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link to="/auth" onClick={onAction}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link to="/auth" onClick={onAction}>
              <Button variant="accent" className="w-full">
                Get Started
              </Button>
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link to="/admin">
        <Button variant="ghost" size="sm" className="text-accent">
          <Shield className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </Link>
      {user ? (
        <>
          <span className="text-sm text-muted-foreground">
            {user.email}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="accent" size="sm">
              Get Started
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

