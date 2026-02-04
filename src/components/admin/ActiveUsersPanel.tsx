import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { User, Globe, Monitor, Smartphone, Tablet, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActiveUser {
  id: string;
  session_id: string;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  current_page: string | null;
  last_seen: string;
  page_views: number | null;
}

const ActiveUsersPanel: React.FC = () => {
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5" />;
      default:
        return <Monitor className="w-3.5 h-3.5" />;
    }
  };

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      // Get active sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('visitor_sessions')
        .select('id, session_id, country, city, device_type, browser, last_seen, page_views')
        .gte('last_seen', fiveMinutesAgo)
        .order('last_seen', { ascending: false })
        .limit(10);

      if (!sessionsError && sessions) {
        // Get the most recent page view for each session
        const sessionIds = sessions.map((s) => s.session_id);
        
        const { data: pageViews } = await supabase
          .from('page_views')
          .select('session_id, page_url')
          .in('session_id', sessionIds)
          .order('created_at', { ascending: false });

        // Map to get current page per session
        const currentPages: Record<string, string> = {};
        pageViews?.forEach((pv) => {
          if (!currentPages[pv.session_id]) {
            currentPages[pv.session_id] = pv.page_url;
          }
        });

        const mapped: ActiveUser[] = sessions.map((s) => ({
          ...s,
          current_page: currentPages[s.session_id] || null,
        }));

        setUsers(mapped);
      }
      setLoading(false);
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 15000); // Refresh every 15s

    // Subscribe to realtime updates
    const channel = supabase
      .channel('active_users_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visitor_sessions' },
        () => {
          fetchActiveUsers();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const formatPage = (url: string | null) => {
    if (!url) return 'Unknown page';
    if (url === '/') return 'Homepage';
    return url.replace(/^\//, '').replace(/-/g, ' ').slice(0, 20);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--admin-border))]" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-24 bg-[hsl(var(--admin-border))] rounded" />
              <div className="h-2 w-16 bg-[hsl(var(--admin-border))] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-[hsl(var(--admin-text-subtle))]">
        <User className="w-8 h-8 mb-2 opacity-30" />
        <p className="text-sm">No active users</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[280px] overflow-y-auto">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 p-2.5 rounded-lg bg-[hsl(var(--admin-bg-card))] hover:bg-[hsl(var(--admin-bg-elevated))] transition-colors"
        >
          {/* Status indicator */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] flex items-center justify-center text-[hsl(var(--admin-text-muted))]">
              {getDeviceIcon(user.device_type)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[hsl(var(--admin-bg-card))]" />
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[hsl(var(--admin-text))] truncate">
                {formatPage(user.current_page)}
              </span>
              {user.page_views && user.page_views > 1 && (
                <span className="text-xs text-[hsl(var(--admin-text-subtle))] bg-[hsl(var(--admin-bg-elevated))] px-1.5 py-0.5 rounded">
                  {user.page_views} pages
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--admin-text-subtle))]">
              {user.city || user.country ? (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {user.city || user.country}
                </span>
              ) : null}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(user.last_seen), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveUsersPanel;
