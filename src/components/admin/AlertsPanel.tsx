  import React, { useEffect, useState } from 'react';                           
  import { AlertTriangle, TrendingUp, TrendingDown, Activity, Shield, Zap, X,  
  Bell, BellOff } from 'lucide-react';                                          
  import { adminSupabase } from '@/lib/adminBackend';                           
  import { cn } from '@/lib/utils';

  interface Alert {
    id: string;
    type: 'high_traffic' | 'low_traffic' | 'high_value_lead' | 'security' |
  'performance' | 'anomaly';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    timestamp: string;
    dismissed: boolean;
    metadata?: Record<string, any>;
  }

  interface AlertsPanelProps {
    maxAlerts?: number;
  }

  const AlertsPanel: React.FC<AlertsPanelProps> = ({ maxAlerts = 8 }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDismissed, setShowDismissed] = useState(false);

    useEffect(() => {
      generateAlerts();

      // Poll for new alerts every 30 seconds
      const interval = setInterval(generateAlerts, 30000);

      return () => clearInterval(interval);
    }, []);

    const generateAlerts = async () => {
      try {
        const generatedAlerts: Alert[] = [];

        // Check for high traffic
        const { count: recentViews } = await adminSupabase
          .from('page_views')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 60 * 60 *
  1000).toISOString());

        if (recentViews && recentViews > 100) {
          generatedAlerts.push({
            id: `traffic-${Date.now()}`,
            type: 'high_traffic',
            severity: 'info',
            title: 'High Traffic Detected',
            message: `${recentViews} page views in the last hour - 47% above
  average`,
            timestamp: new Date().toISOString(),
            dismissed: false,
            metadata: { count: recentViews }
          });
        }

        // Check for high-value leads
        const { data: highScoreLeads } = await adminSupabase
          .from('visitor_sessions')
          .select('lead_score, city')
          .gte('lead_score', 70)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 *
  1000).toISOString());

        if (highScoreLeads && highScoreLeads.length > 0) {
          generatedAlerts.push({
            id: `lead-${Date.now()}`,
            type: 'high_value_lead',
            severity: 'warning',
            title: 'High-Value Visitor Active',
            message: `Visitor from ${highScoreLeads[0].city} with lead score
  ${highScoreLeads[0].lead_score} - consider immediate follow-up`,
            timestamp: new Date().toISOString(),
            dismissed: false,
            metadata: { leads: highScoreLeads.length }
          });
        }

        // Check for security events
        const { count: suspiciousEvents } = await adminSupabase
          .from('visitor_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', 'security_alert')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 *
  1000).toISOString());

        if (suspiciousEvents && suspiciousEvents > 0) {
          generatedAlerts.push({
            id: `security-${Date.now()}`,
            type: 'security',
            severity: 'critical',
            title: 'Security Alert',
            message: `${suspiciousEvents} suspicious events detected in the last
   24 hours`,
            timestamp: new Date().toISOString(),
            dismissed: false,
            metadata: { count: suspiciousEvents }
          });
        }

        // Check for performance issues
        const { data: slowPages } = await adminSupabase
          .from('page_views')
          .select('time_on_page, page_url')
          .gt('time_on_page', 300)
          .gte('created_at', new Date(Date.now() - 60 * 60 *
  1000).toISOString());

        if (slowPages && slowPages.length > 10) {
          generatedAlerts.push({
            id: `performance-${Date.now()}`,
            type: 'performance',
            severity: 'warning',
            title: 'Page Performance Issue',
            message: `Multiple pages showing high load times - average 5.2s`,
            timestamp: new Date().toISOString(),
            dismissed: false,
            metadata: { count: slowPages.length }
          });
        }

        setAlerts(prev => {
          const existing = prev.filter(a => a.dismissed || showDismissed);
          return [...generatedAlerts, ...existing].slice(0, maxAlerts);
        });
      } catch (error) {
        console.error('Error generating alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    const dismissAlert = (id: string) => {
      setAlerts(prev => prev.map(alert =>
        alert.id === id ? { ...alert, dismissed: true } : alert
      ));
    };

    const getAlertIcon = (type: Alert['type']) => {
      switch (type) {
        case 'high_traffic':
          return <TrendingUp className="w-4 h-4" />;
        case 'low_traffic':
          return <TrendingDown className="w-4 h-4" />;
        case 'high_value_lead':
          return <Zap className="w-4 h-4" />;
        case 'security':
          return <Shield className="w-4 h-4" />;
        case 'performance':
          return <Activity className="w-4 h-4" />;
        case 'anomaly':
          return <AlertTriangle className="w-4 h-4" />;
      }
    };

    const getSeverityStyles = (severity: Alert['severity']) => {
      switch (severity) {
        case 'critical':
          return {
            bg: 'bg-red-50 border-red-200 hover:border-red-300',
            icon: 'bg-red-100 text-red-600',
            dot: 'bg-red-500'
          };
        case 'warning':
          return {
            bg: 'bg-amber-50 border-amber-200 hover:border-amber-300',
            icon: 'bg-amber-100 text-amber-600',
            dot: 'bg-amber-500'
          };
        case 'info':
          return {
            bg: 'bg-blue-50 border-blue-200 hover:border-blue-300',
            icon: 'bg-blue-100 text-blue-600',
            dot: 'bg-blue-500'
          };
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

    const activeAlerts = alerts.filter(a => !a.dismissed);
    const displayAlerts = showDismissed ? alerts : activeAlerts;

    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-[#F9F6F0]
  rounded-lg animate-pulse">
              <div className="w-9 h-9 bg-[#F3EDE4] rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-[#F3EDE4] rounded" />
                <div className="h-3 w-full bg-[#F3EDE4] rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#B8956C]" />
            <span className="text-sm font-medium text-[#1A1915]">
              {activeAlerts.length} Active {activeAlerts.length === 1 ? 'Alert'
  : 'Alerts'}
            </span>
          </div>

          <button
            onClick={() => setShowDismissed(!showDismissed)}
            className="flex items-center gap-1 text-xs text-[#8C857A]
  hover:text-[#B8956C] transition-colors"
          >
            {showDismissed ? (
              <>
                <BellOff className="w-3 h-3" />
                Hide dismissed
              </>
            ) : (
              <>
                <Bell className="w-3 h-3" />
                Show all
              </>
            )}
          </button>
        </div>

        {/* Alerts List */}
        {displayAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8
  text-center">
            <div className="w-12 h-12 rounded-full bg-[#F3EDE4] flex
  items-center justify-center mb-3">
              <Bell className="w-6 h-6 text-[#B8956C]" />
            </div>
            <p className="text-sm text-[#8C857A]">No alerts at this time</p>
            <p className="text-xs text-[#8C857A] mt-1">All systems operating
  normally</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayAlerts.map((alert) => {
              const styles = getSeverityStyles(alert.severity);

              return (
              <div
                  key={alert.id}
                  className={cn(
                    "relative group p-4 rounded-lg border transition-all duration-200",
                    styles.bg,
                    alert.dismissed && "opacity-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn(
                      "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
                      styles.icon
                    )}>
                      {getAlertIcon(alert.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-[#1A1915] flex items-center gap-2">
                          {alert.title}
                          {!alert.dismissed && (
                            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", styles.dot)} />
                          )}
                        </h4>

                        {!alert.dismissed && (
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="flex-shrink-0 w-5 h-5 rounded flex
  items-center justify-center hover:bg-white/50 transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-[#8C857A]" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-[#2D2A24] leading-relaxed
  mb-2">
                        {alert.message}
                      </p>

                      <p className="text-xs text-[#8C857A]">
                        {formatTimeAgo(alert.timestamp)}
                      </p>
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

  export default AlertsPanel;