import { NavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      className={cn(
        "md:hidden border-t border-border bg-background transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <nav className="container flex flex-col gap-4 px-4 py-6">
        <NavLinks className="flex-col gap-4" onLinkClick={onClose} />
        <UserMenu variant="mobile" onAction={onClose} />
      </nav>
    </div>
  );
}

