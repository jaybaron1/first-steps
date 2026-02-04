import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { FileText, TrendingUp } from 'lucide-react';

interface PageStats {
  page_url: string;
  views: number;
  percentage: number;
}

const TopPagesCard: React.FC = () => {
  const [pages, setPages] = useState<PageStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPages = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('page_views')
        .select('page_url')
        .gte('created_at', today.toISOString());

      if (!error && data) {
        // Count page views
        const counts: Record<string, number> = {};
        data.forEach((pv) => {
          counts[pv.page_url] = (counts[pv.page_url] || 0) + 1;
        });

        const total = data.length;
        const sorted = Object.entries(counts)
          .map(([page_url, views]) => ({
            page_url,
            views,
            percentage: total > 0 ? Math.round((views / total) * 100) : 0,
          }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        setPages(sorted);
      }
      setLoading(false);
    };

    fetchTopPages();
  }, []);

  const formatPageUrl = (url: string) => {
    if (url === '/') return 'Homepage';
    return url.replace(/^\//, '').replace(/-/g, ' ');
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-6 h-6 rounded bg-[hsl(var(--admin-border))]" />
            <div className="flex-1 h-4 bg-[hsl(var(--admin-border))] rounded" />
            <div className="w-12 h-4 bg-[hsl(var(--admin-border))] rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-[hsl(var(--admin-text-subtle))]">
        <FileText className="w-8 h-8 mb-2 opacity-30" />
        <p className="text-sm">No page views today</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pages.map((page, index) => (
        <div key={page.page_url} className="flex items-center gap-3">
          <span className="w-6 h-6 rounded bg-[hsl(var(--admin-bg-card))] flex items-center justify-center text-xs font-medium text-[hsl(var(--admin-text-muted))]">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[hsl(var(--admin-text))] truncate capitalize">
              {formatPageUrl(page.page_url)}
            </p>
            <div className="mt-1 h-1.5 bg-[hsl(var(--admin-bg-card))] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B8956C] rounded-full transition-all duration-500"
                style={{ width: `${page.percentage}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-[hsl(var(--admin-text))] tabular-nums">
              {page.views}
            </p>
            <p className="text-xs text-[hsl(var(--admin-text-subtle))]">
              {page.percentage}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopPagesCard;
