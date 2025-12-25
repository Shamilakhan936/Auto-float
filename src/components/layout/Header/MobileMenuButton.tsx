import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      className="md:hidden p-2"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <X className="h-6 w-6 text-foreground" />
      ) : (
        <Menu className="h-6 w-6 text-foreground" />
      )}
    </button>
  );
}

