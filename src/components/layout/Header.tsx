import { useState } from "react";
import { Logo } from "./Header/Logo";
import { NavLinks } from "./Header/NavLinks";
import { UserMenu } from "./Header/UserMenu";
import { MobileMenu } from "./Header/MobileMenu";
import { MobileMenuButton } from "./Header/MobileMenuButton";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />

        {/* Desktop Navigation */}
        <NavLinks className="hidden md:flex" />

        <div className="hidden md:flex">
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <MobileMenuButton
          isOpen={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}