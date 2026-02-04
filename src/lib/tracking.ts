/**
 * Cookie-less visitor tracking system
 * Uses browser fingerprinting and session storage for privacy-first tracking
 */

import { supabase } from '@/integrations/supabase/client';

// Session storage keys
const SESSION_ID_KEY = 'visitor_session_id';
const FINGERPRINT_KEY = 'visitor_fingerprint';
const PAGE_LOAD_TIME_KEY = 'page_load_time';
const MAX_SCROLL_DEPTH_KEY = 'max_scroll_depth';

/**
 * Generate a unique fingerprint hash from browser characteristics
 * No cookies, no PII storage - just a hash for session continuity
 */
export const generateFingerprint = async (): Promise<string> => {
  const components: string[] = [];

  // Basic browser info
  components.push(navigator.userAgent);
  components.push(navigator.language);
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  components.push(`${screen.width}x${screen.height}`);
  components.push(String(screen.colorDepth));
  components.push(navigator.platform);
  components.push(String(navigator.hardwareConcurrency || 'unknown'));

  // Canvas fingerprint for additional uniqueness
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Tracking', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Canvas', 4, 17);
      components.push(canvas.toDataURL());
    }
  } catch {
    components.push('canvas-unavailable');
  }

  // WebGL renderer (additional uniqueness)
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown');
      }
    }
  } catch {
    components.push('webgl-unavailable');
  }

  // Generate hash from components
  const fingerprintString = components.join('|');
  const hash = await hashString(fingerprintString);
  return hash;
};

/**
 * Hash a string using SHA-256
 */
const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Generate a unique session ID
 */
export const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Get or create session ID from session storage
 */
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

/**
 * Get or create fingerprint hash
 */
export const getFingerprint = async (): Promise<string> => {
  let fingerprint = sessionStorage.getItem(FINGERPRINT_KEY);
  if (!fingerprint) {
    fingerprint = await generateFingerprint();
    sessionStorage.setItem(FINGERPRINT_KEY, fingerprint);
  }
  return fingerprint;
};

/**
 * Parse UTM parameters from URL
 */
export const parseUTMParams = (): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
} => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
};

/**
 * Detect device type from user agent
 */
export const detectDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

/**
 * Detect browser from user agent
 */
export const detectBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'IE';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Edg')) return 'Edge Chromium';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
};

/**
 * Detect OS from user agent
 */
export const detectOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
};

/**
 * Get visitor info from edge function (IP, geo data)
 */
export const getVisitorInfo = async (): Promise<{
  ip_address: string | null;
  country: string | null;
  city: string | null;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-visitor-info');
    if (error) {
      console.warn('Failed to get visitor info:', error);
      return { ip_address: null, country: null, city: null };
    }
    return data || { ip_address: null, country: null, city: null };
  } catch (err) {
    console.warn('Error fetching visitor info:', err);
    return { ip_address: null, country: null, city: null };
  }
};

/**
 * Initialize or update visitor session
 */
export const initializeSession = async (): Promise<string> => {
  const sessionId = getSessionId();
  const fingerprintHash = await getFingerprint();
  const utmParams = parseUTMParams();
  const visitorInfo = await getVisitorInfo();

  // Check if session already exists
  const { data: existingSession } = await supabase
    .from('visitor_sessions')
    .select('id')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (!existingSession) {
    // Create new session
    await supabase.from('visitor_sessions').insert({
      session_id: sessionId,
      fingerprint_hash: fingerprintHash,
      device_type: detectDeviceType(),
      browser: detectBrowser(),
      os: detectOS(),
      referrer: document.referrer || null,
      utm_source: utmParams.utm_source,
      utm_medium: utmParams.utm_medium,
      utm_campaign: utmParams.utm_campaign,
      ip_address: visitorInfo.ip_address,
      country: visitorInfo.country,
      city: visitorInfo.city,
    });
  } else {
    // Update last seen
    await supabase
      .from('visitor_sessions')
      .update({ last_seen: new Date().toISOString() })
      .eq('session_id', sessionId);
  }

  return sessionId;
};

