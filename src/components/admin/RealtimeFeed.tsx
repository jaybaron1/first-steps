import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { Activity, Globe, Monitor, Smartphone, Tablet, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PageViewEvent {
  id: string;
  session_id: string;
  page_url: string;
  page_title: string | null;
  created_at: string;
  visitor_sessions?: {
    device_type: string | null;
    country: string | null;
    city: string | null;
    browser: string | null;
  } | null;
}

interface RealtimeFeedProps {
  maxItems?: number;
}

const RealtimeFeed: React.FC<RealtimeFeedProps> = ({ maxItems = 10 }) => {
  const [events, setEvents] = useState<PageViewEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const formatPageUrl = (url: string) => {
    if (url === '/') return 'Homepage';
    return url.replace(/^\//, '').replace(/-/g, ' ').replace(/\//g, ' → ');
  };

  useEffect(() => {
    const fetchRecentEvents = async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select(`
          id,
          session_id,
          page_url,
          page_title,
          created_at,
          visitor_sessions (
            device_type,
            country,
            city,
            browser
          )
        `)
        .order('created_at', { ascending: false })
        .limit(maxItems);

      if (!error && data) {
        setEvents(data as PageViewEvent[]);
      }
      setLoading(false);
    };

    fetchRecentEvents();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('page_views_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'page_views' },
        async (payload) => {
          // Fetch the full event with session data
          const { data } = await supabase
            .from('page_views')
            .select(`
              id,
              session_id,
              page_url,
              page_title,
              created_at,
              visitor_sessions (
                device_type,
                country,
                city,
                browser
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setEvents((prev) => [data as PageViewEvent, ...prev.slice(0, maxItems - 1)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [maxItems]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[hsl(var(--admin-bg-card))] rounded-lg animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--admin-border))]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-[hsl(var(--admin-border))] rounded" />
              <div className="h-3 w-24 bg-[hsl(var(--admin-border))] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-[hsl(var(--admin-text-subtle))]">
        <Activity className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No recent activity</p>
        <p className="text-xs mt-1">Page views will appear here in real-time</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center gap-3 p-3 bg-[hsl(var(--admin-bg-card))] rounded-lg border border-transparent hover:border-[hsl(var(--admin-border-subtle))] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] flex items-center justify-center text-[hsl(var(--admin-text-muted))]">
            {getDeviceIcon(event.visitor_sessions?.device_type || null)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[hsl(var(--admin-text))] truncate">
              {formatPageUrl(event.page_url)}
            </p>
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--admin-text-subtle))]">
              {event.visitor_sessions?.country && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {event.visitor_sessions.city || event.visitor_sessions.country}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RealtimeFeed;
