import React from "react";
import { FileText, Clock, MousePointer, TrendingDown, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface PageStats {
  page_url: string;
  page_title: string | null;
  total_views: number;
  unique_sessions: number;
  avg_time_on_page: number;
  avg_scroll_depth: number;
  bounce_rate: number;
  exit_rate: number;
}

interface ContentPerformanceTableProps {
  pages: PageStats[];
  loading?: boolean;
}

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const formatUrl = (url: string): string => {
  try {
    const parsed = new URL(url, "https://example.com");
    return parsed.pathname || "/";
  } catch {
    return url.replace(/^https?:\/\/[^/]+/, "") || "/";
  }
};

const ContentPerformanceTable: React.FC<ContentPerformanceTableProps> = ({
  pages,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#B8956C]/10">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#B8956C]/20 rounded-2xl overflow-hidden shadow-lg">
      <div className="p-6 border-b border-[#B8956C]/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F3EDE4] rounded-lg">
            <FileText className="w-5 h-5 text-[#B8956C]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1A1915]">Page Performance</h3>
            <p className="text-sm text-[#8C857A]">Engagement metrics by page</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#FDFBF7]">
              <TableHead className="font-semibold text-[#4A4640]">Page</TableHead>
              <TableHead className="font-semibold text-[#4A4640] text-center">
                <div className="flex items-center justify-center gap-1">
                  Views <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-[#4A4640] text-center">Sessions</TableHead>
              <TableHead className="font-semibold text-[#4A4640] text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Avg Time
                </div>
              </TableHead>
              <TableHead className="font-semibold text-[#4A4640] text-center">
                <div className="flex items-center justify-center gap-1">
                  <MousePointer className="w-3 h-3" /> Scroll
                </div>
              </TableHead>
              <TableHead className="font-semibold text-[#4A4640] text-center">Bounce</TableHead>
              <TableHead className="font-semibold text-[#4A4640] text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingDown className="w-3 h-3" /> Exit
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-[#8C857A]">
                  No page data available
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page, idx) => (
                <TableRow 
                  key={page.page_url} 
                  className="hover:bg-[#FDFBF7]/50 transition-colors"
                >
                  <TableCell className="max-w-[300px]">
                    <div className="space-y-1">
                      <p className="font-medium text-[#1A1915] truncate">
                        {page.page_title || formatUrl(page.page_url)}
                      </p>
                      <p className="text-xs text-[#8C857A] truncate font-mono">
                        {formatUrl(page.page_url)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-[#1A1915]">{page.total_views.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-[#4A4640]">{page.unique_sessions.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-[#F3EDE4] border-[#B8956C]/30 text-[#4A4640]">
                      {formatTime(page.avg_time_on_page)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Progress 
                        value={page.avg_scroll_depth} 
                        className="w-16 h-2 bg-[#F3EDE4]" 
                      />
                      <span className="text-sm text-[#4A4640] w-10">{page.avg_scroll_depth}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={
                        page.bounce_rate > 70 
                          ? "bg-red-50 border-red-200 text-red-700" 
                          : page.bounce_rate > 50 
                          ? "bg-amber-50 border-amber-200 text-amber-700"
                          : "bg-emerald-50 border-emerald-200 text-emerald-700"
                      }
                    >
                      {page.bounce_rate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-[#4A4640]">{page.exit_rate}%</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContentPerformanceTable;
