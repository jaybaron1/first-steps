import { useState, useEffect } from 'react';
import { adminSupabase } from '@/lib/adminBackend';

export interface TrafficSource {
  source: string;
  count: number;
  percentage: number;
  color: string;
}

type TimeRange = 'today' | '7days' | '30days' | 'all';

const SOURCE_COLORS = [
  '#B8956C', // Gold
  '#8B7355', // Dark gold
  '#D4A574', // Light gold
  '#6B5B4F', // Brown
  '#A0937D', // Taupe
  '#C9B896', // Cream
  '#7D6E5D', // Mocha
  '#BFA98F', // Sand
];

function categorizeReferrer(referrer: string | null): string {
  if (!referrer || referrer === '' || referrer === 'null') return 'Direct';
  
  const ref = referrer.toLowerCase();
  
  if (ref.includes('google')) return 'Google';
  if (ref.includes('bing') || ref.includes('yahoo') || ref.includes('duckduckgo')) return 'Other Search';
  if (ref.includes('facebook') || ref.includes('fb.')) return 'Facebook';
  if (ref.includes('twitter') || ref.includes('t.co')) return 'Twitter/X';
  if (ref.includes('linkedin')) return 'LinkedIn';
  if (ref.includes('instagram')) return 'Instagram';
  if (ref.includes('youtube')) return 'YouTube';
  if (ref.includes('reddit')) return 'Reddit';
  if (ref.includes('tiktok')) return 'TikTok';
  
  // Extract domain for other referrers
  try {
    const url = new URL(referrer);
    return url.hostname.replace('www.', '');
  } catch {
    return 'Other';
  }
}

export function useTrafficSources(timeRange: TimeRange = '7days') {
  const [sources, setSources] = useState<TrafficSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = adminSupabase
          .from('visitor_sessions')
          .select('referrer');

        // Apply time filter
        const now = new Date();
        if (timeRange === 'today') {
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          query = query.gte('created_at', startOfDay.toISOString());
        } else if (timeRange === '7days') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          query = query.gte('created_at', sevenDaysAgo.toISOString());
        } else if (timeRange === '30days') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          query = query.gte('created_at', thirtyDaysAgo.toISOString());
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        if (!data || data.length === 0) {
          setSources([]);
          setTotalVisitors(0);
          setLoading(false);
          return;
        }

        const total = data.length;
        setTotalVisitors(total);

        // Categorize and aggregate
        const sourceMap = new Map<string, number>();
        data.forEach((session) => {
          const source = categorizeReferrer(session.referrer);
          sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
        });

        const sourceStats: TrafficSource[] = Array.from(sourceMap.entries())
          .map(([source, count], index) => ({
            source,
            count,
            percentage: Math.round((count / total) * 100),
            color: SOURCE_COLORS[index % SOURCE_COLORS.length],
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8); // Top 8 sources

        setSources(sourceStats);
      } catch (err) {
        console.error('Error fetching traffic sources:', err);
        setError('Failed to load traffic source data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  return { sources, loading, error, totalVisitors };
}
