import React from 'react';
import { useCoreWebVitals } from '@/hooks/useCoreWebVitals';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VitalCardProps {
  name: string;
  fullName: string;
  value: number;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

const VitalCard: React.FC<VitalCardProps> = ({ name, fullName, value, unit, rating, description }) => {
  const ratingColors = {
    good: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'needs-improvement': 'bg-amber-100 text-amber-700 border-amber-200',
    poor: 'bg-red-100 text-red-700 border-red-200',
  };

  const ratingLabels = {
    good: 'Good',
    'needs-improvement': 'Needs Work',
    poor: 'Poor',
  };

  const formatValue = (val: number, u: string): string => {
    if (u === 'ms') return `${Math.round(val)}ms`;
    if (u === 's') return `${(val / 1000).toFixed(2)}s`;
    if (u === '') return val.toFixed(3);
    return `${val}${u}`;
  };

  return (
    <div className="p-4 bg-white border border-[#B8956C]/10 rounded-xl">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-lg font-semibold text-[#1A1915]">{name}</p>
          <p className="text-xs text-[#8C857A]">{fullName}</p>
        </div>
        <Badge variant="outline" className={cn('text-xs', ratingColors[rating])}>
          {ratingLabels[rating]}
        </Badge>
      </div>
      <p className="text-2xl font-bold text-[#1A1915] mb-1">{formatValue(value, unit)}</p>
      <p className="text-xs text-[#8C857A]">{description}</p>
    </div>
  );
};

const CoreWebVitalsPanel: React.FC = () => {
  const { vitals, loading, sampleCount } = useCoreWebVitals(7);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  const metrics = [
    {
      name: 'LCP',
      fullName: 'Largest Contentful Paint',
      value: vitals.lcp.value,
      unit: 's',
      rating: vitals.lcp.rating,
      description: 'Time until the largest content element is visible',
    },
    {
      name: 'INP',
      fullName: 'Interaction to Next Paint',
      value: vitals.inp.value,
      unit: 'ms',
      rating: vitals.inp.rating,
      description: 'Responsiveness to user interactions',
    },
    {
      name: 'CLS',
      fullName: 'Cumulative Layout Shift',
      value: vitals.cls.value,
      unit: '',
      rating: vitals.cls.rating,
      description: 'Visual stability during page load',
    },
    {
      name: 'FCP',
      fullName: 'First Contentful Paint',
      value: vitals.fcp.value,
      unit: 's',
      rating: vitals.fcp.rating,
      description: 'Time until first content is painted',
    },
    {
      name: 'TTFB',
      fullName: 'Time to First Byte',
      value: vitals.ttfb.value,
      unit: 'ms',
      rating: vitals.ttfb.rating,
      description: 'Server response time',
    },
    {
      name: 'FID',
      fullName: 'First Input Delay',
      value: vitals.fid.value,
      unit: 'ms',
      rating: vitals.fid.rating,
      description: 'Time until page becomes interactive',
    },
  ];

  return (
    <div>
      {sampleCount === 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          No Core Web Vitals data yet. Metrics will appear as visitors browse the site.
        </div>
      )}
      {sampleCount > 0 && (
        <p className="text-xs text-[#8C857A] mb-4">Based on {sampleCount} samples from the last 7 days</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <VitalCard key={metric.name} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default CoreWebVitalsPanel;
