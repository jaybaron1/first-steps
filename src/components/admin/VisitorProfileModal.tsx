import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Clock,
  MousePointer,
  Link2,
  Building,
  Users,
  Briefcase,
  Sparkles,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { adminSupabase } from '@/lib/adminBackend';
import LeadTemperatureBadge from './LeadTemperatureBadge';
import { formatDistanceToNow, format } from 'date-fns';

interface VisitorSession {
  session_id: string;
  fingerprint_hash: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  first_seen: string | null;
  last_seen: string | null;
  lead_score: number | null;
  page_views: number | null;
  total_time_seconds: number | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  company_name: string | null;
  company_size: string | null;
  company_industry: string | null;
  screen_resolution: string | null;
  viewport_size: string | null;
  timezone: string | null;
  language: string | null;
}

interface PageView {
  id: string;
  page_url: string;
  page_title: string | null;
  scroll_depth: number | null;
  time_on_page: number | null;
  created_at: string | null;
}

interface VisitorEvent {
  id: string;
  event_type: string;
  event_data: Record<string, any> | null;
  created_at: string | null;
  session_id: string | null;
}

interface VisitorProfileModalProps {
  sessionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VisitorProfileModal: React.FC<VisitorProfileModalProps> = ({
  sessionId,
  open,
  onOpenChange,
}) => {
  const [visitor, setVisitor] = useState<VisitorSession | null>(null);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [events, setEvents] = useState<VisitorEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId && open) {
      fetchVisitorData();
    }
  }, [sessionId, open]);

  const fetchVisitorData = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      // Fetch visitor session
      const { data: session } = await adminSupabase
        .from('visitor_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      setVisitor(session);

      // Fetch page views
      const { data: views } = await adminSupabase
        .from('page_views')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      setPageViews(views || []);

      // Fetch events
      const { data: eventsData } = await adminSupabase
        .from('visitor_events')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      setEvents((eventsData || []).map(e => ({
        ...e,
        event_data: e.event_data as Record<string, any> | null,
        created_at: e.created_at || null,
      })));
    } catch (err) {
      console.error('Error fetching visitor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const formatPageUrl = (url: string | null) => {
    if (!url) return 'Unknown';
    try {
      const urlObj = new URL(url);
      return urlObj.pathname === '/' ? 'Home' : urlObj.pathname;
    } catch {
      return url;
    }
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B8956C]/10 text-[#B8956C]">
              {visitor && getDeviceIcon(visitor.device_type)}
            </div>
            <div>
              <span className="text-[#1A1915]">
                {visitor?.city || visitor?.country || 'Unknown Visitor'}
              </span>
              {visitor?.lead_score !== null && visitor?.lead_score > 0 && (
                <LeadTemperatureBadge score={visitor.lead_score} className="ml-2" />
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8956C]" />
          </div>
        ) : visitor ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#F3EDE4]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="journey">Journey ({pageViews.length})</TabsTrigger>
              <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4 pr-4">
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-[#8C857A]" />
                      <span className="text-[#4A4640]">
                        {[visitor.city, visitor.country].filter(Boolean).join(', ') || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-[#8C857A]" />
                      <span className="text-[#4A4640]">{visitor.browser} / {visitor.os}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-[#8C857A]" />
                      <span className="text-[#4A4640]">
                        {formatTime(visitor.total_time_seconds)} on site
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MousePointer className="w-4 h-4 text-[#8C857A]" />
                      <span className="text-[#4A4640]">{visitor.page_views || 0} pages viewed</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-[#8C857A]" />
                      <span className="text-[#4A4640]">
                        First seen: {visitor.first_seen 
                          ? formatDistanceToNow(new Date(visitor.first_seen), { addSuffix: true })
                          : 'Unknown'}
                      </span>
                    </div>
                    {visitor.referrer && (
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="w-4 h-4 text-[#8C857A]" />
                        <span className="text-[#4A4640] truncate">
                          From: {(() => {
                            try {
                              return new URL(visitor.referrer).hostname;
                            } catch {
                              return 'Direct';
                            }
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* UTM Tags */}
                {(visitor.utm_source || visitor.utm_medium || visitor.utm_campaign) && (
                  <div className="bg-[#F9F6F0] rounded-xl p-4 border border-[#B8956C]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Link2 className="w-4 h-4 text-[#B8956C]" />
                      <span className="text-sm font-medium text-[#1A1915]">Campaign Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {visitor.utm_source && (
                        <Badge variant="outline">source: {visitor.utm_source}</Badge>
                      )}
                      {visitor.utm_medium && (
                        <Badge variant="outline">medium: {visitor.utm_medium}</Badge>
                      )}
                      {visitor.utm_campaign && (
                        <Badge variant="outline">campaign: {visitor.utm_campaign}</Badge>
                      )}
                      {visitor.utm_term && (
                        <Badge variant="outline">term: {visitor.utm_term}</Badge>
                      )}
                      {visitor.utm_content && (
                        <Badge variant="outline">content: {visitor.utm_content}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Company Enrichment */}
                {(visitor.company_name || visitor.company_industry || visitor.company_size) && (
                  <div className="bg-[#B8956C]/5 rounded-xl p-4 border border-[#B8956C]/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-[#B8956C]" />
                      <span className="text-sm font-medium text-[#B8956C]">Enriched Company Data</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {visitor.company_name && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-[#8C857A]" />
                          <span className="font-medium text-[#1A1915]">{visitor.company_name}</span>
                        </div>
                      )}
                      {visitor.company_size && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-[#8C857A]" />
                          <Badge variant="secondary">{visitor.company_size}</Badge>
                        </div>
                      )}
                      {visitor.company_industry && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-[#8C857A]" />
                          <Badge variant="outline">{visitor.company_industry}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tech Details */}
                <div className="text-xs text-[#8C857A] space-y-1">
                  <p>Screen: {visitor.screen_resolution || 'Unknown'}</p>
                  <p>Viewport: {visitor.viewport_size || 'Unknown'}</p>
                  <p>Timezone: {visitor.timezone || 'Unknown'}</p>
                  <p>Language: {visitor.language || 'Unknown'}</p>
                  <p className="font-mono">ID: {visitor.fingerprint_hash?.substring(0, 24)}...</p>
                </div>
              </TabsContent>

              <TabsContent value="journey" className="mt-0">
                <div className="space-y-2">
                  {pageViews.length === 0 ? (
                    <p className="text-center text-[#8C857A] py-8">No page views recorded</p>
                  ) : (
                    pageViews.map((view, idx) => (
                      <div
                        key={view.id}
                        className="flex items-start gap-3 p-3 bg-[#F9F6F0] rounded-lg"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-[#B8956C] text-white text-xs flex items-center justify-center font-medium">
                            {idx + 1}
                          </div>
                          {idx < pageViews.length - 1 && (
                            <div className="w-0.5 h-8 bg-[#B8956C]/30 mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1A1915]">
                            {formatPageUrl(view.page_url)}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-[#8C857A] mt-1">
                            <span>{formatTime(view.time_on_page)}</span>
                            {view.scroll_depth !== null && (
                              <span>{view.scroll_depth}% scrolled</span>
                            )}
                            {view.created_at && (
                              <span>{format(new Date(view.created_at), 'HH:mm:ss')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <div className="space-y-2">
                  {events.length === 0 ? (
                    <p className="text-center text-[#8C857A] py-8">No events recorded</p>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 bg-[#F9F6F0] rounded-lg"
                      >
                        <div className="p-1.5 rounded-lg bg-[#B8956C]/10">
                          <Activity className="w-4 h-4 text-[#B8956C]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1A1915]">{event.event_type}</p>
                          {event.event_data && Object.keys(event.event_data).length > 0 && (
                            <pre className="text-xs text-[#8C857A] mt-1 whitespace-pre-wrap">
                              {JSON.stringify(event.event_data, null, 2)}
                            </pre>
                          )}
                          {event.created_at && (
                            <span className="text-xs text-[#8C857A]">
                              {format(new Date(event.created_at), 'MMM d, HH:mm:ss')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        ) : (
          <p className="text-center text-[#8C857A] py-8">Visitor not found</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VisitorProfileModal;
