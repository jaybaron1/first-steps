import React, { useState } from "react";
import { Server, Activity, AlertTriangle, Clock, Zap } from "lucide-react";
import { useSystemHealth } from "@/hooks/useSystemHealth";
import UptimeMonitor from "@/components/admin/UptimeMonitor";
import ResponseTimeChart from "@/components/admin/ResponseTimeChart";
import StatsCard from "@/components/admin/StatsCard";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const SystemPage: React.FC = () => {
  const [hours, setHours] = useState(24);
  const {
    logs,
    uptime,
    avgResponseTime,
    minResponseTime,
    maxResponseTime,
    totalPings,
    successCount,
    failureCount,
    lastCheck,
    lastStatus,
    alerts,
    loading,
  } = useSystemHealth(hours);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[#1A1915]">
            System Health
          </h1>
          <p className="text-sm text-[#8C857A] mt-1">
            Monitor uptime, response times, and system performance
          </p>
        </div>

        <select
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-[#B8956C]/20 bg-white text-sm text-[#4A4640] focus:outline-none focus:ring-2 focus:ring-[#B8956C]/30"
        >
          <option value={6}>Last 6 hours</option>
          <option value={12}>Last 12 hours</option>
          <option value={24}>Last 24 hours</option>
          <option value={48}>Last 48 hours</option>
          <option value={168}>Last 7 days</option>
        </select>
      </div>

      {/* Uptime Monitor */}
      <UptimeMonitor
        uptime={uptime}
        lastCheck={lastCheck}
        lastStatus={lastStatus}
        avgResponseTime={avgResponseTime}
        totalPings={totalPings}
        successCount={successCount}
        failureCount={failureCount}
        loading={loading}
      />

      {/* Response Time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          label="Avg Response"
          value={`${avgResponseTime}ms`}
          icon={Zap}
          loading={loading}
        />
        <StatsCard
          label="Min Response"
          value={`${minResponseTime}ms`}
          icon={Activity}
          loading={loading}
          accentColor="text-emerald-600"
        />
        <StatsCard
          label="Max Response"
          value={`${maxResponseTime}ms`}
          icon={Clock}
          loading={loading}
          accentColor={maxResponseTime > 5000 ? "text-red-600" : maxResponseTime > 2000 ? "text-amber-600" : "text-[#B8956C]"}
        />
        <StatsCard
          label="Total Checks"
          value={totalPings.toLocaleString()}
          icon={Server}
          loading={loading}
        />
      </div>

      {/* Response Time Chart */}
      <ResponseTimeChart logs={logs} loading={loading} />

      {/* System Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1A1915]">System Alerts</h3>
              <p className="text-sm text-[#8C857A]">Performance issues detected</p>
            </div>
            <Badge className="ml-auto bg-amber-100 text-amber-700 border-0">
              {alerts.length} Alert{alerts.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  alert.type === "critical"
                    ? "bg-red-50 border-red-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        alert.type === "critical" ? "text-red-600" : "text-amber-600"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        alert.type === "critical" ? "text-red-700" : "text-amber-700"
                      }`}
                    >
                      {alert.message}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        alert.type === "critical"
                          ? "border-red-300 text-red-700"
                          : "border-amber-300 text-amber-700"
                      }
                    >
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-[#8C857A]">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemPage;
