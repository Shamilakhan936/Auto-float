import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Plans", href: "/plans" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Auto Verification", href: "/verify" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
  ],
};

const linkSections = [
  { title: "Product", links: footerLinks.product },
  { title: "Company", links: footerLinks.company },
  { title: "Resources", links: footerLinks.resources },
  { title: "Legal", links: footerLinks.legal },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Car className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">AutoFloat</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Predictable bill coverage with zero interest and zero penalties.
            </p>
          </div>
          
          {linkSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AutoFloat. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            No interest, ever. No late fees. No lien on vehicle.
          </p>
        </div>
      </div>
    </footer>
  );
}