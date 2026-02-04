import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SEOCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  link?: string;
}

const TechnicalSEOPanel: React.FC = () => {
  const [checks, setChecks] = useState<SEOCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runChecks = async () => {
      const results: SEOCheck[] = [];

      // Check robots.txt
      try {
        const robotsRes = await fetch('/robots.txt');
        if (robotsRes.ok) {
          const text = await robotsRes.text();
          const hasSitemap = text.toLowerCase().includes('sitemap');
          results.push({
            name: 'robots.txt',
            status: 'pass',
            details: hasSitemap ? 'Present with sitemap reference' : 'Present but no sitemap reference',
            link: '/robots.txt',
          });
        } else {
          results.push({
            name: 'robots.txt',
            status: 'fail',
            details: 'Missing robots.txt file',
          });
        }
      } catch {
        results.push({
          name: 'robots.txt',
          status: 'fail',
          details: 'Could not fetch robots.txt',
        });
      }

      // Check sitemap.xml
      try {
        const sitemapRes = await fetch('/sitemap.xml');
        if (sitemapRes.ok) {
          const text = await sitemapRes.text();
          const urlCount = (text.match(/<url>/g) || []).length;
          results.push({
            name: 'sitemap.xml',
            status: 'pass',
            details: `Present with ${urlCount} URLs`,
            link: '/sitemap.xml',
          });
        } else {
          results.push({
            name: 'sitemap.xml',
            status: 'warning',
            details: 'Missing sitemap.xml file',
          });
        }
      } catch {
        results.push({
          name: 'sitemap.xml',
          status: 'warning',
          details: 'Could not fetch sitemap.xml',
        });
      }

      // Check meta viewport
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        const content = viewport.getAttribute('content') || '';
        const hasWidthDevice = content.includes('width=device-width');
        results.push({
          name: 'Viewport Meta',
          status: hasWidthDevice ? 'pass' : 'warning',
          details: hasWidthDevice ? 'Properly configured for mobile' : 'Missing width=device-width',
        });
      } else {
        results.push({
          name: 'Viewport Meta',
          status: 'fail',
          details: 'Missing viewport meta tag',
        });
      }

      // Check meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        const content = metaDesc.getAttribute('content') || '';
        const length = content.length;
        results.push({
          name: 'Meta Description',
          status: length >= 120 && length <= 160 ? 'pass' : 'warning',
          details: `${length} characters ${length < 120 ? '(too short)' : length > 160 ? '(too long)' : '(optimal)'}`,
        });
      } else {
        results.push({
          name: 'Meta Description',
          status: 'warning',
          details: 'Missing meta description',
        });
      }

      // Check canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      results.push({
        name: 'Canonical URL',
        status: canonical ? 'pass' : 'warning',
        details: canonical ? 'Canonical link present' : 'No canonical URL defined',
      });

      // Check Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogTags = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
      results.push({
        name: 'Open Graph Tags',
        status: ogTags === 3 ? 'pass' : ogTags > 0 ? 'warning' : 'fail',
        details: `${ogTags}/3 essential OG tags present`,
      });

      // Check structured data
      const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
      results.push({
        name: 'Structured Data',
        status: jsonLd.length > 0 ? 'pass' : 'warning',
        details: jsonLd.length > 0 ? `${jsonLd.length} JSON-LD blocks found` : 'No structured data found',
      });

      // Check HTTPS
      const isHttps = window.location.protocol === 'https:';
      results.push({
        name: 'HTTPS',
        status: isHttps ? 'pass' : 'fail',
        details: isHttps ? 'Site served over HTTPS' : 'Not using HTTPS',
      });

      // Check favicon
      const favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
      results.push({
        name: 'Favicon',
        status: favicon ? 'pass' : 'warning',
        details: favicon ? 'Favicon configured' : 'No favicon found',
      });

      // Check lang attribute
      const htmlLang = document.documentElement.lang;
      results.push({
        name: 'HTML Lang Attribute',
        status: htmlLang ? 'pass' : 'warning',
        details: htmlLang ? `Language set to "${htmlLang}"` : 'Missing lang attribute',
      });

      setChecks(results);
      setLoading(false);
    };

    runChecks();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const score = Math.round((passCount / checks.length) * 100);

  const StatusIcon = ({ status }: { status: 'pass' | 'fail' | 'warning' }) => {
    if (status === 'pass') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (status === 'fail') return <XCircle className="w-5 h-5 text-red-500" />;
    return <AlertCircle className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-3xl font-bold text-[#1A1915]">{score}%</p>
          <p className="text-sm text-[#8C857A]">Technical SEO Score</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{checks.filter((c) => c.status === 'pass').length} passed</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>{checks.filter((c) => c.status === 'warning').length} warnings</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span>{checks.filter((c) => c.status === 'fail').length} failed</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.name}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg border',
              check.status === 'pass' && 'bg-emerald-50/50 border-emerald-100',
              check.status === 'warning' && 'bg-amber-50/50 border-amber-100',
              check.status === 'fail' && 'bg-red-50/50 border-red-100'
            )}
          >
            <div className="flex items-center gap-3">
              <StatusIcon status={check.status} />
              <div>
                <p className="font-medium text-[#1A1915]">{check.name}</p>
                <p className="text-xs text-[#8C857A]">{check.details}</p>
              </div>
            </div>
            {check.link && (
              <a
                href={check.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B8956C] hover:text-[#9A7B58]"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalSEOPanel;
