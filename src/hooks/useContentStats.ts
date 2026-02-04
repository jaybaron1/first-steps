import { useQuery } from "@tanstack/react-query";
import { adminSupabase as supabase } from "@/lib/adminBackend";

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

interface ContentStats {
  pages: PageStats[];
  topExitPages: { page_url: string; exit_count: number; exit_rate: number }[];
  summary: {
    totalPageViews: number;
    avgTimeOnPage: number;
    avgScrollDepth: number;
    overallBounceRate: number;
    mostViewedPage: string | null;
    mostEngagingPage: string | null;
    highestBounceRatePage: string | null;
  };
  loading: boolean;
  error: Error | null;
}

export const useContentStats = (days: number = 30): ContentStats => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, isLoading, error } = useQuery({
    queryKey: ["content-stats", days],
    queryFn: async () => {
      // Fetch all page views within the time range
      const { data: pageViews, error: pvError } = await supabase
        .from("page_views")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false });

      if (pvError) throw pvError;

      // Fetch session data to calculate bounces
      const { data: sessions, error: sessError } = await supabase
        .from("visitor_sessions")
        .select("session_id, page_views")
        .gte("created_at", startDate.toISOString());

      if (sessError) throw sessError;

      // Create a map of single-page sessions (bounces)
      const bounceSessionIds = new Set(
        sessions?.filter((s) => s.page_views === 1).map((s) => s.session_id) || []
      );

      // Aggregate by page URL
      const pageMap = new Map<string, {
        page_url: string;
        page_title: string | null;
        views: number;
        sessions: Set<string>;
        totalTime: number;
        totalScroll: number;
        bounces: number;
        viewsWithTime: number;
        viewsWithScroll: number;
      }>();

      pageViews?.forEach((pv) => {
        const key = pv.page_url;
        if (!pageMap.has(key)) {
          pageMap.set(key, {
            page_url: pv.page_url,
            page_title: pv.page_title,
            views: 0,
            sessions: new Set(),
            totalTime: 0,
            totalScroll: 0,
            bounces: 0,
            viewsWithTime: 0,
            viewsWithScroll: 0,
          });
        }
        const stats = pageMap.get(key)!;
        stats.views++;
        if (pv.session_id) {
          stats.sessions.add(pv.session_id);
          if (bounceSessionIds.has(pv.session_id)) {
            stats.bounces++;
          }
        }
        if (pv.time_on_page) {
          stats.totalTime += pv.time_on_page;
          stats.viewsWithTime++;
        }
        if (pv.scroll_depth) {
          stats.totalScroll += pv.scroll_depth;
          stats.viewsWithScroll++;
        }
      });

      // Calculate exit pages (last page view per session)
      const sessionLastPage = new Map<string, string>();
      const sortedByTime = [...(pageViews || [])].sort(
        (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      );
      sortedByTime.forEach((pv) => {
        if (pv.session_id) {
          sessionLastPage.set(pv.session_id, pv.page_url);
        }
      });

      const exitCounts = new Map<string, number>();
      sessionLastPage.forEach((pageUrl) => {
        exitCounts.set(pageUrl, (exitCounts.get(pageUrl) || 0) + 1);
      });

      // Build page stats array
      const pages: PageStats[] = Array.from(pageMap.values()).map((stats) => {
        const exitCount = exitCounts.get(stats.page_url) || 0;
        return {
          page_url: stats.page_url,
          page_title: stats.page_title,
          total_views: stats.views,
          unique_sessions: stats.sessions.size,
          avg_time_on_page: stats.viewsWithTime > 0 ? Math.round(stats.totalTime / stats.viewsWithTime) : 0,
          avg_scroll_depth: stats.viewsWithScroll > 0 ? Math.round(stats.totalScroll / stats.viewsWithScroll) : 0,
          bounce_rate: stats.sessions.size > 0 ? Math.round((stats.bounces / stats.sessions.size) * 100) : 0,
          exit_rate: stats.views > 0 ? Math.round((exitCount / stats.views) * 100) : 0,
        };
      }).sort((a, b) => b.total_views - a.total_views);

      // Top exit pages
      const topExitPages = Array.from(exitCounts.entries())
        .map(([page_url, exit_count]) => {
          const pageStats = pageMap.get(page_url);
          return {
            page_url,
            exit_count,
            exit_rate: pageStats ? Math.round((exit_count / pageStats.views) * 100) : 0,
          };
        })
        .sort((a, b) => b.exit_count - a.exit_count)
        .slice(0, 10);

      // Calculate summary
      const totalPageViews = pageViews?.length || 0;
      const allTimesOnPage = pageViews?.filter((pv) => pv.time_on_page).map((pv) => pv.time_on_page!) || [];
      const allScrollDepths = pageViews?.filter((pv) => pv.scroll_depth).map((pv) => pv.scroll_depth!) || [];
      
      const avgTimeOnPage = allTimesOnPage.length > 0 
        ? Math.round(allTimesOnPage.reduce((a, b) => a + b, 0) / allTimesOnPage.length) 
        : 0;
      const avgScrollDepth = allScrollDepths.length > 0 
        ? Math.round(allScrollDepths.reduce((a, b) => a + b, 0) / allScrollDepths.length) 
        : 0;

      const bounceSessions = sessions?.filter((s) => s.page_views === 1).length || 0;
      const totalSessions = sessions?.length || 0;
      const overallBounceRate = totalSessions > 0 ? Math.round((bounceSessions / totalSessions) * 100) : 0;

      // Find most engaging page (highest time + scroll combo)
      const engagementScores = pages.map((p) => ({
        page_url: p.page_url,
        score: (p.avg_time_on_page / 60) + (p.avg_scroll_depth / 10),
      })).sort((a, b) => b.score - a.score);

      const highestBounce = [...pages].sort((a, b) => b.bounce_rate - a.bounce_rate)[0];

      return {
        pages,
        topExitPages,
        summary: {
          totalPageViews,
          avgTimeOnPage,
          avgScrollDepth,
          overallBounceRate,
          mostViewedPage: pages[0]?.page_url || null,
          mostEngagingPage: engagementScores[0]?.page_url || null,
          highestBounceRatePage: highestBounce?.page_url || null,
        },
      };
    },
    staleTime: 60000,
  });

  return {
    pages: data?.pages || [],
    topExitPages: data?.topExitPages || [],
    summary: data?.summary || {
      totalPageViews: 0,
      avgTimeOnPage: 0,
      avgScrollDepth: 0,
      overallBounceRate: 0,
      mostViewedPage: null,
      mostEngagingPage: null,
      highestBounceRatePage: null,
    },
    loading: isLoading,
    error: error as Error | null,
  };
};
