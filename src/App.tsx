import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Examples from "./pages/Examples";
import ExperiencePage from "./pages/ExperiencePage";
import Pricing from "./pages/Pricing";
import AboutPage from "./pages/AboutPage";
import FaqPage from "./pages/FaqPage";
import PrivacyPage from "./pages/PrivacyPage";
import ClarityPage from "./pages/ClarityPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPortalPage from "./pages/AdminPortalPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import TwoFactorSetupPage from "./pages/TwoFactorSetupPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import SecurityDashboardPage from "./pages/SecurityDashboardPage";
import AOSProvider from "@/components/AOSProvider";
import GoogleTagManager from "@/components/GoogleTagManager";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// Marketing Microsite
import MarketingHome from "./pages/marketing/MarketingHome";
import MarketingResults from "./pages/marketing/MarketingResults";
import MarketingPrivacy from "./pages/marketing/MarketingPrivacy";

const queryClient = new QueryClient();

// Check if we're on the marketing subdomain
const isMarketingSubdomain = () => {
  const hostname = window.location.hostname;
  return hostname.startsWith('visibility.') || hostname.startsWith('marketing.');
};

const App = () => {
  const isMarketing = isMarketingSubdomain();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <GoogleTagManager />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GoogleAnalytics />
            <AOSProvider />
            <Routes>
              {isMarketing ? (
                <>
                  {/* Marketing Microsite - served at root for subdomain */}
                  <Route path="/" element={<MarketingHome />} />
                  <Route path="/results" element={<MarketingResults />} />
                  <Route path="/privacy" element={<MarketingPrivacy />} />
                  <Route path="*" element={<NotFound />} />
                </>
              ) : (
                <>
                  {/* Main Galavanteer Site */}
                  <Route path="/" element={<Index />} />
                  <Route path="/examples" element={<Examples />} />
                  <Route path="/real-wins" element={<Examples />} />
                  <Route path="/experience" element={<ExperiencePage />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/clarity" element={<ClarityPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/admin-portal" element={<AdminPortalPage />} />
                  <Route path="/admin-users" element={<AdminUsersPage />} />
                  <Route path="/2fa-setup" element={<TwoFactorSetupPage />} />
                  <Route path="/audit-logs" element={<AuditLogsPage />} />
                  <Route path="/security" element={<SecurityDashboardPage />} />
                  
                  <Route path="*" element={<NotFound />} />
                </>
              )}
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
