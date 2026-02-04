import { useQuery } from "@tanstack/react-query";
import { adminSupabase as supabase } from "@/lib/adminBackend";

interface HealthLog {
  id: string;
  executed_at: string;
  status: string;
  response_time_ms: number | null;
}

interface SystemHealthStats {
  logs: HealthLog[];
  uptime: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  totalPings: number;
  successCount: number;
  failureCount: number;
  lastCheck: string | null;
  lastStatus: string | null;
  alerts: { type: "warning" | "critical"; message: string; timestamp: string }[];
  loading: boolean;
  error: Error | null;
}

export const useSystemHealth = (hours: number = 24): SystemHealthStats => {
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - hours);

  const { data, isLoading, error } = useQuery({
    queryKey: ["system-health", hours],
    queryFn: async () => {
      const { data: logs, error: logsError } = await supabase
        .from("keep_alive_logs")
        .select("*")
        .gte("executed_at", startDate.toISOString())
        .order("executed_at", { ascending: false })
        .limit(500);

      if (logsError) throw logsError;

      const successLogs = logs?.filter((l) => l.status === "success") || [];
      const failureLogs = logs?.filter((l) => l.status !== "success") || [];
      
      const responseTimes = logs
        ?.filter((l) => l.response_time_ms !== null)
        .map((l) => l.response_time_ms!) || [];

      const avgResponseTime = responseTimes.length > 0
        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
        : 0;

      const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
      const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

      const totalPings = logs?.length || 0;
      const uptime = totalPings > 0 ? Math.round((successLogs.length / totalPings) * 100 * 100) / 100 : 100;

      // Generate alerts
      const alerts: { type: "warning" | "critical"; message: string; timestamp: string }[] = [];

      // Check for recent failures
      const recentFailures = failureLogs.slice(0, 5);
      recentFailures.forEach((f) => {
        alerts.push({
          type: "critical",
          message: `Health check failed: ${f.status}`,
          timestamp: f.executed_at,
        });
      });

      // Check for slow response times (>2000ms warning, >5000ms critical)
      const slowLogs = logs?.filter((l) => l.response_time_ms && l.response_time_ms > 2000) || [];
      slowLogs.slice(0, 3).forEach((l) => {
        const isCritical = l.response_time_ms && l.response_time_ms > 5000;
        alerts.push({
          type: isCritical ? "critical" : "warning",
          message: `Slow response: ${l.response_time_ms}ms`,
          timestamp: l.executed_at,
        });
      });

      // Check uptime threshold
      if (uptime < 99 && uptime >= 95) {
        alerts.push({
          type: "warning",
          message: `Uptime below 99%: ${uptime}%`,
          timestamp: new Date().toISOString(),
        });
      } else if (uptime < 95) {
        alerts.push({
          type: "critical",
          message: `Uptime critically low: ${uptime}%`,
          timestamp: new Date().toISOString(),
        });
      }

      return {
        logs: logs || [],
        uptime,
        avgResponseTime,
        minResponseTime,
        maxResponseTime,
        totalPings,
        successCount: successLogs.length,
        failureCount: failureLogs.length,
        lastCheck: logs?.[0]?.executed_at || null,
        lastStatus: logs?.[0]?.status || null,
        alerts: alerts.slice(0, 10),
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });

  return {
    logs: data?.logs || [],
    uptime: data?.uptime || 100,
    avgResponseTime: data?.avgResponseTime || 0,
    minResponseTime: data?.minResponseTime || 0,
    maxResponseTime: data?.maxResponseTime || 0,
    totalPings: data?.totalPings || 0,
    successCount: data?.successCount || 0,
    failureCount: data?.failureCount || 0,
    lastCheck: data?.lastCheck || null,
    lastStatus: data?.lastStatus || null,
    alerts: data?.alerts || [],
    loading: isLoading,
    error: error as Error | null,
  };
};
