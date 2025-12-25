import { Link } from "react-router-dom";
import { Car } from "lucide-react";

export function AuthLogo() {
  return (
    <div className="text-center mb-6">
      <Link to="/" className="inline-flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <Car className="h-5 w-5 text-accent-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">AutoFloat</span>
      </Link>
    </div>
  );
}

