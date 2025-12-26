import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
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
        {user ? (
          <>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Link to="/dashboard" onClick={onAction}>
              <Button variant="outline" className="w-full">
                Dashboard
              </Button>
            </Link>
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
      {user ? (
        <>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
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

