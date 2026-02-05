import React, { useState } from 'react';
import { useCTAStats, CTAStat } from '@/hooks/useCTAStats';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, MousePointer, Smartphone, Monitor } from 'lucide-react';

// Page templates defining sections for known routes
const PAGE_TEMPLATES: Record<string, { id: string; label: string; position: 'top' | 'middle' | 'bottom' }[]> = {
  '/marketing': [
    { id: 'header', label: 'Header CTA', position: 'top' },
    { id: 'hero', label: 'Hero Section', position: 'top' },
    { id: 'scorecard', label: 'AI Scorecard', position: 'middle' },
    { id: 'how-it-works', label: 'How It Works', position: 'middle' },
    { id: 'pricing', label: 'Pricing Section', position: 'middle' },
    { id: 'final_cta', label: 'Final CTA', position: 'bottom' },
    { id: 'footer', label: 'Footer', position: 'bottom' },
  ],
  '/': [
    { id: 'header', label: 'Header Navigation', position: 'top' },
    { id: 'hero', label: 'Hero Section', position: 'top' },
    { id: 'problem', label: 'Problem Section', position: 'middle' },
    { id: 'examples', label: 'Examples Preview', position: 'middle' },
    { id: 'offers', label: 'Offers Section', position: 'middle' },
    { id: 'cta', label: 'Bottom CTA', position: 'bottom' },
  ],
  '/about': [
    { id: 'header', label: 'Header', position: 'top' },
    { id: 'story', label: 'My Story', position: 'middle' },
    { id: 'cta', label: 'CTA Section', position: 'bottom' },
  ],
};

type Intensity = 'cold' | 'warm' | 'hot';

interface SectionData {
  id: string;
  label: string;
  position: 'top' | 'middle' | 'bottom';
  clicks: number;
  intensity: Intensity;
  ctas: { name: string; clicks: number }[];
}

