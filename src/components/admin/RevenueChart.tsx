import React, { useState } from 'react';
import { useRevenueMetrics } from '@/hooks/useRevenueMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RevenueChart: React.FC = () => {
  const { metrics, loading, error } = useRevenueMetrics();
  const [view, setView] = useState<'daily' | 'monthly'>('daily');

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="text-center py-8 text-[#8C857A]">
        {error || 'No revenue data available'}
      </div>
    );
  }

  const data = view === 'daily' ? metrics.revenueByDay : metrics.revenueByMonth;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#F9F6F0] rounded-xl p-4">
          <p className="text-xs text-[#8C857A] mb-1">Total Revenue</p>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">
            ${metrics.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#F9F6F0] rounded-xl p-4">
          <p className="text-xs text-[#8C857A] mb-1">This Month</p>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">
            ${metrics.revenueThisMonth.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#F9F6F0] rounded-xl p-4">
          <p className="text-xs text-[#8C857A] mb-1">MRR</p>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">
            ${metrics.mrr.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#F9F6F0] rounded-xl p-4">
          <p className="text-xs text-[#8C857A] mb-1">Growth</p>
          <p className={`text-2xl font-display font-semibold ${
            metrics.growthRate > 0 ? 'text-emerald-600' : 
            metrics.growthRate < 0 ? 'text-red-600' : 'text-[#1A1915]'
          }`}>
            {metrics.growthRate > 0 ? '+' : ''}{metrics.growthRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-[#4A4640]">Revenue Trend</h4>
        <Tabs value={view} onValueChange={(v) => setView(v as 'daily' | 'monthly')}>
          <TabsList className="bg-[#F3EDE4]">
            <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Area Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B8956C" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#B8956C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 11, fill: '#8C857A' }}
            axisLine={{ stroke: '#E5E2DB' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#8C857A' }}
            axisLine={{ stroke: '#E5E2DB' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FDFBF7',
              border: '1px solid rgba(184, 149, 108, 0.2)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#B8956C"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Cumulative Chart */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[#4A4640]">Cumulative Revenue</h4>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 11, fill: '#8C857A' }}
              axisLine={{ stroke: '#E5E2DB' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 11, fill: '#8C857A' }}
              axisLine={{ stroke: '#E5E2DB' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: '#8C857A' }}
              axisLine={{ stroke: '#E5E2DB' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FDFBF7',
                border: '1px solid rgba(184, 149, 108, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [
                name === 'cumulative' ? `$${value.toLocaleString()}` : value,
                name === 'cumulative' ? 'Cumulative' : 'Deals'
              ]}
            />
            <Bar 
              yAxisId="right" 
              dataKey="deals" 
              fill="#E5E2DB" 
              radius={[4, 4, 0, 0]} 
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cumulative"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
