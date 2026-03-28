import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  initializeSession,
  trackPageView,
  trackScrollDepth,
  trackTimeOnPage,
  trackCTAClick,
  getSessionId,
} from '@/lib/tracking';

interface UseVisitorTrackingOptions {
  /** Routes to exclude from tracking (default: ['/admin']) */
  excludedRoutes?: string[];
  /** Enable scroll depth tracking (default: true) */
  trackScroll?: boolean;
  /** Enable time on page tracking (default: true) */
  trackTime?: boolean;
  /** Enable CTA click tracking (default: true) */
  trackClicks?: boolean;
}

/**
 * Hook for automatic visitor tracking
 * Handles session initialization, page views, scroll depth, and time on page
 */
export const useVisitorTracking = (options: UseVisitorTrackingOptions = {}) => {
  const {
    excludedRoutes = ['/admin'],
    trackScroll = true,
    trackTime = true,
    trackClicks = true,
  } = options;

  const location = useLocation();
  const isInitialized = useRef(false);
  const scrollThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if current route should be tracked
  const shouldTrack = useCallback(() => {
    return !excludedRoutes.some(route => location.pathname.startsWith(route));
  }, [location.pathname, excludedRoutes]);

  // Initialize session on first load
  useEffect(() => {
    if (isInitialized.current || !shouldTrack()) return;

    const init = async () => {
      try {
        await initializeSession();
        isInitialized.current = true;
        console.log('[Tracking] Session initialized:', getSessionId());
      } catch (err) {
        console.warn('[Tracking] Failed to initialize session:', err);
      }
    };

    init();
  }, [shouldTrack]);

  // Track page views on route changes
  useEffect(() => {
    if (!shouldTrack()) return;

    // Small delay to ensure page title is updated
    const timeout = setTimeout(() => {
      trackPageView().catch(err => {
        console.warn('[Tracking] Failed to track page view:', err);
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [location.pathname, location.search, shouldTrack]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScroll || !shouldTrack()) return;

    const handleScroll = () => {
      // Throttle scroll tracking to every 200ms
      if (scrollThrottleRef.current) return;

      scrollThrottleRef.current = setTimeout(() => {
        trackScrollDepth();
        scrollThrottleRef.current = null;
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollThrottleRef.current) {
        clearTimeout(scrollThrottleRef.current);
      }
    };
  }, [trackScroll, shouldTrack]);

  // Track time on page before unload
  useEffect(() => {
    if (!trackTime || !shouldTrack()) return;

    const handleBeforeUnload = () => {
      trackTimeOnPage();
    };

    // Also track on visibility change (for mobile)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackTimeOnPage();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackTime, shouldTrack]);

  // Track CTA clicks (buttons with data-track-cta attribute)
  useEffect(() => {
    if (!trackClicks || !shouldTrack()) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const ctaElement = target.closest('[data-track-cta]') as HTMLElement | null;

      if (ctaElement) {
        const ctaName = ctaElement.getAttribute('data-track-cta') || 'unknown';
        const ctaLocation = ctaElement.getAttribute('data-track-location') || location.pathname;
        trackCTAClick(ctaName, ctaLocation);
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [trackClicks, shouldTrack, location.pathname]);

  return {
    sessionId: getSessionId(),
    isTracking: shouldTrack(),
  };
};

export default useVisitorTracking;
