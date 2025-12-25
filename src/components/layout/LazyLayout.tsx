import { lazy, Suspense, ReactNode } from "react";

const Header = lazy(() => import("@/components/layout/Header").then(m => ({ default: m.Header })));
const Footer = lazy(() => import("@/components/layout/Footer").then(m => ({ default: m.Footer })));

interface LazyLayoutProps {
  children: ReactNode;
}

export function LazyLayout({ children }: LazyLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={<div className="h-16 bg-card animate-pulse" />}>
        <Header />
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
      <Suspense fallback={<div className="h-32 bg-card animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  );
}

