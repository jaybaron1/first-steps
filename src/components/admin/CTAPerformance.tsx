import React, { useState } from 'react';
import { useCTAStats, CTATimeRange } from '@/hooks/useCTAStats';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  MousePointerClick,
  Smartphone,
  Monitor,
  TrendingUp,
  Award,
  Target,
} from 'lucide-react';

// Simple sparkline component
const Sparkline: React.FC<{ data: { date: string; clicks: number }[] }> = ({ data }) => {
  if (data.length === 0) return <span className="text-muted-foreground text-xs">No data</span>;
  
  const max = Math.max(...data.map(d => d.clicks), 1);
  const height = 20;
  const width = 60;
  const points = data.slice(-7).map((d, i, arr) => {
    const x = (i / Math.max(arr.length - 1, 1)) * width;
    const y = height - (d.clicks / max) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-[#B8956C]"
      />
    </svg>
  );
};

const CTAPerformance: React.FC = () => {
  const [timeRange, setTimeRange] = useState<CTATimeRange>('30d');
  const { stats, totalClicks, topPerformer, loading, error } = useCTAStats({ timeRange });

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as CTATimeRange)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total Clicks:</span>
            <span className="font-semibold">{totalClicks.toLocaleString()}</span>
          </div>
          {topPerformer && (
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-muted-foreground">Best:</span>
              <span className="font-semibold">{topPerformer.ctaName}</span>
              <Badge variant="secondary" className="text-green-700 bg-green-50">
                {topPerformer.conversionRate}% CVR
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* CTA Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>CTA</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead>Device Split</TableHead>
              <TableHead>Trend (7d)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                </TableRow>
              ))
            ) : stats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No CTA clicks tracked yet. Add <code>data-track-cta</code> attribute to buttons.
                </TableCell>
              </TableRow>
            ) : (
              stats.map((cta, index) => (
                <TableRow key={`${cta.ctaName}-${cta.pageUrl}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {index === 0 && <Award className="w-4 h-4 text-amber-500" />}
                      <span className="font-medium">{cta.ctaName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {cta.pageUrl.length > 30 
                        ? cta.pageUrl.substring(0, 30) + '...' 
                        : cta.pageUrl}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {cta.totalClicks.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Target className="w-3 h-3 text-green-600" />
                      <span>{cta.conversions}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant="secondary" 
                      className={
                        cta.conversionRate >= 10 
                          ? 'bg-green-50 text-green-700'
                          : cta.conversionRate >= 5
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-50 text-gray-700'
                      }
                    >
                      {cta.conversionRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Smartphone className="w-3 h-3" />
                        <span>{cta.mobilePercentage}%</span>
                      </div>
                      <Progress 
                        value={cta.mobilePercentage} 
                        className="h-1.5 flex-1 bg-blue-100"
                      />
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Monitor className="w-3 h-3" />
                        <span>{100 - cta.mobilePercentage}%</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Sparkline data={cta.clicksByDay} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Cards */}
      {!loading && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MousePointerClick className="w-4 h-4 text-[#B8956C]" />
              <span className="text-sm font-medium">Most Clicked</span>
            </div>
            <p className="text-lg font-bold">{stats[0]?.ctaName || '-'}</p>
            <p className="text-sm text-muted-foreground">
              {stats[0]?.totalClicks.toLocaleString() || 0} clicks
            </p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Best Converter</span>
            </div>
            <p className="text-lg font-bold">{topPerformer?.ctaName || '-'}</p>
            <p className="text-sm text-muted-foreground">
              {topPerformer?.conversionRate || 0}% conversion rate
            </p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Mobile Engagement</span>
            </div>
            <p className="text-lg font-bold">
              {stats.length > 0 
                ? Math.round(stats.reduce((sum, s) => sum + s.mobilePercentage, 0) / stats.length)
                : 0}%
            </p>
            <p className="text-sm text-muted-foreground">average mobile clicks</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CTAPerformance;
