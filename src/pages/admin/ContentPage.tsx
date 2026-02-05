import React, { useState } from "react";
import { FileText, Eye, Clock, MousePointer, TrendingDown, BarChart3 } from "lucide-react";
import { useContentStats } from "@/hooks/useContentStats";
import ContentPerformanceTable from "@/components/admin/ContentPerformanceTable";
import TopExitPagesCard from "@/components/admin/TopExitPagesCard";
import StatsCard from "@/components/admin/StatsCard";

const ContentPage: React.FC = () => {
  const [days, setDays] = useState(30);
  const { pages, topExitPages, summary, loading } = useContentStats(days);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[#1A1915]">
            Content Performance
          </h1>
          <p className="text-sm text-[#8C857A] mt-1">
            Analyze page engagement and identify optimization opportunities
          </p>
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-[#B8956C]/20 bg-white text-sm text-[#4A4640] focus:outline-none focus:ring-2 focus:ring-[#B8956C]/30"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Page Views"
          value={summary.totalPageViews.toLocaleString()}
          icon={Eye}
          loading={loading}
        />
        <StatsCard
          label="Avg Time on Page"
          value={formatTime(summary.avgTimeOnPage)}
          icon={Clock}
          loading={loading}
        />
        <StatsCard
          label="Avg Scroll Depth"
          value={`${summary.avgScrollDepth}%`}
          icon={MousePointer}
          loading={loading}
        />
        <StatsCard
          label="Bounce Rate"
          value={`${summary.overallBounceRate}%`}
          icon={TrendingDown}
          loading={loading}
          accentColor={
            summary.overallBounceRate > 70
              ? "text-red-600"
              : summary.overallBounceRate > 50
              ? "text-amber-600"
              : "text-emerald-600"
          }
        />
      </div>

      {/* Engagement Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg overflow-hidden min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#8C857A]">Most Viewed</p>
              <p className="text-sm font-semibold text-[#1A1915] break-words whitespace-normal leading-tight">
                {summary.mostViewedPage ? summary.mostViewedPage.replace(/^https?:\/\/[^/]+/, "") || "/" : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg overflow-hidden min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#8C857A]">Most Engaging</p>
              <p className="text-sm font-semibold text-[#1A1915] break-words whitespace-normal leading-tight">
                {summary.mostEngagingPage ? summary.mostEngagingPage.replace(/^https?:\/\/[^/]+/, "") || "/" : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg overflow-hidden min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#8C857A]">Highest Bounce</p>
              <p className="text-sm font-semibold text-[#1A1915] break-words whitespace-normal leading-tight">
                {summary.highestBounceRatePage ? summary.highestBounceRatePage.replace(/^https?:\/\/[^/]+/, "") || "/" : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ContentPerformanceTable pages={pages} loading={loading} />
        </div>
        <div>
          <TopExitPagesCard pages={topExitPages} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
