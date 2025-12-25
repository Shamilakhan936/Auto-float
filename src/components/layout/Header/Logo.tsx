import { Link } from "react-router-dom";
import { Car } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
        <Car className="h-5 w-5 text-accent-foreground" />
      </div>
      <span className="text-xl font-bold text-foreground">AutoFloat</span>
    </Link>
  );
}

