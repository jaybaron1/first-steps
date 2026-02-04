  import React, { useEffect, useState } from 'react';                           
  import { Users, Eye, MousePointer, Clock, Wifi, MapPin } from 'lucide-react';
  import { adminSupabase } from '@/lib/adminBackend';                           
  import { cn } from '@/lib/utils';                                             

  interface ActiveUser {
    session_id: string;
    city: string | null;
    country: string | null;
    current_page: string | null;
    last_activity: string;
    duration_seconds: number;
    page_count: number;
    device_type: string | null;
  }

  const ActiveUsersPanel: React.FC = () => {
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalActive, setTotalActive] = useState(0);

    useEffect(() => {
      fetchActiveUsers();

      // Update every 10 seconds
      const interval = setInterval(fetchActiveUsers, 10000);

      // Subscribe to real-time updates
      const channel = adminSupabase
        .channel('active-users-updates')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'page_views' },
          () => fetchActiveUsers()
        )
        .subscribe();

      return () => {
        clearInterval(interval);
        adminSupabase.removeChannel(channel);
      };
    }, []);

    const fetchActiveUsers = async () => {
      try {
        // Get sessions active in last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 *
  1000).toISOString();

        const { data: sessions, error } = await adminSupabase
          .from('visitor_sessions')
          .select('session_id, city, country, device_type, first_seen')
          .gte('first_seen', fiveMinutesAgo);

        if (error) throw error;

        const usersWithActivity = await Promise.all(
          (sessions || []).map(async (session) => {
            const { data: pages } = await adminSupabase
              .from('page_views')
              .select('page_url, created_at')
              .eq('session_id', session.session_id)
              .order('created_at', { ascending: false });

            const lastPage = pages?.[0];
            const duration = lastPage
              ? Math.floor((new Date().getTime() - new Date(session.first_seen).getTime()) / 1000)
              : 0;

            return {
              session_id: session.session_id,
              city: session.city,
              country: session.country,
              current_page: lastPage?.page_url || null,
              last_activity: lastPage?.created_at || session.first_seen,
              duration_seconds: duration,
              page_count: pages?.length || 0,
              device_type: session.device_type,
            };
          })
        );

        // Filter to only truly active users (activity in last 5 min)
        const active = usersWithActivity.filter(user => {
          const lastActivityTime = new Date(user.last_activity).getTime();
          const now = Date.now();
          return (now - lastActivityTime) < 5 * 60 * 1000;
        });

        setActiveUsers(active);
        setTotalActive(active.length);
      } catch (error) {
        console.error('Error fetching active users:', error);
      } finally {
        setLoading(false);
      }
    };

    const formatDuration = (seconds: number) => {
      if (seconds < 60) return `${seconds}s`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m`;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    };

    const formatPageUrl = (url: string | null) => {
      if (!url) return 'Unknown page';
      try {
        const path = new URL(url).pathname;
        return path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, ' / ');
      } catch {
        return url;
      }
    };

    const getActivityStatus = (lastActivity: string) => {
      const secondsSince = Math.floor((Date.now() - new
  Date(lastActivity).getTime()) / 1000);
      if (secondsSince < 30) return { label: 'Active now', color:
  'bg-emerald-500' };
      if (secondsSince < 120) return { label: 'Active', color: 'bg-emerald-400'
  };
      return { label: 'Idle', color: 'bg-amber-400' };
    };

    if (loading) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-32 bg-[#F3EDE4] rounded animate-pulse" />
            <div className="h-8 w-16 bg-[#F3EDE4] rounded-full animate-pulse" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#F9F6F0]
  rounded-lg animate-pulse">
              <div className="w-2 h-2 bg-[#F3EDE4] rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-[#F3EDE4] rounded" />
                <div className="h-3 w-1/2 bg-[#F3EDE4] rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {/* Header with live count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#B8956C]" />
            <span className="text-sm font-medium text-[#1A1915]">Live
  Visitors</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50
  border border-emerald-200 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full
  rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2
  bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-emerald-700
  tabular-nums">{totalActive}</span>
          </div>
        </div>

        {/* Active Users List */}
        {activeUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8
  text-center">
            <div className="w-12 h-12 rounded-full bg-[#F3EDE4] flex
  items-center justify-center mb-3">
              <Users className="w-6 h-6 text-[#B8956C]" />
            </div>
            <p className="text-sm text-[#8C857A]">No active visitors</p>
            <p className="text-xs text-[#8C857A] mt-1">Waiting for
  traffic...</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {activeUsers.map((user) => {
              const status = getActivityStatus(user.last_activity);

              return (
                <div
                  key={user.session_id}
                  className={cn(
                    "group p-3 rounded-lg transition-all duration-200",
                    "bg-[#F9F6F0] hover:bg-[#F3EDE4]",
                    "border border-transparent hover:border-[#B8956C]/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Indicator */}
                    <div className="flex-shrink-0 pt-1">
                      <div className="relative">
                        <span className={cn("flex h-2.5 w-2.5 rounded-full",
  status.color)} />
                        {status.label === 'Active now' && (
                          <span className={cn(
                            "absolute inset-0 rounded-full animate-ping",
                            status.color,
                            "opacity-75"
                          )} />
                        )}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2
  mb-1.5">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[#1A1915] flex
   items-center gap-2">
                            {user.city || user.country || 'Unknown'}
                            <span className="text-xs text-[#8C857A]
  font-normal">
                              {status.label}
                            </span>
                          </h4>

                          {user.current_page && (
                            <p className="text-xs text-[#8C857A] flex
  items-center gap-1 truncate mt-0.5">
                              <Eye className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate capitalize">
                                {formatPageUrl(user.current_page)}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center gap-3 text-xs
  text-[#8C857A]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="font-medium text-[#1A1915]">
                            {formatDuration(user.duration_seconds)}
                          </span>
                        </span>

                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3" />
                          <span className="font-medium text-[#1A1915]">
                            {user.page_count}
                          </span>
                          <span>pages</span>
                        </span>

                        {user.country && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.country}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  export default ActiveUsersPanel;