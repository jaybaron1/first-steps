import React, { useState } from 'react';
import { useFunnelStats, TimeRange } from '@/hooks/useFunnelStats';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingDown, TrendingUp, Users, Target, ArrowDown } from 'lucide-react';

const ConversionFunnel: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const { metrics, loading, error } = useFunnelStats({ timeRange });

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    );
  }

  const maxVisitors = metrics.steps[0]?.visitors || 1;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
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
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold">{metrics.totalVisitors.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Converted:</span>
            <span className="font-semibold">{metrics.totalConverted.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-muted-foreground">Rate:</span>
            <span className="font-semibold text-green-600">{metrics.totalConversionRate}%</span>
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-16 flex-1" />
            </div>
          ))
        ) : metrics.steps.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No funnel data available. Configure funnel steps in the database.
          </div>
        ) : (
          metrics.steps.map((step, index) => {
            const widthPercent = Math.max(20, (step.visitors / maxVisitors) * 100);
            const prevStep = index > 0 ? metrics.steps[index - 1] : null;
            const continueRate = prevStep 
              ? Math.round((step.visitors / (prevStep.visitors || 1)) * 100) 
              : 100;

            return (
              <React.Fragment key={step.id}>
                {/* Drop-off indicator between steps */}
                {index > 0 && (
                  <div className="flex items-center justify-center py-1">
                    <div className="flex items-center gap-2 text-xs">
                      <ArrowDown className="w-3 h-3 text-muted-foreground" />
                      <span className={`font-medium ${step.dropOffRate > 50 ? 'text-red-600' : step.dropOffRate > 30 ? 'text-amber-600' : 'text-green-600'}`}>
                        {continueRate}% continue
                      </span>
                      {step.dropOffRate > 0 && (
                        <span className="text-muted-foreground">
                          ({step.dropOffRate}% drop-off)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Funnel Step Bar */}
                <div 
                  className="relative group cursor-pointer"
                  style={{ width: `${widthPercent}%`, margin: '0 auto' }}
                >
                  <div 
                    className={`
                      relative h-16 rounded-lg transition-all duration-300
                      ${index === metrics.steps.length - 1 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-[#B8956C] to-[#9A7B58]'
                      }
                      hover:shadow-lg hover:scale-[1.02]
                    `}
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-4 text-white">
                      <div>
                        <p className="font-medium">{step.name}</p>
                        <p className="text-xs opacity-80">{step.url_pattern}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{step.visitors.toLocaleString()}</p>
                        <p className="text-xs opacity-80">{step.percentage}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Insights */}
      {!loading && metrics.steps.length > 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">💡 Insights</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {metrics.steps.map((step, i) => {
              if (i === 0 || step.dropOffRate < 30) return null;
              return (
                <li key={step.id} className="flex items-center gap-2">
                  <TrendingDown className="w-3 h-3 text-red-500" />
                  <span>
                    <strong>{step.dropOffRate}%</strong> drop-off between {metrics.steps[i - 1].name} → {step.name}
                  </span>
                </li>
              );
            })}
            {metrics.totalConversionRate > 0 && (
              <li className="flex items-center gap-2 text-green-700">
                <TrendingUp className="w-3 h-3" />
                <span>
                  Overall conversion rate: <strong>{metrics.totalConversionRate}%</strong>
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConversionFunnel;
