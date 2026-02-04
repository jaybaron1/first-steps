import React from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface HealthLog {
  id: string;
  executed_at: string;
  status: string;
  response_time_ms: number | null;
}

interface ResponseTimeChartProps {
  logs: HealthLog[];
  loading?: boolean;
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ logs, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
        <Skeleton className="h-6 w-48 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Prepare data for chart (reverse to show oldest first)
  const chartData = [...logs]
    .filter((l) => l.response_time_ms !== null)
    .reverse()
    .slice(-50) // Last 50 data points
    .map((l) => ({
      time: format(new Date(l.executed_at), "HH:mm"),
      fullTime: format(new Date(l.executed_at), "MMM d, HH:mm"),
      responseTime: l.response_time_ms,
      status: l.status,
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-[#B8956C]/20 rounded-lg p-3 shadow-lg">
          <p className="text-xs text-[#8C857A] mb-1">{data.fullTime}</p>
          <p className="text-sm font-semibold text-[#1A1915]">
            {data.responseTime}ms
          </p>
          <p className={`text-xs ${data.status === "success" ? "text-emerald-600" : "text-red-600"}`}>
            {data.status}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#F3EDE4] rounded-lg">
          <TrendingUp className="w-5 h-5 text-[#B8956C]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#1A1915]">Response Time Trend</h3>
          <p className="text-sm text-[#8C857A]">Last 50 health checks</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-[#8C857A]">
          No response time data available
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E1DB" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 11, fill: "#8C857A" }}
                tickLine={{ stroke: "#E5E1DB" }}
                axisLine={{ stroke: "#E5E1DB" }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "#8C857A" }}
                tickLine={{ stroke: "#E5E1DB" }}
                axisLine={{ stroke: "#E5E1DB" }}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Warning threshold line (2000ms) */}
              <ReferenceLine 
                y={2000} 
                stroke="#f59e0b" 
                strokeDasharray="5 5" 
                label={{ value: "Warning", position: "right", fill: "#f59e0b", fontSize: 10 }}
              />
              
              {/* Critical threshold line (5000ms) */}
              <ReferenceLine 
                y={5000} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                label={{ value: "Critical", position: "right", fill: "#ef4444", fontSize: 10 }}
              />
              
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#B8956C"
                strokeWidth={2}
                dot={{ fill: "#B8956C", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "#B8956C" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#B8956C]/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-[#B8956C]" />
          <span className="text-xs text-[#8C857A]">Response Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-amber-500 border-dashed" style={{ borderTopWidth: 2, borderStyle: "dashed" }} />
          <span className="text-xs text-[#8C857A]">Warning (2s)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-500" style={{ borderTopWidth: 2, borderStyle: "dashed" }} />
          <span className="text-xs text-[#8C857A]">Critical (5s)</span>
        </div>
      </div>
    </div>
  );
};

export default ResponseTimeChart;
