import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  loading?: boolean;
  accentColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  loading = false,
  accentColor = "text-[#B8956C]",
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="w-3 h-3" />;
    if (trend.value < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.value > 0) return "text-emerald-600";
    if (trend.value < 0) return "text-red-600";
    return "text-[#8C857A]";
  };

  return (
    <div
      className="bg-white border border-[#B8956C]/20 rounded-xl p-6
  hover:border-[#B8956C]/40 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-lg bg-[#F3EDE4]", accentColor)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", getTrendColor())}>
            {getTrendIcon()}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-24 bg-[#F3EDE4] rounded animate-pulse" />
          <div className="h-4 w-32 bg-[#F3EDE4] rounded animate-pulse" />
        </div>
      ) : (
        <>
          <p
            className="text-3xl font-semibold text-[#1A1915] mb-1
  tabular-nums"
          >
            {value}
          </p>
          <p className="text-sm text-[#8C857A] font-medium">{label}</p>
          {trend && <p className="text-xs text-[#8C857A] mt-1.5">{trend.label}</p>}
        </>
      )}
    </div>
  );
};

export default StatsCard;
