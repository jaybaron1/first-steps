import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = 'G-2NHHE1D4WZ';

export const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views on route change
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

// Conversion tracking functions
export const trackConversion = (eventName: string, params?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, params);
  }
};

// Specific conversion events
export const trackDemoRequest = () => {
  trackConversion('demo_request', {
    event_category: 'engagement',
    event_label: 'Demo Request Button',
    value: 1,
  });
};

export const trackClarityBooking = () => {
  trackConversion('clarity_booking', {
    event_category: 'conversion',
    event_label: 'Clarity Session Booking',
    value: 100,
  });
};

export const trackPricingView = (plan: string) => {
  trackConversion('view_pricing', {
    event_category: 'engagement',
    event_label: `Pricing - ${plan}`,
    plan_name: plan,
  });
};

export const trackExampleView = () => {
  trackConversion('view_examples', {
    event_category: 'engagement',
    event_label: 'Examples Page View',
  });
};

export const trackCalendlyClick = (source: string) => {
  trackConversion('calendly_click', {
    event_category: 'conversion',
    event_label: `Calendly Click - ${source}`,
    source_page: source,
  });
};

export default GoogleAnalytics;
