/**
 * VisitorTracking React Component
 * Wrapper component that initializes visitor tracking
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import visitorTracking from '@/lib/visitorTracking';

const VisitorTracking: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Skip tracking for admin routes
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    // The visitorTracking singleton auto-initializes on import
    // This component just ensures it's mounted in the React tree
    console.log('[VisitorTracking] Active on:', location.pathname);
  }, [location.pathname]);

  return null;
};

export default VisitorTracking;
