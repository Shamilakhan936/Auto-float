import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/plans", label: "Plans" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

interface NavLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

export function NavLinks({ className, onLinkClick }: NavLinksProps) {
  const location = useLocation();

  return (
    <nav className={cn("flex items-center gap-8", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={onLinkClick}
          className={cn(
            "text-sm font-medium transition-colors hover:text-accent",
            location.pathname === link.href
              ? "text-accent"
              : "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

