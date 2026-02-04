  import React, { useEffect, useState } from 'react';                           
  import { Users, MapPin, Monitor, Smartphone, Tablet, Globe, Clock,            
  MousePointer } from 'lucide-react';                                           
  import { adminSupabase } from '@/lib/adminBackend';                           
  import { cn } from '@/lib/utils';

  interface Visitor {
    session_id: string;
    fingerprint_hash: string | null;
    ip_address: unknown;
    country: string | null;
    city: string | null;
    device_type: string | null;
    browser: string | null;
    os: string | null;
    referrer: string | null;
    first_seen: string | null;
    last_seen: string | null;
    page_count: number;
    last_page: string | null;
    lead_score: number | null;
    page_views: number | null;
    total_time_seconds: number | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    company_name: string | null;
    company_size: string | null;
    company_industry: string | null;
    id: string;
  }

  interface RecentVisitorsCardProps {
    maxVisitors?: number;
  }

  const RecentVisitorsCard: React.FC<RecentVisitorsCardProps> = ({
    maxVisitors = 10
  }) => {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchRecentVisitors();

      // Subscribe to real-time updates
      const channel = adminSupabase
        .channel('recent-visitors-updates')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'visitor_sessions' },
          () => fetchRecentVisitors()
        )
        .subscribe();

      return () => {
        adminSupabase.removeChannel(channel);
      };
    }, []);

    const fetchRecentVisitors = async () => {
      try {
        const { data: sessions, error: sessionsError } = await adminSupabase
          .from('visitor_sessions')
          .select('*')
          .order('first_seen', { ascending: false })
          .limit(maxVisitors);

        if (sessionsError) throw sessionsError;

        // Get page counts for each session
        const sessionsWithPageCount = await Promise.all(
          (sessions || []).map(async (session) => {
            const { count } = await adminSupabase
              .from('page_views')
              .select('*', { count: 'exact', head: true })
              .eq('session_id', session.session_id);

            const { data: lastPage } = await adminSupabase
              .from('page_views')
              .select('page_url')
              .eq('session_id', session.session_id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            return {
              ...session,
              page_count: count || 0,
              last_page: lastPage?.page_url || null,
            };
          })
        );

        setVisitors(sessionsWithPageCount);
      } catch (error) {
        console.error('Error fetching recent visitors:', error);
      } finally {
        setLoading(false);
      }
    };

    const getDeviceIcon = (deviceType: string | null) => {
      switch (deviceType?.toLowerCase()) {
        case 'mobile':
          return <Smartphone className="w-4 h-4" />;
        case 'tablet':
          return <Tablet className="w-4 h-4" />;
        default:
          return <Monitor className="w-4 h-4" />;
      }
    };

    const getLeadScoreColor = (score: number) => {
      if (score >= 70) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      if (score >= 40) return 'bg-amber-100 text-amber-700 border-amber-200';
      return 'bg-slate-100 text-slate-600 border-slate-200';
    };

    const getLeadScoreLabel = (score: number) => {
      if (score >= 70) return 'Hot';
      if (score >= 40) return 'Warm';
      return 'Cold';
    };

    const formatPageUrl = (url: string | null) => {
      if (!url) return 'Unknown';
      try {
        const path = new URL(url).pathname;
        return path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, ' / ');
      } catch {
        return url;
      }
    };

    const formatTimeAgo = (timestamp: string) => {
      const now = new Date();
      const then = new Date(timestamp);
      const diffMs = now.getTime() - then.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    };

    const getReferrerLabel = (referrer: string | null) => {
      if (!referrer) return 'Direct';
      try {
        const url = new URL(referrer);
        return url.hostname.replace('www.', '');
      } catch {
        return 'Direct';
      }
    };

    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-[#F9F6F0]
  rounded-lg animate-pulse">
              <div className="w-10 h-10 bg-[#F3EDE4] rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-[#F3EDE4] rounded" />
                <div className="h-3 w-1/2 bg-[#F3EDE4] rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (visitors.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12
  text-center">
          <div className="w-12 h-12 rounded-full bg-[#F3EDE4] flex items-center
  justify-center mb-3">
            <Users className="w-6 h-6 text-[#B8956C]" />
          </div>
          <p className="text-sm text-[#8C857A]">No recent visitors</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {visitors.map((visitor) => (
          <div
            key={visitor.session_id}
            className={cn(
              "group p-4 rounded-lg transition-all duration-200",
              "bg-[#F9F6F0] hover:bg-[#F3EDE4] hover:shadow-sm",
              "border border-transparent hover:border-[#B8956C]/30"
            )}
          >
            <div className="flex items-start gap-3">
              {/* Device Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white
  border border-[#B8956C]/20 flex items-center justify-center text-[#B8956C]">
                {getDeviceIcon(visitor.device_type)}
              </div>

              {/* Visitor Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-[#1A1915]">
                        {visitor.city || visitor.country || 'Unknown Location'}
                      </h4>
                      {visitor.lead_score > 0 && (
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full border",
                          getLeadScoreColor(visitor.lead_score)
                        )}>
                          {getLeadScoreLabel(visitor.lead_score)}
                        </span>
                      )}
                    </div>

                    {/* Last Page Visited */}
                    {visitor.last_page && (
                      <p className="text-xs text-[#8C857A] flex items-center gap-1 truncate mb-1.5">
                        <MousePointer className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate capitalize">
                          {formatPageUrl(visitor.last_page)}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Time Ago */}
                  <div className="flex items-center gap-1 text-xs text-[#8C857A]
   flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(visitor.first_seen || '')}</span>
                  </div>
                </div>

                {/* Visitor Details */}
                <div className="flex items-center gap-3 text-xs text-[#8C857A]">
                  {visitor.country && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {visitor.country}
                    </span>
                  )}

                  {visitor.browser && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {visitor.browser}
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <span className="font-medium
  text-[#1A1915]">{visitor.page_count}</span>
                    <span>pages</span>
                  </span>
                </div>

                {/* Referrer */}
                {visitor.referrer && (
                  <div className="mt-2 pt-2 border-t border-[#B8956C]/10">
                    <p className="text-xs text-[#8C857A]">
                      <span className="text-[#1A1915]
  font-medium">From:</span>{' '}
                      {getReferrerLabel(visitor.referrer)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fingerprint (shown on hover) */}
            <div className="mt-2 pt-2 border-t border-[#B8956C]/10 opacity-0
  group-hover:opacity-100 transition-opacity">
              <p className="text-[10px] font-mono text-[#8C857A] truncate">
                ID: {visitor.fingerprint_hash.substring(0, 16)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  export default RecentVisitorsCard;