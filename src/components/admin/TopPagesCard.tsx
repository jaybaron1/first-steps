  import React, { useEffect, useState } from 'react';
  import { FileText, TrendingUp, ExternalLink } from 'lucide-react';            
  import { adminSupabase } from '@/lib/adminBackend';                           
  import { cn } from '@/lib/utils';                                             
   
  interface PageView {                                                          
    page_url: string;                                                           
    page_title: string | null;
    view_count: number;
    unique_visitors: number;
    avg_time_on_page: number;
  }

  interface TopPagesCardProps {
    maxPages?: number;
    timeRange?: '24h' | '7d' | '30d';
  }

  const TopPagesCard: React.FC<TopPagesCardProps> = ({
    maxPages = 8,
    timeRange = '7d'
  }) => {
    const [pages, setPages] = useState<PageView[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchTopPages();

      // Subscribe to real-time updates
      const channel = adminSupabase
        .channel('top-pages-updates')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'page_views' },
          () => fetchTopPages()
        )
        .subscribe();

      return () => {
        adminSupabase.removeChannel(channel);
      };
    }, [timeRange]);

    const fetchTopPages = async () => {
      try {
        const timeFilter = getTimeFilter();

        const { data, error } = await adminSupabase
          .from('page_views')
          .select('page_url, page_title, time_on_page')
          .gte('created_at', timeFilter)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Aggregate data
        const pageMap = new Map<string, PageView>();

        data?.forEach((view) => {
          const existing = pageMap.get(view.page_url);
          if (existing) {
            existing.view_count++;
            existing.unique_visitors++;
            existing.avg_time_on_page += view.time_on_page || 0;
          } else {
            pageMap.set(view.page_url, {
              page_url: view.page_url,
              page_title: view.page_title,
              view_count: 1,
              unique_visitors: 1,
              avg_time_on_page: view.time_on_page || 0,
            });
          }
        });

        // Calculate averages and sort
        const aggregated = Array.from(pageMap.values())
          .map(page => ({
            ...page,
            avg_time_on_page: page.avg_time_on_page / page.view_count,
          }))
          .sort((a, b) => b.view_count - a.view_count)
          .slice(0, maxPages);

        setPages(aggregated);
      } catch (error) {
        console.error('Error fetching top pages:', error);
      } finally {
        setLoading(false);
      }
    };

    const getTimeFilter = () => {
      const now = new Date();
      switch (timeRange) {
        case '24h':
          return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        case '7d':
          return new Date(now.getTime() - 7 * 24 * 60 * 60 *
  1000).toISOString();
        case '30d':
          return new Date(now.getTime() - 30 * 24 * 60 * 60 *
  1000).toISOString();
        default:
          return new Date(now.getTime() - 7 * 24 * 60 * 60 *
  1000).toISOString();
      }
    };

    const formatPageUrl = (url: string) => {
      try {
        const path = new URL(url).pathname;
        return path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, ' / ');
      } catch {
        return url;
      }
    };

    const formatTime = (seconds: number) => {
      if (seconds < 60) return `${Math.round(seconds)}s`;
      const minutes = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${minutes}m ${secs}s`;
    };

    const maxViews = pages[0]?.view_count || 1;

    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#F9F6F0]
  rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-[#F3EDE4] rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-[#F3EDE4] rounded" />
                <div className="h-3 w-1/2 bg-[#F3EDE4] rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (pages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12
  text-center">
          <div className="w-12 h-12 rounded-full bg-[#F3EDE4] flex items-center
  justify-center mb-3">
            <FileText className="w-6 h-6 text-[#B8956C]" />
          </div>
          <p className="text-sm text-[#8C857A]">No page views yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {pages.map((page, index) => {
          const percentage = (page.view_count / maxViews) * 100;
          const isTopPage = index === 0;

          return (
            <div
              key={page.page_url}
              className={cn(
                "relative group rounded-lg p-3 transition-all duration-200",
                "bg-[#F9F6F0] hover:bg-[#F3EDE4] hover:shadow-sm",
                "border border-transparent hover:border-[#B8956C]/30"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Rank Badge */}
                <div className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold",
                  isTopPage
                    ? "bg-[#B8956C] text-white"
                    : "bg-white border border-[#B8956C]/20 text-[#8C857A]"
                )}>
                  {index + 1}
                </div>

                {/* Page Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[#1A1915] truncate
   capitalize">
                        {page.page_title || formatPageUrl(page.page_url)}
                      </h4>
                      <p className="text-xs text-[#8C857A] truncate mt-0.5">
                        {page.page_url}
                      </p>
                    </div>

                    {/* View Count */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 text-[#B8956C]" />
                      <span className="text-sm font-semibold text-[#1A1915]
  tabular-nums">
                        {page.view_count.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-1.5 bg-white rounded-full
  overflow-hidden mb-2">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r
  from-[#B8956C] to-[#D4B896] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-xs
  text-[#8C857A]">
                    <span className="flex items-center gap-1">
                      <span className="font-medium
  text-[#1A1915]">{page.unique_visitors}</span>
                      <span>unique</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium
  text-[#1A1915]">{formatTime(page.avg_time_on_page)}</span>
                      <span>avg time</span>
                    </span>
                  </div>
                </div>

                {/* External Link Icon */}
                <a
                  href={page.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-7 h-7 rounded-md bg-white border
  border-[#B8956C]/20 flex items-center justify-center opacity-0
  group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B8956C]" />
                </a>
              </div>

              {/* Top Page Badge */}
              {isTopPage && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#B8956C]
  text-white text-[10px] font-semibold uppercase tracking-wide rounded-full">
                  Top Page
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  export default TopPagesCard;