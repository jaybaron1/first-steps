import { useEffect } from 'react';

const GA_MEASUREMENT_ID = 'G-2NHHE1D4WZ';

const GoogleAnalyticsScript = () => {
  useEffect(() => {
    // Skip if already loaded
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
      return;
    }

    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
      cookie_flags: 'SameSite=None;Secure',
      custom_map: {
        dimension1: 'plan_type',
        dimension2: 'source_page',
        metric1: 'conversion_value',
      },
    });
  }, []);

  return null;
};

export default GoogleAnalyticsScript;
