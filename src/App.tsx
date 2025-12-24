import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Plans from "./pages/Plans";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import HelpCenter from "./pages/HelpCenter";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const Settings = lazy(() => import("./pages/Settings"));
const Verify = lazy(() => import("./pages/Verify"));
const ConnectBank = lazy(() => import("./pages/ConnectBank"));

const queryClient = new QueryClient();

const routes = [
  { path: "/", element: Index },
  { path: "/auth", element: Auth },
  { path: "/plans", element: Plans },
  { path: "/verify", element: Verify },
  { path: "/connect-bank", element: ConnectBank },
  { path: "/dashboard", element: Dashboard },
  { path: "/settings", element: Settings },
  { path: "/about", element: About },
  { path: "/careers", element: Careers },
  { path: "/press", element: Press },
  { path: "/help", element: HelpCenter },
  { path: "/blog", element: Blog },
  { path: "/contact", element: Contact },
  { path: "/privacy", element: Privacy },
  { path: "/terms", element: Terms },
  { path: "/security", element: Security },
  { path: "/admin", element: Admin },
];

export default function App() {
  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.path === "/admin" || route.path === "/dashboard" || route.path === "/settings" || route.path === "/verify" || route.path === "/connect-bank" ? (
                      <Suspense fallback={
                        <div className="min-h-screen bg-background">
                          <div className="h-16 bg-card animate-pulse" />
                          <div className="container px-4 py-8">
                            <div className="space-y-6">
                              <div className="h-8 w-48 bg-secondary animate-pulse rounded" />
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 h-48 bg-card animate-pulse rounded-xl" />
                                <div className="h-48 bg-card animate-pulse rounded-xl" />
                              </div>
                            </div>
                          </div>
                        </div>
                      }>
                        <route.element />
                      </Suspense>
                    ) : (
                      <route.element />
                    )
                  }
                />
              ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
}