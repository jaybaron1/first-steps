import React, { useState } from "react";
 import { Eye, Clock, TrendingDown, Lightbulb, Target, MousePointer } from "lucide-react";
import { useContentStats } from "@/hooks/useContentStats";
import TopExitPagesCard from "@/components/admin/TopExitPagesCard";
import StatsCard from "@/components/admin/StatsCard";
 import SectionEngagementTable from "@/components/admin/SectionEngagementTable";
 import SectionFlowCard from "@/components/admin/SectionFlowCard";
 import { useSectionStats } from "@/hooks/useSectionStats";

// Get friendly page name from URL or title
const getDisplayName = (pageUrl: string | null): string => {
  if (!pageUrl) return "—";
  // If it's already a friendly name (no slashes except leading), return as-is
  if (!pageUrl.startsWith("/") && !pageUrl.startsWith("http")) return pageUrl;
  
  // Normalize: strip query strings and protocol
  let path = pageUrl;
  try {
    const parsed = new URL(pageUrl, "https://example.com");
    path = parsed.pathname || "/";
  } catch {
    path = pageUrl.split(/[?#]/)[0] || "/";
  }
  
  if (path === "/" || path === "") return "Homepage";
  
  // Convert /about -> About, /examples -> Examples
  return path
    .replace(/^\//, "")
    .split("/")
    .map(segment => 
      segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(" / ");
};

const ContentPage: React.FC = () => {
  const [days, setDays] = useState(30);
   const { topExitPages, summary, loading } = useContentStats(days);
   const { sections, flow, summary: sectionSummary, loading: sectionsLoading } = useSectionStats(days);

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
             <div className="p-2 bg-[#B8956C]/10 rounded-lg flex-shrink-0">
               <Target className="w-5 h-5 text-[#B8956C]" />
            </div>
            <div className="min-w-0 flex-1">
               <p className="text-sm font-medium text-[#8C857A]">Most Engaging Section</p>
              <p className="text-sm font-semibold text-[#1A1915] break-words whitespace-normal leading-tight">
                 {sectionSummary.mostEngaging 
                   ? `${sectionSummary.mostEngaging.section} (${formatTime(sectionSummary.mostEngaging.avgFocus)} avg)`
                   : "—"}
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
               <p className="text-sm font-medium text-[#8C857A]">Drop-off Point</p>
              <p className="text-sm font-semibold text-[#1A1915] break-words whitespace-normal leading-tight">
                 {sectionSummary.dropOffPoint 
                   ? `After ${sectionSummary.dropOffPoint.section} (${sectionSummary.dropOffPoint.rate}% leave)`
                   : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg overflow-hidden min-w-0">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
               <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
               <p className="text-sm font-medium text-[#8C857A]">Hidden Gem</p>
              <p className="text-sm font-semibold text-[#1A1915] break-words whitespace-normal leading-tight">
                 {sectionSummary.hiddenGem 
                   ? `${sectionSummary.hiddenGem.section} (${sectionSummary.hiddenGem.impressions} views, ${formatTime(sectionSummary.hiddenGem.avgFocus)} focus)`
                   : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

       {/* Section Flow Visualization */}
       <SectionFlowCard flow={flow} loading={sectionsLoading} />
 
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <SectionEngagementTable sections={sections} loading={sectionsLoading} />
        </div>
        <div>
          <TopExitPagesCard pages={topExitPages} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
