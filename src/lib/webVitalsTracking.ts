import { trackingSupabase } from './trackingBackend';

type MetricRating = 'good' | 'needs-improvement' | 'poor';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: MetricRating;
}

const getSessionId = (): string | null => {
  try {
    return localStorage.getItem('visitor_session_id');
  } catch {
    return null;
  }
};

const trackVital = async (metric: WebVitalMetric) => {
  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    await trackingSupabase.from('visitor_events').insert({
      session_id: sessionId,
      event_type: 'web_vital',
      event_data: {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
      },
    });
  } catch (err) {
    console.error('Failed to track web vital:', err);
  }
};

const getRating = (name: string, value: number): MetricRating => {
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
    INP: [200, 500],
  };

  const [good, poor] = thresholds[name] || [0, 0];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
};

export const initWebVitalsTracking = () => {
  if (typeof window === 'undefined') return;

  // Dynamically import web-vitals to avoid SSR issues
  import('web-vitals')
    .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      const handleMetric = (metric: { name: string; value: number }) => {
        trackVital({
          name: metric.name,
          value: metric.value,
          rating: getRating(metric.name, metric.value),
        });
      };

      onCLS(handleMetric);
      onFCP(handleMetric);
      onLCP(handleMetric);
      onTTFB(handleMetric);
      onINP(handleMetric);
    })
    .catch((err) => {
      console.warn('Web Vitals library not available:', err);
    });
};
