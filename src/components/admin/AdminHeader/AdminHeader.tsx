import { useState } from "react";
import { AdminLogo } from "./AdminLogo";
import { AdminUserMenu } from "./AdminUserMenu";
import { AdminMobileMenu } from "./AdminMobileMenu";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AdminHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-info/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="relative container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Logo */}
          <AdminLogo />
          
          {/* Right side - Desktop menu and Mobile hamburger */}
          <div className="flex items-center gap-4">
            {/* Desktop User Menu - Hidden on mobile */}
            <div className="hidden md:block">
              <AdminUserMenu />
            </div>
            
            {/* Mobile Hamburger Button - Visible only on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AdminMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
};

