import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";
import OnePager from "./pages/OnePager";
import AdminLayout from "./components/admin/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";
import OverviewPage from "./pages/admin/OverviewPage";
import VisitorsPage from "./pages/admin/VisitorsPage";
import LeadsPage from "./pages/admin/LeadsPage";
import CampaignsPage from "./pages/admin/CampaignsPage";
import ContentPage from "./pages/admin/ContentPage";
import SystemPage from "./pages/admin/SystemPage";
import SecurityPage from "./pages/admin/SecurityPage";
import SEOPage from "./pages/admin/SEOPage";
import RevenuePage from "./pages/admin/RevenuePage";
import PartnersRoute from "./components/partners/PartnersRoute";
import PartnersLayout from "./components/partners/PartnersLayout";
import PartnersLoginPage from "./pages/partners/PartnersLoginPage";
import PartnersDashboardPage from "./pages/partners/PartnersDashboardPage";
import PartnersClientsPage from "./pages/partners/PartnersClientsPage";
import PartnersClientProfilePage from "./pages/partners/PartnersClientProfilePage";
import PartnersNewReferralPage from "./pages/partners/PartnersNewReferralPage";
import PartnersDirectoryPage from "./pages/partners/PartnersDirectoryPage";
import PartnersCommissionLogPage from "./pages/partners/PartnersCommissionLogPage";
import PartnersActivityPage from "./pages/partners/PartnersActivityPage";
import PartnersUsersPage from "./pages/partners/PartnersUsersPage";
import AOSProvider from "@/components/AOSProvider";
import GoogleTagManager from "@/components/GoogleTagManager";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import VisitorTracking from "@/components/VisitorTracking";

const queryClient = new QueryClient();

// Scroll to top on route change (unless there's a hash anchor)
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <GoogleTagManager />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <GoogleAnalytics />
          <AOSProvider />
          <VisitorTracking />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/one-pager" element={<OnePager />} />
            
            {/* Admin - Tab-based layout with nested routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<OverviewPage />} />
              <Route path="visitors" element={<VisitorsPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="content" element={<ContentPage />} />
              <Route path="revenue" element={<RevenuePage />} />
              <Route path="system" element={<SystemPage />} />
              <Route path="security" element={<SecurityPage />} />
              <Route path="seo" element={<SEOPage />} />
            </Route>

            {/* Partners CRM */}
            <Route path="/partners/login" element={<PartnersLoginPage />} />
            <Route path="/partners" element={
              <PartnersRoute>
                <PartnersLayout />
              </PartnersRoute>
            }>
              <Route index element={<PartnersDashboardPage />} />
              <Route path="clients" element={<PartnersClientsPage />} />
              <Route path="clients/:id" element={<PartnersClientProfilePage />} />
              <Route path="new" element={<PartnersNewReferralPage />} />
              <Route path="directory" element={<PartnersDirectoryPage />} />
              <Route path="commissions" element={<PartnersCommissionLogPage />} />
              <Route path="activity" element={<PartnersActivityPage />} />
              <Route path="users" element={<PartnersUsersPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
