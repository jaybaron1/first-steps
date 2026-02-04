import { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';

export interface CoreWebVitalsData {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  inp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
}

interface VitalsEvent {
  event_data: {
    metric: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
}

const defaultVitals: CoreWebVitalsData = {
  lcp: { value: 0, rating: 'good' },
  fid: { value: 0, rating: 'good' },
  cls: { value: 0, rating: 'good' },
  fcp: { value: 0, rating: 'good' },
  ttfb: { value: 0, rating: 'good' },
  inp: { value: 0, rating: 'good' },
};

export const useCoreWebVitals = (days: number = 7) => {
  const [vitals, setVitals] = useState<CoreWebVitalsData>(defaultVitals);
  const [loading, setLoading] = useState(true);
  const [sampleCount, setSampleCount] = useState(0);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
          .from('visitor_events')
          .select('event_data')
          .eq('event_type', 'web_vital')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false })
          .limit(500);

        if (error) throw error;

        if (data && data.length > 0) {
          const typedData = data as VitalsEvent[];
          const aggregated: Record<string, { total: number; count: number; ratings: string[] }> = {};

          typedData.forEach((event) => {
            const { metric, value, rating } = event.event_data || {};
            if (metric && typeof value === 'number') {
              if (!aggregated[metric]) {
                aggregated[metric] = { total: 0, count: 0, ratings: [] };
              }
              aggregated[metric].total += value;
              aggregated[metric].count += 1;
              if (rating) aggregated[metric].ratings.push(rating);
            }
          });

          const getRating = (ratings: string[]): 'good' | 'needs-improvement' | 'poor' => {
            if (ratings.length === 0) return 'good';
            const poorCount = ratings.filter((r) => r === 'poor').length;
            const needsImprovementCount = ratings.filter((r) => r === 'needs-improvement').length;
            if (poorCount > ratings.length * 0.25) return 'poor';
            if (needsImprovementCount > ratings.length * 0.25) return 'needs-improvement';
            return 'good';
          };

          const result: CoreWebVitalsData = {
            lcp: aggregated.LCP
              ? { value: aggregated.LCP.total / aggregated.LCP.count, rating: getRating(aggregated.LCP.ratings) }
              : defaultVitals.lcp,
            fid: aggregated.FID
              ? { value: aggregated.FID.total / aggregated.FID.count, rating: getRating(aggregated.FID.ratings) }
              : defaultVitals.fid,
            cls: aggregated.CLS
              ? { value: aggregated.CLS.total / aggregated.CLS.count, rating: getRating(aggregated.CLS.ratings) }
              : defaultVitals.cls,
            fcp: aggregated.FCP
              ? { value: aggregated.FCP.total / aggregated.FCP.count, rating: getRating(aggregated.FCP.ratings) }
              : defaultVitals.fcp,
            ttfb: aggregated.TTFB
              ? { value: aggregated.TTFB.total / aggregated.TTFB.count, rating: getRating(aggregated.TTFB.ratings) }
              : defaultVitals.ttfb,
            inp: aggregated.INP
              ? { value: aggregated.INP.total / aggregated.INP.count, rating: getRating(aggregated.INP.ratings) }
              : defaultVitals.inp,
          };

          setVitals(result);
          setSampleCount(typedData.length);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Core Web Vitals:', err);
        setLoading(false);
      }
    };

    fetchVitals();
  }, [days]);

  return { vitals, loading, sampleCount };
};
