import { useQuery } from "@tanstack/react-query";
import { adminSupabase as supabase } from "@/lib/adminBackend";

interface LoginAttempt {
  id: string;
  timestamp: string;
  email: string;
  status: "success" | "failed";
  ip_address?: string;
  user_agent?: string;
}

interface SecurityAlert {
  id: string;
  type: "failed_login" | "rate_limit" | "suspicious_activity";
  severity: "low" | "medium" | "high";
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface AuditLogEntry {
  id: string;
  action: string;
  user_email?: string;
  details?: Record<string, any>;
  timestamp: string;
}

interface SecurityStats {
  loginAttempts: LoginAttempt[];
  totalLoginAttempts: number;
  successfulLogins: number;
  failedLogins: number;
  failedLoginRate: number;
  alerts: SecurityAlert[];
  auditLog: AuditLogEntry[];
  recentActivity: { action: string; count: number }[];
  loading: boolean;
  error: Error | null;
}

export const useSecurityEvents = (days: number = 7): SecurityStats => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, isLoading, error } = useQuery({
    queryKey: ["security-events", days],
    queryFn: async () => {
      // Fetch login-related events
      const { data: events, error: eventsError } = await supabase
        .from("visitor_events")
        .select("*")
        .in("event_type", ["admin_login", "admin_login_failed", "admin_logout", "admin_signup"])
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(200);

      if (eventsError) throw eventsError;

      // Parse login attempts
      const loginAttempts: LoginAttempt[] = (events || [])
        .filter((e) => e.event_type === "admin_login" || e.event_type === "admin_login_failed")
        .map((e) => ({
          id: e.id,
          timestamp: e.created_at || new Date().toISOString(),
          email: (e.event_data as any)?.email || "Unknown",
          status: e.event_type === "admin_login" ? "success" : "failed",
          ip_address: (e.event_data as any)?.ip_address,
          user_agent: (e.event_data as any)?.user_agent,
        }));

      const successfulLogins = loginAttempts.filter((l) => l.status === "success").length;
      const failedLogins = loginAttempts.filter((l) => l.status === "failed").length;
      const totalLoginAttempts = loginAttempts.length;
      const failedLoginRate = totalLoginAttempts > 0 
        ? Math.round((failedLogins / totalLoginAttempts) * 100) 
        : 0;

      // Generate security alerts based on patterns
      const alerts: SecurityAlert[] = [];

      // Check for multiple failed logins
      const failedByEmail = new Map<string, number>();
      loginAttempts.filter((l) => l.status === "failed").forEach((l) => {
        failedByEmail.set(l.email, (failedByEmail.get(l.email) || 0) + 1);
      });

      failedByEmail.forEach((count, email) => {
        if (count >= 5) {
          alerts.push({
            id: `failed-${email}`,
            type: "failed_login",
            severity: count >= 10 ? "high" : "medium",
            message: `${count} failed login attempts for ${email}`,
            timestamp: new Date().toISOString(),
            metadata: { email, count },
          });
        }
      });

      // Check for high failed login rate
      if (failedLoginRate > 30 && totalLoginAttempts > 10) {
        alerts.push({
          id: "high-failure-rate",
          type: "suspicious_activity",
          severity: "high",
          message: `High failed login rate: ${failedLoginRate}%`,
          timestamp: new Date().toISOString(),
        });
      }

      // Build audit log from all events
      const auditLog: AuditLogEntry[] = (events || []).map((e) => ({
        id: e.id,
        action: e.event_type,
        user_email: (e.event_data as any)?.email,
        details: e.event_data as Record<string, any>,
        timestamp: e.created_at || new Date().toISOString(),
      }));

      // Recent activity summary
      const activityCounts = new Map<string, number>();
      events?.forEach((e) => {
        activityCounts.set(e.event_type, (activityCounts.get(e.event_type) || 0) + 1);
      });

      const recentActivity = Array.from(activityCounts.entries())
        .map(([action, count]) => ({ action, count }))
        .sort((a, b) => b.count - a.count);

      return {
        loginAttempts,
        totalLoginAttempts,
        successfulLogins,
        failedLogins,
        failedLoginRate,
        alerts,
        auditLog,
        recentActivity,
      };
    },
    staleTime: 30000,
  });

  return {
    loginAttempts: data?.loginAttempts || [],
    totalLoginAttempts: data?.totalLoginAttempts || 0,
    successfulLogins: data?.successfulLogins || 0,
    failedLogins: data?.failedLogins || 0,
    failedLoginRate: data?.failedLoginRate || 0,
    alerts: data?.alerts || [],
    auditLog: data?.auditLog || [],
    recentActivity: data?.recentActivity || [],
    loading: isLoading,
    error: error as Error | null,
  };
};
