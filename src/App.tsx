import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Plans from "./pages/Plans";
import Verify from "./pages/Verify";
import ConnectBank from "./pages/ConnectBank";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import HelpCenter from "./pages/HelpCenter";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

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
          <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={<route.element />} />
              ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
}