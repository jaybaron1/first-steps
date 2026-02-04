import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { Users, Monitor, Smartphone, Tablet, Globe, Clock, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VisitorSession {
  id: string;
  session_id: string;
  device_type: string | null;
  browser: string | null;
  country: string | null;
  city: string | null;
  page_views: number | null;
  total_time_seconds: number | null;
  lead_score: number | null;
  first_seen: string;
  last_seen: string;
}

const RecentVisitorsCard: React.FC = () => {
  const [visitors, setVisitors] = useState<VisitorSession[]>([]);
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

  const formatDuration = (seconds: number | null) => {
    if (!seconds || seconds === 0) return '< 1m';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-[hsl(var(--admin-text-subtle))]';
    if (score >= 100) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-[hsl(var(--admin-text-muted))]';
  };

  useEffect(() => {
    const fetchVisitors = async () => {
      const { data, error } = await supabase
        .from('visitor_sessions')
        .select('*')
        .order('last_seen', { ascending: false })
        .limit(10);

      if (!error && data) {
        setVisitors(data);
      }
      setLoading(false);
    };

    fetchVisitors();
  }, []);

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-[hsl(var(--admin-text-subtle))] border-b border-[hsl(var(--admin-border-subtle))]">
              <th className="pb-3 font-medium">Visitor</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Pages</th>
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-[hsl(var(--admin-border-subtle))]">
                {[...Array(5)].map((_, j) => (
                  <td key={j} className="py-3">
                    <div className="h-4 w-16 bg-[hsl(var(--admin-border))] rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (visitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-[hsl(var(--admin-text-subtle))]">
        <Users className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No visitors yet</p>
        <p className="text-xs mt-1">Visitor sessions will appear here</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-[hsl(var(--admin-text-subtle))] border-b border-[hsl(var(--admin-border-subtle))]">
            <th className="pb-3 font-medium">Visitor</th>
            <th className="pb-3 font-medium">Location</th>
            <th className="pb-3 font-medium">Pages</th>
            <th className="pb-3 font-medium">Time</th>
            <th className="pb-3 font-medium">Score</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor) => (
            <tr
              key={visitor.id}
              className="border-b border-[hsl(var(--admin-border-subtle))] hover:bg-[hsl(var(--admin-bg-card))] transition-colors"
            >
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--admin-bg-card))] border border-[hsl(var(--admin-border-subtle))] flex items-center justify-center text-[hsl(var(--admin-text-muted))]">
                    {getDeviceIcon(visitor.device_type)}
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--admin-text))]">
                      {visitor.browser || 'Unknown'}
                    </p>
                    <p className="text-xs text-[hsl(var(--admin-text-subtle))] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(visitor.last_seen), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-1 text-sm text-[hsl(var(--admin-text-muted))]">
                  <Globe className="w-3 h-3" />
                  {visitor.city && visitor.country
                    ? `${visitor.city}, ${visitor.country}`
                    : visitor.country || 'Unknown'}
                </div>
              </td>
              <td className="py-3">
                <span className="text-sm font-medium text-[hsl(var(--admin-text))] tabular-nums">
                  {visitor.page_views || 1}
                </span>
              </td>
              <td className="py-3">
                <span className="text-sm text-[hsl(var(--admin-text-muted))] tabular-nums">
                  {formatDuration(visitor.total_time_seconds)}
                </span>
              </td>
              <td className="py-3">
                <div className={`flex items-center gap-1 ${getScoreColor(visitor.lead_score)}`}>
                  {(visitor.lead_score || 0) >= 100 && <Star className="w-3 h-3" />}
                  <span className="text-sm font-medium tabular-nums">
                    {visitor.lead_score || 0}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentVisitorsCard;
