  import React, { useEffect, useState } from 'react';
  import { Clock, MousePointer, Eye, ExternalLink, MapPin, Smartphone, Monitor,
  Tablet } from 'lucide-react';
  import { adminSupabase } from '@/lib/adminBackend';
  import { cn } from '@/lib/utils';

  interface TimelineEvent {
    id: string;
    session_id: string;
    event_type: 'page_view' | 'session_start' | 'event';
    page_url?: string;
    page_title?: string;
    event_data?: any;
    timestamp: string;
    city?: string;
    country?: string;
    device_type?: string;
    time_on_page?: number;
  }

  interface VisitorTimelineProps {
    maxEvents?: number;
    sessionId?: string;
  }

  const VisitorTimeline: React.FC<VisitorTimelineProps> = ({
    maxEvents = 20,
    sessionId
  }) => {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchTimeline();

      // Subscribe to real-time updates
      const channel = adminSupabase
        .channel('timeline-updates')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'page_views' },
          () => fetchTimeline()
        )
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'visitor_events' },
          () => fetchTimeline()
        )
        .subscribe();

      return () => {
        adminSupabase.removeChannel(channel);
      };
    }, [sessionId]);

    const fetchTimeline = async () => {
      try {
        const timelineEvents: TimelineEvent[] = [];

        // Fetch page views
        let pageViewsQuery = adminSupabase
          .from('page_views')
          .select(`
            id,
            session_id,
            page_url,
            page_title,
            time_on_page,
            created_at,
            visitor_sessions(city, country, device_type)
          `)
          .order('created_at', { ascending: false })
          .limit(maxEvents);

        if (sessionId) {
          pageViewsQuery = pageViewsQuery.eq('session_id', sessionId);
        }

        const { data: pageViews, error: pvError } = await pageViewsQuery;
        if (pvError) throw pvError;

        pageViews?.forEach((pv: any) => {
          timelineEvents.push({
            id: pv.id,
            session_id: pv.session_id,
            event_type: 'page_view',
            page_url: pv.page_url,
            page_title: pv.page_title,
            timestamp: pv.created_at,
            time_on_page: pv.time_on_page,
            city: pv.visitor_sessions?.city,
            country: pv.visitor_sessions?.country,
            device_type: pv.visitor_sessions?.device_type,
          });
        });

        // Fetch custom events
        let eventsQuery = adminSupabase
          .from('visitor_events')
          .select(`
            id,
            session_id,
            event_type,
            event_data,
            created_at,
            visitor_sessions(city, country, device_type)
          `)
          .order('created_at', { ascending: false })
          .limit(maxEvents);

        if (sessionId) {
          eventsQuery = eventsQuery.eq('session_id', sessionId);
        }

        const { data: customEvents, error: ceError } = await eventsQuery;
        if (ceError) throw ceError;

        customEvents?.forEach((ce: any) => {
          timelineEvents.push({
            id: ce.id,
            session_id: ce.session_id,
            event_type: 'event',
            event_data: ce.event_data,
            timestamp: ce.created_at,
            city: ce.visitor_sessions?.city,
            country: ce.visitor_sessions?.country,
            device_type: ce.visitor_sessions?.device_type,
          });
        });

        // Sort by timestamp
        const sorted = timelineEvents
          .sort((a, b) => new Date(b.timestamp).getTime() - new
  Date(a.timestamp).getTime())
          .slice(0, maxEvents);

        setEvents(sorted);
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    const formatPageUrl = (url?: string) => {
      if (!url) return 'Unknown';
      try {
        const path = new URL(url).pathname;
        return path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, '
  / ');
      } catch {
        return url;
      }
    };

    const formatTime = (timestamp: string) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;

      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    const formatDuration = (seconds?: number) => {
      if (!seconds) return null;
      if (seconds < 60) return `${Math.round(seconds)}s`;
      const minutes = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${minutes}m ${secs}s`;
    };

    const getDeviceIcon = (deviceType?: string) => {
      switch (deviceType?.toLowerCase()) {
        case 'mobile':
          return <Smartphone className="w-3.5 h-3.5" />;
        case 'tablet':
          return <Tablet className="w-3.5 h-3.5" />;
        default:
          return <Monitor className="w-3.5 h-3.5" />;
      }
    };

    const getEventIcon = (eventType: TimelineEvent['event_type']) => {
      switch (eventType) {
        case 'page_view':
          return <Eye className="w-4 h-4" />;
        case 'session_start':
          return <MousePointer className="w-4 h-4" />;
        case 'event':
          return <MousePointer className="w-4 h-4" />;
      }
    };

    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#F3EDE4] animate-pulse"
   />
                <div className="w-0.5 h-16 bg-[#F3EDE4] mt-2" />
              </div>
              <div className="flex-1 pb-8">
                <div className="h-4 w-3/4 bg-[#F3EDE4] rounded animate-pulse
  mb-2" />
                <div className="h-3 w-1/2 bg-[#F3EDE4] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12
  text-center">
          <div className="w-12 h-12 rounded-full bg-[#F3EDE4] flex items-center
  justify-center mb-3">
            <Clock className="w-6 h-6 text-[#B8956C]" />
          </div>
          <p className="text-sm text-[#8C857A]">No activity yet</p>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Timeline */}
        <div className="space-y-0">
          {events.map((event, index) => {
            const isLast = index === events.length - 1;

            return (
              <div key={event.id} className="flex gap-4 group">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center
  transition-all duration-200",
                    "bg-white border-2 border-[#B8956C]/30
  group-hover:border-[#B8956C] group-hover:shadow-md",
                    "text-[#B8956C]"
                  )}>
                    {getEventIcon(event.event_type)}
                  </div>
                  {!isLast && (
                    <div className="w-0.5 h-full min-h-[60px] bg-gradient-to-b
  from-[#B8956C]/30 to-[#B8956C]/10 mt-2" />
                  )}
                </div>

                {/* Event Content */}
                <div className={cn(
                  "flex-1 pb-8 group",
                  !isLast && "border-l-0"
                )}>
                  <div className={cn(
                    "p-4 rounded-lg transition-all duration-200",
                    "bg-[#F9F6F0] group-hover:bg-[#F3EDE4]
  group-hover:shadow-sm",
                    "border border-transparent group-hover:border-[#B8956C]/30"
                  )}>
                    {/* Event Header */}
                    <div className="flex items-start justify-between gap-2
  mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#1A1915]
  capitalize truncate">
                          {event.page_title || formatPageUrl(event.page_url) ||
  'Custom Event'}
                        </h4>
                        {event.page_url && (
                          <p className="text-xs text-[#8C857A] truncate mt-0.5">
                            {event.page_url}
                          </p>
                        )}
                      </div>

                      {event.page_url && (
                        <a
                          href={event.page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 w-6 h-6 rounded bg-white
  border border-[#B8956C]/20 flex items-center justify-center opacity-0
  group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="w-3 h-3 text-[#B8956C]" />
                        </a>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex items-center gap-3 text-xs
  text-[#8C857A] flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(event.timestamp)}
                      </span>

                      {event.time_on_page && formatDuration(event.time_on_page)
  && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-[#1A1915]">
                            {formatDuration(event.time_on_page)}
                          </span>
                          <span>on page</span>
                        </span>
                      )}

                      {event.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.city}
                        </span>
                      )}

                      {event.device_type && (
                        <span className="flex items-center gap-1
  text-[#B8956C]">
                          {getDeviceIcon(event.device_type)}
                          <span
  className="capitalize">{event.device_type}</span>
                        </span>
                      )}
                    </div>

                    {/* Event Data */}
                    {event.event_data && (
                      <div className="mt-3 pt-3 border-t border-[#B8956C]/10">
                        <pre className="text-xs text-[#2D2A24] font-mono
  bg-white rounded p-2 overflow-x-auto">
                          {JSON.stringify(event.event_data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  export default VisitorTimeline;