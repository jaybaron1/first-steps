import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import AOSProvider from "@/components/AOSProvider";
import GoogleTagManager from "@/components/GoogleTagManager";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// Marketing Microsite
import MarketingHome from "./pages/marketing/MarketingHome";
import MarketingResults from "./pages/marketing/MarketingResults";
import MarketingPrivacy from "./pages/marketing/MarketingPrivacy";

const queryClient = new QueryClient();

// Scroll to top on route change (unless there's a hash anchor)
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If there's a hash, scroll to that element
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      // Otherwise scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

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
            <ScrollToTop />
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
                  {/* Main Galavanteer Site - Clean Version */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />

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
