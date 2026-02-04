import { useVisitorTracking } from '@/hooks/useVisitorTracking';

/**
 * Visitor tracking component
 * Place this in your app to enable automatic tracking
 * Excludes admin routes by default
 */
const VisitorTracking = () => {
  useVisitorTracking({
    excludedRoutes: ['/admin'],
    trackScroll: true,
    trackTime: true,
    trackClicks: true,
  });

  // This component doesn't render anything
  return null;
};

export default VisitorTracking;