const CTAHeatmap: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const { stats, loading, error, refetch } = useCTAStats({ timeRange: '30d' });

  // Get available pages from stats
  const availablePages = Array.from(new Set(stats.map(s => {
    const url = new URL(s.pageUrl, 'http://dummy.com');
    return url.pathname;
  }))).filter(p => p !== 'Unknown Page');

  // Match CTAs to sections based on their data-track-cta attribute
  const matchCTAToSection = (ctaName: string): string => {
    const lowerName = ctaName.toLowerCase();
    if (lowerName.includes('hero')) return 'hero';
    if (lowerName.includes('header') || lowerName.includes('nav')) return 'header';
    if (lowerName.includes('pricing')) return 'pricing';
    if (lowerName.includes('final') || lowerName.includes('bottom')) return 'final_cta';
    if (lowerName.includes('footer')) return 'footer';
    if (lowerName.includes('scorecard')) return 'scorecard';
    if (lowerName.includes('how')) return 'how-it-works';
    if (lowerName.includes('example')) return 'examples';
    if (lowerName.includes('offer')) return 'offers';
    if (lowerName.includes('story')) return 'story';
    if (lowerName.includes('cta')) return 'cta';
    return 'unknown';
  };

  // Filter stats for selected page
  const pageStats = stats.filter(s => {
    try {
      const url = new URL(s.pageUrl, 'http://dummy.com');
      return url.pathname === selectedPage;
    } catch {
      return false;
    }
  });

  // Get page template or generate from stats
  const template = PAGE_TEMPLATES[selectedPage] || 
    pageStats.map(s => ({
      id: matchCTAToSection(s.ctaName),
      label: s.ctaName,
      position: 'middle' as const,
    }));

  // Calculate max clicks for intensity
  const maxClicks = Math.max(...pageStats.map(s => s.totalClicks), 1);

  const getIntensity = (clicks: number): Intensity => {
    const ratio = clicks / maxClicks;
    if (ratio >= 0.6) return 'hot';
    if (ratio >= 0.3) return 'warm';
    return 'cold';
  };

  // Build section data
  const sectionsMap = new Map<string, SectionData>();
  
  template.forEach(t => {
    sectionsMap.set(t.id, {
      ...t,
      clicks: 0,
      intensity: 'cold',
      ctas: [],
    });
  });

  pageStats.forEach(stat => {
    const sectionId = matchCTAToSection(stat.ctaName);
    const section = sectionsMap.get(sectionId);
    
    if (section) {
      section.clicks += stat.totalClicks;
      section.ctas.push({ name: stat.ctaName, clicks: stat.totalClicks });
    } else {
      // Create new section for unknown CTAs
      sectionsMap.set(sectionId, {
        id: sectionId,
        label: stat.ctaName,
        position: 'middle',
        clicks: stat.totalClicks,
        intensity: getIntensity(stat.totalClicks),
        ctas: [{ name: stat.ctaName, clicks: stat.totalClicks }],
      });
    }
  });

  // Update intensities
  sectionsMap.forEach(section => {
    section.intensity = getIntensity(section.clicks);
  });

  const sections = Array.from(sectionsMap.values())
    .sort((a, b) => {
      const posOrder = { top: 0, middle: 1, bottom: 2 };
      return posOrder[a.position] - posOrder[b.position];
    });

  const getIntensityStyles = (intensity: Intensity) => {
    switch (intensity) {
      case 'hot':
        return 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-400';
      case 'warm':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-400/20 border-yellow-400';
      case 'cold':
        return 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-300';
    }
  };

  const getIntensityBadge = (intensity: Intensity) => {
    switch (intensity) {
      case 'hot':
        return <Badge className="bg-red-500 text-white">Hot</Badge>;
      case 'warm':
        return <Badge className="bg-yellow-500 text-white">Warm</Badge>;
      case 'cold':
        return <Badge className="bg-blue-400 text-white">Cold</Badge>;
    }
  };

  const totalPageClicks = sections.reduce((sum, s) => sum + s.clicks, 0);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg">
              {Object.keys(PAGE_TEMPLATES).map(page => (
                <SelectItem key={page} value={page}>{page}</SelectItem>
              ))}
              {availablePages
                .filter(p => !PAGE_TEMPLATES[p])
                .map(page => (
                  <SelectItem key={page} value={page}>{page}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {totalPageClicks} total clicks
          </span>
        </div>
        <Button variant="outline" size="icon" onClick={refetch}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-muted-foreground">Click Intensity:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-red-500/40 to-orange-500/40" />
          <span>Hot (60%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-yellow-500/40 to-orange-400/40" />
          <span>Warm (30-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500/30 to-cyan-500/30" />
          <span>Cold (&lt;30%)</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Heatmap Visualization */}
      <div className="border rounded-xl overflow-hidden bg-muted/30">
        {/* Page Header Mock */}
        <div className="border-b bg-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#B8956C]/20" />
            <div className="w-24 h-3 rounded bg-muted" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 rounded bg-muted" />
            <div className="w-12 h-3 rounded bg-muted" />
            <div className="w-16 h-6 rounded bg-[#B8956C]/30" />
          </div>
        </div>

        {/* Sections */}
        {loading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MousePointer className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No CTA clicks recorded for this page</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`rounded-lg border-2 p-4 transition-all ${getIntensityStyles(section.intensity)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{section.label}</span>
                    {getIntensityBadge(section.intensity)}
                  </div>
                  <div className="text-sm font-semibold">
                    {section.clicks} clicks
                  </div>
                </div>
                
                {/* CTAs in this section */}
                {section.ctas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {section.ctas.map((cta, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-1.5 text-sm border"
                      >
                        <MousePointer className="w-3 h-3 text-muted-foreground" />
                        <span className="max-w-[200px] truncate">{cta.name}</span>
                        <span className="font-semibold text-[#B8956C]">{cta.clicks}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Page Footer Mock */}
        <div className="border-t bg-muted/50 p-3">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-2 rounded bg-muted" />
            <div className="w-16 h-2 rounded bg-muted" />
            <div className="w-16 h-2 rounded bg-muted" />
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      {pageStats.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Desktop</span>
            </div>
            <p className="text-2xl font-semibold">
              {pageStats.reduce((sum, s) => sum + s.desktopClicks, 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round((pageStats.reduce((sum, s) => sum + s.desktopClicks, 0) / Math.max(totalPageClicks, 1)) * 100)}% of clicks
            </p>
          </div>
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Mobile</span>
            </div>
            <p className="text-2xl font-semibold">
              {pageStats.reduce((sum, s) => sum + s.mobileClicks, 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round((pageStats.reduce((sum, s) => sum + s.mobileClicks, 0) / Math.max(totalPageClicks, 1)) * 100)}% of clicks
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CTAHeatmap;
