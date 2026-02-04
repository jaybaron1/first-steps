import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { 
  Eye, 
  MousePointer, 
  ScrollText, 
  Clock, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface TimelineEvent {
  id: string;
  type: 'page_view' | 'cta_click' | 'scroll' | 'time_on_page';
  page_url: string;
  page_title: string | null;
  created_at: string;
  data?: {
    scroll_depth?: number;
    time_on_page?: number;
    cta_name?: string;
  };
}

interface VisitorJourney {
  session_id: string;
  country: string | null;
  city: string | null;
  device_type: string | null;
  first_seen: string;
  events: TimelineEvent[];
}

const VisitorTimeline: React.FC = () => {
  const [journeys, setJourneys] = useState<VisitorJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    const fetchJourneys = async () => {
      // Get recent sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('visitor_sessions')
        .select('session_id, country, city, device_type, first_seen')
        .order('last_seen', { ascending: false })
        .limit(5);

      if (sessionsError || !sessions) {
        setLoading(false);
        return;
      }

      // Get page views for these sessions
      const sessionIds = sessions.map((s) => s.session_id);
      
      const { data: pageViews } = await supabase
        .from('page_views')
        .select('id, session_id, page_url, page_title, created_at, scroll_depth, time_on_page')
        .in('session_id', sessionIds)
        .order('created_at', { ascending: true });

      // Get events for these sessions
      const { data: events } = await supabase
        .from('visitor_events')
        .select('id, session_id, event_type, event_data, created_at')
        .in('session_id', sessionIds)
        .order('created_at', { ascending: true });

      // Build journeys
      const journeyMap: Record<string, VisitorJourney> = {};
      
      sessions.forEach((s) => {
        journeyMap[s.session_id] = {
          session_id: s.session_id,
          country: s.country,
          city: s.city,
          device_type: s.device_type,
          first_seen: s.first_seen || '',
          events: [],
        };
      });

      // Add page views as events
      pageViews?.forEach((pv) => {
        if (journeyMap[pv.session_id]) {
          journeyMap[pv.session_id].events.push({
            id: pv.id,
            type: 'page_view',
            page_url: pv.page_url,
            page_title: pv.page_title,
            created_at: pv.created_at || '',
            data: {
              scroll_depth: pv.scroll_depth || undefined,
              time_on_page: pv.time_on_page || undefined,
            },
          });
        }
      });

      // Add CTA clicks
      events?.forEach((e) => {
        if (journeyMap[e.session_id] && e.event_type === 'cta_click') {
          const eventData = e.event_data as { cta_name?: string; page_url?: string } | null;
          journeyMap[e.session_id].events.push({
            id: e.id,
            type: 'cta_click',
            page_url: eventData?.page_url || '',
            page_title: null,
            created_at: e.created_at || '',
            data: {
              cta_name: eventData?.cta_name,
            },
          });
        }
      });

      // Sort events within each journey
      Object.values(journeyMap).forEach((journey) => {
        journey.events.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      setJourneys(Object.values(journeyMap));
      setLoading(false);
    };

    fetchJourneys();
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'page_view':
        return <Eye className="w-3.5 h-3.5" />;
      case 'cta_click':
        return <MousePointer className="w-3.5 h-3.5" />;
      case 'scroll':
        return <ScrollText className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const formatPageName = (url: string) => {
    if (url === '/') return 'Homepage';
    return url.replace(/^\//, '').replace(/-/g, ' ').replace(/\//g, ' → ');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 w-32 bg-[hsl(var(--admin-border))] rounded mb-2" />
            <div className="space-y-2 ml-4">
              <div className="h-3 w-48 bg-[hsl(var(--admin-border))] rounded" />
              <div className="h-3 w-40 bg-[hsl(var(--admin-border))] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (journeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-[hsl(var(--admin-text-subtle))]">
        <Clock className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm">No visitor journeys yet</p>
        <p className="text-xs mt-1">Journeys will appear as visitors browse</p>
      </div>
    );
  }

  const displayedJourney = selectedSession 
    ? journeys.find((j) => j.session_id === selectedSession)
    : journeys[0];

  return (
    <div className="space-y-4">
      {/* Session selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {journeys.map((journey, idx) => (
          <button
            key={journey.session_id}
            onClick={() => setSelectedSession(journey.session_id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              (selectedSession === journey.session_id) || (!selectedSession && idx === 0)
                ? 'bg-[#B8956C] text-white'
                : 'bg-[hsl(var(--admin-bg-card))] text-[hsl(var(--admin-text-muted))] hover:bg-[hsl(var(--admin-bg-elevated))]'
            }`}
          >
            {journey.city || journey.country || `Visitor ${idx + 1}`}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {displayedJourney && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[hsl(var(--admin-border-subtle))]" />

          <div className="space-y-3">
            {displayedJourney.events.map((event, idx) => (
              <div key={event.id} className="flex gap-3 relative">
                {/* Icon */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                  event.type === 'cta_click' 
                    ? 'bg-[#B8956C]/20 text-[#B8956C]' 
                    : 'bg-[hsl(var(--admin-bg-elevated))] text-[hsl(var(--admin-text-muted))] border border-[hsl(var(--admin-border-subtle))]'
                }`}>
                  {getEventIcon(event.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[hsl(var(--admin-text))]">
                      {event.type === 'cta_click' 
                        ? `Clicked: ${event.data?.cta_name || 'CTA'}`
                        : formatPageName(event.page_url)
                      }
                    </span>
                    {idx < displayedJourney.events.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-[hsl(var(--admin-text-subtle))] hidden sm:block" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[hsl(var(--admin-text-subtle))] mt-0.5">
                    <span>{format(new Date(event.created_at), 'HH:mm:ss')}</span>
                    {event.data?.scroll_depth && (
                      <span>Scrolled {event.data.scroll_depth}%</span>
                    )}
                    {event.data?.time_on_page && event.data.time_on_page > 0 && (
                      <span>{Math.round(event.data.time_on_page / 1000)}s</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Session summary */}
          <div className="mt-4 pt-3 border-t border-[hsl(var(--admin-border-subtle))]">
            <div className="flex items-center justify-between text-xs text-[hsl(var(--admin-text-subtle))]">
              <span>Started {formatDistanceToNow(new Date(displayedJourney.first_seen), { addSuffix: true })}</span>
              <span>{displayedJourney.events.length} actions</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorTimeline;
