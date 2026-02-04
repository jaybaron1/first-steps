import { useState, useEffect } from 'react';
import { adminSupabase } from '@/lib/adminBackend';

export interface DeviceBreakdown {
  device_type: string;
  count: number;
  percentage: number;
}

export interface BrowserBreakdown {
  browser: string;
  count: number;
  percentage: number;
}

export interface OSBreakdown {
  os: string;
  count: number;
  percentage: number;
}

type TimeRange = 'today' | '7days' | '30days' | 'all';

export function useDeviceStats(timeRange: TimeRange = '7days') {
  const [devices, setDevices] = useState<DeviceBreakdown[]>([]);
  const [browsers, setBrowsers] = useState<BrowserBreakdown[]>([]);
  const [operatingSystems, setOperatingSystems] = useState<OSBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = adminSupabase
          .from('visitor_sessions')
          .select('device_type, browser, os');

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
          setDevices([]);
          setBrowsers([]);
          setOperatingSystems([]);
          setLoading(false);
          return;
        }

        const total = data.length;

        // Aggregate devices
        const deviceMap = new Map<string, number>();
        data.forEach((session) => {
          const device = session.device_type || 'Unknown';
          deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
        });
        const deviceStats: DeviceBreakdown[] = Array.from(deviceMap.entries())
          .map(([device_type, count]) => ({
            device_type,
            count,
            percentage: Math.round((count / total) * 100),
          }))
          .sort((a, b) => b.count - a.count);

        // Aggregate browsers
        const browserMap = new Map<string, number>();
        data.forEach((session) => {
          const browser = session.browser || 'Unknown';
          browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
        });
        const browserStats: BrowserBreakdown[] = Array.from(browserMap.entries())
          .map(([browser, count]) => ({
            browser,
            count,
            percentage: Math.round((count / total) * 100),
          }))
          .sort((a, b) => b.count - a.count);

        // Aggregate OS
        const osMap = new Map<string, number>();
        data.forEach((session) => {
          const os = session.os || 'Unknown';
          osMap.set(os, (osMap.get(os) || 0) + 1);
        });
        const osStats: OSBreakdown[] = Array.from(osMap.entries())
          .map(([os, count]) => ({
            os,
            count,
            percentage: Math.round((count / total) * 100),
          }))
          .sort((a, b) => b.count - a.count);

        setDevices(deviceStats);
        setBrowsers(browserStats);
        setOperatingSystems(osStats);
      } catch (err) {
        console.error('Error fetching device stats:', err);
        setError('Failed to load device data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  return { devices, browsers, operatingSystems, loading, error };
}
