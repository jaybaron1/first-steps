import React from "react";
import { LogOut, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface ExitPage {
  page_url: string;
  page_title?: string;
  exit_count: number;
  exit_rate: number;
  avg_exit_scroll?: number;
}

interface TopExitPagesCardProps {
  pages: ExitPage[];
  loading?: boolean;
}

const getDisplayName = (page: ExitPage): string => {
  if (page.page_title) return page.page_title;
  const path = page.page_url;
  if (path === "/" || path === "") return "Homepage";
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

const TopExitPagesCard: React.FC<TopExitPagesCardProps> = ({ pages, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const maxExits = Math.max(...pages.map((p) => p.exit_count), 1);

  return (
    <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-50 rounded-lg">
          <LogOut className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#1A1915]">Top Exit Pages</h3>
          <p className="text-sm text-[#8C857A]">Where visitors leave your site</p>
        </div>
      </div>

      <div className="space-y-4">
        {pages.length === 0 ? (
          <p className="text-sm text-[#8C857A] text-center py-4">No exit data available</p>
        ) : (
          pages.slice(0, 8).map((page, idx) => (
            <div key={page.page_url} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-xs font-medium text-[#8C857A] w-5">{idx + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[#1A1915] break-words whitespace-normal">
                      {getDisplayName(page)}
                    </span>
                    {page.avg_exit_scroll !== undefined && page.avg_exit_scroll > 0 && (
                      <p className="text-xs text-[#8C857A] mt-0.5">
                        Exited at ~{page.avg_exit_scroll}% scroll
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-[#1A1915]">
                    {page.exit_count}
                  </span>
                  <span className="text-xs text-[#8C857A] w-12 text-right">
                    {page.exit_rate}%
                  </span>
                </div>
              </div>
              <div className="ml-7">
                <Progress 
                  value={(page.exit_count / maxExits) * 100} 
                  className="h-1.5 bg-red-50"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {pages.length > 8 && (
        <button className="mt-4 flex items-center gap-1 text-sm text-[#B8956C] hover:text-[#9A7B58] transition-colors">
          View all exit pages <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default TopExitPagesCard;
