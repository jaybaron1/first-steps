import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTrafficSources } from '@/hooks/useTrafficSources';

const TrafficSourcesChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('7days');
  const { sources, loading, error, totalVisitors } = useTrafficSources(timeRange);

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8956C]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (sources.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[#8C857A] text-sm">
        No traffic source data available
      </div>
    );
  }

  const chartData = sources.map((source) => ({
    name: source.source,
    value: source.count,
    percentage: source.percentage,
    color: source.color,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-[#B8956C]/20 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-[#1A1915]">{data.name}</p>
          <p className="text-xs text-[#8C857A]">
            {data.value} visitors ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['today', '7days', '30days'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                timeRange === range
                  ? 'bg-[#B8956C] text-white'
                  : 'bg-[#F3EDE4] text-[#8C857A] hover:bg-[#E8E0D5]'
              }`}
            >
              {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#8C857A]">{totalVisitors} total</span>
      </div>

      {/* Pie Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {sources.slice(0, 6).map((source) => (
          <div key={source.source} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: source.color }}
            />
            <span className="text-xs text-[#4A4640] truncate">{source.source}</span>
            <span className="text-xs text-[#8C857A] ml-auto">{source.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficSourcesChart;
