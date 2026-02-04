import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { Bell, AlertTriangle, TrendingUp, Users, Zap, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  id: string;
  type: 'high_value_visitor' | 'traffic_spike' | 'new_lead' | 'campaign_alert';
  title: string;
  description: string;
  timestamp: Date;
  dismissed?: boolean;
}

const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'high_value_visitor':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'traffic_spike':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'new_lead':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'campaign_alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    const generateAlerts = async () => {
      const generatedAlerts: Alert[] = [];
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check for high-value visitors (lead_score >= 100)
      const { data: highValueVisitors } = await supabase
        .from('visitor_sessions')
        .select('id, lead_score, last_seen')
        .gte('lead_score', 100)
        .gte('last_seen', new Date(now.getTime() - 60 * 60 * 1000).toISOString())
        .order('lead_score', { ascending: false })
        .limit(3);

      if (highValueVisitors && highValueVisitors.length > 0) {
        highValueVisitors.forEach((v) => {
          generatedAlerts.push({
            id: `hv-${v.id}`,
            type: 'high_value_visitor',
            title: 'High-Value Visitor',
            description: `Visitor with score ${v.lead_score} is currently active`,
            timestamp: new Date(v.last_seen),
          });
        });
      }

      // Check for new leads today
      const { data: newLeads, count: leadCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .gte('created_at', today.toISOString());

      if (leadCount && leadCount > 0) {
        generatedAlerts.push({
          id: 'leads-today',
          type: 'new_lead',
          title: 'New Leads Today',
          description: `${leadCount} new lead${leadCount > 1 ? 's' : ''} captured today`,
          timestamp: now,
        });
      }

      // Check for traffic spike (compare today vs average)
      const { count: todayViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact' })
        .gte('created_at', today.toISOString());

      if (todayViews && todayViews > 50) {
        generatedAlerts.push({
          id: 'traffic-spike',
          type: 'traffic_spike',
          title: 'Traffic Spike',
          description: `${todayViews} page views today - higher than usual`,
          timestamp: now,
        });
      }

      setAlerts(generatedAlerts);
      setLoading(false);
    };

    generateAlerts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-[hsl(var(--admin-bg-card))] rounded-lg animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--admin-border))]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-[hsl(var(--admin-border))] rounded" />
              <div className="h-3 w-48 bg-[hsl(var(--admin-border))] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-[hsl(var(--admin-text-subtle))]">
        <Bell className="w-8 h-8 mb-2 opacity-30" />
        <p className="text-sm">No alerts at this time</p>
        <p className="text-xs mt-1">All systems running normally</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start gap-3 p-3 bg-[hsl(var(--admin-bg-card))] rounded-lg border border-[hsl(var(--admin-border-subtle))] group"
        >
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--admin-bg-elevated))] flex items-center justify-center">
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[hsl(var(--admin-text))]">
              {alert.title}
            </p>
            <p className="text-xs text-[hsl(var(--admin-text-muted))] mt-0.5">
              {alert.description}
            </p>
            <p className="text-xs text-[hsl(var(--admin-text-subtle))] mt-1">
              {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
            </p>
          </div>
          <button
            onClick={() => dismissAlert(alert.id)}
            className="p-1 text-[hsl(var(--admin-text-subtle))] hover:text-[hsl(var(--admin-text))] opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertsPanel;
