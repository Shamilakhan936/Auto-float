import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdminLogo() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 sm:gap-5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/dashboard")}
        className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10 hover:text-primary transition-all duration-300"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="relative p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <Shield className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Admin Panel
            </h1>
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">AutoFloat Management Console</p>
        </div>
      </div>
    </div>
  );
}

