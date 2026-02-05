import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink, Info, Wrench, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface SEOCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  link?: string;
  whatItChecks: string;
  whyItMatters: string;
  howToFix: string;
  currentValue?: string;
}

const TechnicalSEOPanel: React.FC = () => {
  const [checks, setChecks] = useState<SEOCheck[]>([]);
  const [loading, setLoading] = useState(true);

  const runChecks = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }
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
          whatItChecks: 'Fetches /robots.txt and verifies it exists. Also checks if a Sitemap directive is included.',
          whyItMatters: 'robots.txt controls which pages search engine crawlers can access. A sitemap reference helps crawlers discover all your pages efficiently.',
          howToFix: 'Create or update public/robots.txt. Add a Sitemap: directive pointing to your sitemap.xml URL.',
          currentValue: text.length > 500 ? text.substring(0, 500) + '...' : text,
        });
      } else {
        results.push({
          name: 'robots.txt',
          status: 'fail',
          details: 'Missing robots.txt file',
          whatItChecks: 'Fetches /robots.txt and verifies it exists.',
          whyItMatters: 'Without robots.txt, search engines may crawl pages you want hidden, or miss important directives.',
          howToFix: 'Create public/robots.txt with appropriate crawl directives and a Sitemap reference.',
        });
      }
    } catch {
      results.push({
        name: 'robots.txt',
        status: 'fail',
        details: 'Could not fetch robots.txt',
        whatItChecks: 'Fetches /robots.txt and verifies it exists.',
        whyItMatters: 'Without robots.txt, search engines may crawl pages you want hidden.',
        howToFix: 'Create public/robots.txt with appropriate crawl directives.',
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
          whatItChecks: 'Fetches /sitemap.xml and counts the number of <url> entries.',
          whyItMatters: 'Sitemaps help search engines discover all pages on your site, especially new or deeply nested content.',
          howToFix: 'Ensure public/sitemap.xml includes all important page URLs with proper lastmod dates.',
          currentValue: `${urlCount} URLs found in sitemap`,
        });
      } else {
        results.push({
          name: 'sitemap.xml',
          status: 'warning',
          details: 'Missing sitemap.xml file',
          whatItChecks: 'Fetches /sitemap.xml and verifies it exists.',
          whyItMatters: 'Without a sitemap, search engines rely solely on crawling links, potentially missing important pages.',
          howToFix: 'Create public/sitemap.xml listing all public page URLs.',
        });
      }
    } catch {
      results.push({
        name: 'sitemap.xml',
        status: 'warning',
        details: 'Could not fetch sitemap.xml',
        whatItChecks: 'Fetches /sitemap.xml and verifies it exists.',
        whyItMatters: 'Without a sitemap, search engines may miss important pages.',
        howToFix: 'Create public/sitemap.xml listing all public page URLs.',
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
        whatItChecks: 'Looks for <meta name="viewport"> and verifies it includes width=device-width.',
        whyItMatters: 'Mobile-friendliness is a Google ranking factor. Proper viewport ensures your site renders correctly on all devices.',
        howToFix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> in index.html.',
        currentValue: content,
      });
    } else {
      results.push({
        name: 'Viewport Meta',
        status: 'fail',
        details: 'Missing viewport meta tag',
        whatItChecks: 'Looks for <meta name="viewport"> tag in the document head.',
        whyItMatters: 'Without viewport meta, mobile devices may render at desktop width, harming user experience and rankings.',
        howToFix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> in index.html.',
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
        whatItChecks: 'Checks for <meta name="description"> and validates the content is between 120-160 characters.',
        whyItMatters: 'Meta descriptions appear in search results and affect click-through rates. Optimal length ensures no truncation.',
        howToFix: 'Update the meta description in SEOHead component to be 120-160 characters.',
        currentValue: content,
      });
    } else {
      results.push({
        name: 'Meta Description',
        status: 'warning',
        details: 'Missing meta description',
        whatItChecks: 'Checks for <meta name="description"> tag.',
        whyItMatters: 'Without a meta description, search engines generate one from page content, which may not be optimal.',
        howToFix: 'Add a meta description in the SEOHead component for each page.',
      });
    }

    // Check canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    const canonicalHref = canonical?.getAttribute('href') || '';
    results.push({
      name: 'Canonical URL',
      status: canonical ? 'pass' : 'warning',
      details: canonical ? 'Canonical link present' : 'No canonical URL defined',
      whatItChecks: 'Checks for <link rel="canonical"> pointing to the preferred URL version.',
      whyItMatters: 'Canonical URLs prevent duplicate content issues when the same page is accessible via multiple URLs.',
      howToFix: 'Add <link rel="canonical" href="..."> in SEOHead, pointing to the primary page URL.',
      currentValue: canonicalHref || 'Not set',
    });

    // Check Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogTagsPresent = [
      ogTitle ? `og:title: "${ogTitle.getAttribute('content')}"` : null,
      ogDesc ? `og:description: "${ogDesc.getAttribute('content')?.substring(0, 50)}..."` : null,
      ogImage ? `og:image: ${ogImage.getAttribute('content')}` : null,
    ].filter(Boolean);
    const ogTags = ogTagsPresent.length;
    results.push({
      name: 'Open Graph Tags',
      status: ogTags === 3 ? 'pass' : ogTags > 0 ? 'warning' : 'fail',
      details: `${ogTags}/3 essential OG tags present`,
      whatItChecks: 'Checks for og:title, og:description, and og:image meta tags.',
      whyItMatters: 'Open Graph tags control how your pages appear when shared on social media platforms like Facebook and LinkedIn.',
      howToFix: 'Add all three OG tags in SEOHead: og:title, og:description, and og:image.',
      currentValue: ogTagsPresent.length > 0 ? ogTagsPresent.join('\n') : 'No OG tags found',
    });

    // Check structured data
    const getStructuredData = () => {
      const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
      return jsonLd;
    };
    
    // Wait a moment for react-helmet-async to inject structured data
    await new Promise(resolve => setTimeout(resolve, 500));
    const jsonLdScripts = getStructuredData();
    const jsonLdCount = jsonLdScripts.length;
    const schemaTypes: string[] = [];
    jsonLdScripts.forEach((script) => {
      try {
        const data = JSON.parse(script.textContent || '');
        if (data['@type']) schemaTypes.push(data['@type']);
      } catch {}
    });
    results.push({
      name: 'Structured Data',
      status: jsonLdCount > 0 ? 'pass' : 'warning',
      details: jsonLdCount > 0 ? `${jsonLdCount} JSON-LD blocks found` : 'No structured data found',
      whatItChecks: 'Counts JSON-LD script blocks (schema.org structured data) on the page.',
      whyItMatters: 'Structured data enables rich snippets in search results (reviews, FAQs, breadcrumbs, etc.).',
      howToFix: 'Add schema.org markup using OrganizationSchema, FAQSchema, or other relevant schema components.',
      currentValue: schemaTypes.length > 0 ? `Schema types: ${schemaTypes.join(', ')}` : 'No schemas detected',
    });

    // Check HTTPS
    const isHttps = window.location.protocol === 'https:';
    results.push({
      name: 'HTTPS',
      status: isHttps ? 'pass' : 'fail',
      details: isHttps ? 'Site served over HTTPS' : 'Not using HTTPS',
      whatItChecks: 'Verifies the page is served over HTTPS (secure connection).',
      whyItMatters: 'HTTPS is a ranking factor and required for security. Chrome marks HTTP sites as "Not Secure".',
      howToFix: 'Deploy on an HTTPS-enabled host. Lovable automatically provides HTTPS.',
      currentValue: window.location.protocol,
    });

    // Check favicon
    const favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
    const faviconHref = favicon?.getAttribute('href') || '';
    results.push({
      name: 'Favicon',
      status: favicon ? 'pass' : 'warning',
      details: favicon ? 'Favicon configured' : 'No favicon found',
      whatItChecks: 'Looks for <link rel="icon"> or <link rel="shortcut icon"> in the document head.',
      whyItMatters: 'Favicons appear in browser tabs, bookmarks, and search results, reinforcing brand recognition.',
      howToFix: 'Add <link rel="icon" href="/favicon.ico"> in index.html.',
      currentValue: faviconHref || 'Not set',
    });

    // Check lang attribute
    const htmlLang = document.documentElement.lang;
    results.push({
      name: 'HTML Lang Attribute',
      status: htmlLang ? 'pass' : 'warning',
      details: htmlLang ? `Language set to "${htmlLang}"` : 'Missing lang attribute',
      whatItChecks: 'Checks the <html lang="..."> attribute on the document root.',
      whyItMatters: 'The lang attribute helps search engines and screen readers understand the page language.',
      howToFix: 'Set lang="en" (or appropriate language code) on the <html> element in index.html.',
      currentValue: htmlLang || 'Not set',
    });

    setChecks(results);
    setLoading(false);
  };

  useEffect(() => {
    runChecks(true);
    
    // Re-run checks periodically for real-time updates
    const interval = setInterval(() => runChecks(false), 30000);
    return () => clearInterval(interval);
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

      <Accordion type="multiple" className="space-y-2">
        {checks.map((check) => (
          <AccordionItem
            key={check.name}
            value={check.name}
            className={cn(
              'rounded-lg border px-3',
              check.status === 'pass' && 'bg-emerald-50/50 border-emerald-100',
              check.status === 'warning' && 'bg-amber-50/50 border-amber-100',
              check.status === 'fail' && 'bg-red-50/50 border-red-100'
            )}
          >
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center justify-between w-full pr-2">
                <div className="flex items-center gap-3">
                  <StatusIcon status={check.status} />
                  <div className="text-left">
                    <p className="font-medium text-[#1A1915]">{check.name}</p>
                    <p className="text-xs text-[#8C857A]">{check.details}</p>
                  </div>
                </div>
                {check.link && (
                  <a
                    href={check.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B8956C] hover:text-[#9A7B58] mr-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-3 pt-2 border-t border-current/10">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-[#B8956C] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#1A1915]">What it checks</p>
                    <p className="text-xs text-[#8C857A]">{check.whatItChecks}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-[#B8956C] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#1A1915]">Why it matters</p>
                    <p className="text-xs text-[#8C857A]">{check.whyItMatters}</p>
                  </div>
                </div>
                {check.currentValue && (
                  <div className="flex gap-2">
                    <FileText className="w-4 h-4 text-[#B8956C] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-[#1A1915]">Current value</p>
                      <pre className="text-xs text-[#8C857A] whitespace-pre-wrap bg-[#F5F3EF] p-2 rounded mt-1 max-h-32 overflow-auto">{check.currentValue}</pre>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Wrench className="w-4 h-4 text-[#B8956C] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#1A1915]">How to fix</p>
                    <p className="text-xs text-[#8C857A]">{check.howToFix}</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TechnicalSEOPanel;