/**
 * Track a page view
 */
export const trackPageView = async (pageUrl?: string, pageTitle?: string): Promise<void> => {
  const sessionId = getSessionId();
  const url = pageUrl || window.location.pathname + window.location.search;
  const title = pageTitle || document.title;

  // Store page load time for time-on-page calculation
  sessionStorage.setItem(PAGE_LOAD_TIME_KEY, Date.now().toString());
  sessionStorage.setItem(MAX_SCROLL_DEPTH_KEY, '0');

  await supabase.from('page_views').insert({
    session_id: sessionId,
    page_url: url,
    page_title: title,
  });

  // Update session page view count
  const { data: sessionData } = await supabase
    .from('visitor_sessions')
    .select('page_views')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (sessionData) {
    await supabase
      .from('visitor_sessions')
      .update({ page_views: (sessionData.page_views || 0) + 1 })
      .eq('session_id', sessionId);
  }
};

/**
 * Track a custom event
 */
export const trackEvent = async (
  eventType: string,
  eventData?: Record<string, unknown>
): Promise<void> => {
  const sessionId = getSessionId();

  await supabase.from('visitor_events').insert([{
    session_id: sessionId,
    event_type: eventType,
    event_data: eventData ? JSON.parse(JSON.stringify(eventData)) : {},
  }]);
};

/**
 * Track scroll depth (call on scroll events)
 */
export const trackScrollDepth = (): void => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

  const currentMax = parseInt(sessionStorage.getItem(MAX_SCROLL_DEPTH_KEY) || '0', 10);
  if (scrollPercent > currentMax) {
    sessionStorage.setItem(MAX_SCROLL_DEPTH_KEY, scrollPercent.toString());
  }
};

/**
 * Get current max scroll depth
 */
export const getMaxScrollDepth = (): number => {
  return parseInt(sessionStorage.getItem(MAX_SCROLL_DEPTH_KEY) || '0', 10);
};

/**
 * Track time on page (call on beforeunload)
 */
export const trackTimeOnPage = async (): Promise<void> => {
  const pageLoadTime = parseInt(sessionStorage.getItem(PAGE_LOAD_TIME_KEY) || '0', 10);
  if (!pageLoadTime) return;

  const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000);
  const scrollDepth = getMaxScrollDepth();
  const sessionId = getSessionId();
  const pageUrl = window.location.pathname + window.location.search;

  // Update the page view with time and scroll depth
  // Use sendBeacon for reliability on page unload
  const payload = JSON.stringify({
    session_id: sessionId,
    page_url: pageUrl,
    time_on_page: timeOnPage,
    scroll_depth: scrollDepth,
  });

  // Try to update via sendBeacon (more reliable on unload)
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-page-exit`,
      payload
    );
  }

  // Also update total session time
  await supabase
    .from('visitor_sessions')
    .select('total_time_seconds')
    .eq('session_id', sessionId)
    .maybeSingle()
    .then(({ data }) => {
      if (data) {
        supabase
          .from('visitor_sessions')
          .update({ total_time_seconds: (data.total_time_seconds || 0) + timeOnPage })
          .eq('session_id', sessionId);
      }
    });
};

/**
 * Track CTA button clicks
 */
export const trackCTAClick = (buttonName: string, location: string): void => {
  trackEvent('cta_click', {
    button_name: buttonName,
    location,
    page_url: window.location.pathname,
  });
};

/**
 * Track form submissions
 */
export const trackFormSubmit = (formName: string, success: boolean): void => {
  trackEvent('form_submit', {
    form_name: formName,
    success,
    page_url: window.location.pathname,
  });
};

/**
 * Track external link clicks
 */
export const trackExternalLink = (url: string): void => {
  trackEvent('external_link_click', {
    destination_url: url,
    page_url: window.location.pathname,
  });
};
