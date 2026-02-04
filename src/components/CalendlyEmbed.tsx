import React, { useEffect, useMemo } from 'react';

interface CalendlyEmbedProps {
  url?: string;
  height?: number;
}

// Inline Calendly embed with lazy-loaded script and optional name/email prefill via URL params
const CalendlyEmbed: React.FC<CalendlyEmbedProps> = ({
  url = 'https://calendly.com/jason-galavanteer/discovery_call',
  height = 720,
}) => {
  const dataUrl = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name') || '';
      const email = params.get('email') || '';
      const base = new URL(url);
      // Helpful defaults
      base.searchParams.set('hide_event_type_details', '1');
      base.searchParams.set('hide_gdpr_banner', '1');
      if (name) base.searchParams.set('name', name);
      if (email) base.searchParams.set('email', email);
      return base.toString();
    } catch {
      return url;
    }
  }, [url]);

  useEffect(() => {
    // Inject Calendly CSS once
    if (!document.getElementById('calendly-widget-css')) {
      const link = document.createElement('link');
      link.id = 'calendly-widget-css';
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }
    // Inject script once
    if (!document.getElementById('calendly-widget-js')) {
      const script = document.createElement('script');
      script.id = 'calendly-widget-js';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="rounded-xl border border-galavanteer-purple/10 bg-white shadow-sm overflow-hidden">
      <div
        className="calendly-inline-widget"
        data-url={dataUrl}
        style={{ minWidth: 320, height }}
      />
    </div>
  );
};

export default CalendlyEmbed;
