import React from "react";
import { Activity, CheckCircle2, XCircle, Clock, Zap, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface UptimeMonitorProps {
  uptime: number;
  lastCheck: string | null;
  lastStatus: string | null;
  avgResponseTime: number;
  totalPings: number;
  successCount: number;
  failureCount: number;
  loading?: boolean;
}

const UptimeMonitor: React.FC<UptimeMonitorProps> = ({
  uptime,
  lastCheck,
  lastStatus,
  avgResponseTime,
  totalPings,
  successCount,
  failureCount,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const isHealthy = lastStatus === "success";
  const uptimeColor = uptime >= 99.5 ? "text-emerald-600" : uptime >= 95 ? "text-amber-600" : "text-red-600";
  const uptimeBg = uptime >= 99.5 ? "bg-emerald-50" : uptime >= 95 ? "bg-amber-50" : "bg-red-50";

  return (
    <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F3EDE4] rounded-lg">
            <Server className="w-5 h-5 text-[#B8956C]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1A1915]">System Status</h3>
            <p className="text-sm text-[#8C857A]">Keep-alive monitoring</p>
          </div>
        </div>

        <Badge 
          className={`px-3 py-1 ${isHealthy ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
        >
          <div className="flex items-center gap-1.5">
            {isHealthy ? (
              <>
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                Operational
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" />
                Issues Detected
              </>
            )}
          </div>
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Uptime */}
        <div className={`p-4 rounded-xl ${uptimeBg}`}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className={`w-4 h-4 ${uptimeColor}`} />
            <span className="text-xs font-medium text-[#8C857A]">Uptime</span>
          </div>
          <p className={`text-2xl font-bold ${uptimeColor}`}>{uptime}%</p>
          <p className="text-xs text-[#8C857A] mt-1">Last 24 hours</p>
        </div>

        {/* Avg Response Time */}
        <div className="p-4 rounded-xl bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-[#8C857A]">Avg Response</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{avgResponseTime}ms</p>
          <p className="text-xs text-[#8C857A] mt-1">Response time</p>
        </div>

        {/* Success/Failure */}
        <div className="p-4 rounded-xl bg-[#F3EDE4]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-[#8C857A]">Health Checks</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1915]">
            <span className="text-emerald-600">{successCount}</span>
            <span className="text-[#8C857A] text-base mx-1">/</span>
            <span className="text-red-600">{failureCount}</span>
          </p>
          <p className="text-xs text-[#8C857A] mt-1">Success / Failed</p>
        </div>

        {/* Last Check */}
        <div className="p-4 rounded-xl bg-[#FDFBF7]">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#B8956C]" />
            <span className="text-xs font-medium text-[#8C857A]">Last Check</span>
          </div>
          <p className="text-lg font-semibold text-[#1A1915]">
            {lastCheck ? formatDistanceToNow(new Date(lastCheck), { addSuffix: true }) : "Never"}
          </p>
          <p className="text-xs text-[#8C857A] mt-1">{totalPings} total pings</p>
        </div>
      </div>
    </div>
  );
};

export default UptimeMonitor;
