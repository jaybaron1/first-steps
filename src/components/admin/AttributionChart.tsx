import React, { useState } from 'react';
import { useAttribution, AttributionModel } from '@/hooks/useAttribution';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CHANNEL_COLORS: Record<string, string> = {
  organic: '#10B981',
  paid: '#6366F1',
  social: '#EC4899',
  email: '#F59E0B',
  referral: '#8B5CF6',
  direct: '#6B7280',
};

const MODEL_LABELS: Record<AttributionModel, string> = {
  first_touch: 'First Touch',
  last_touch: 'Last Touch',
  linear: 'Linear',
  time_decay: 'Time Decay',
  position_based: 'Position Based (U-Shaped)',
};

const AttributionChart: React.FC = () => {
  const [model, setModel] = useState<AttributionModel>('linear');
  const { data, loading, error } = useAttribution(model);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-8 text-[#8C857A]">
        {error || 'No attribution data available'}
      </div>
    );
  }

  const pieData = data.byChannel.map(c => ({
    name: c.channel.charAt(0).toUpperCase() + c.channel.slice(1),
    value: c.revenue,
    percentage: c.percentage,
    color: CHANNEL_COLORS[c.channel] || '#6B7280',
  }));

  const barData = data.byChannel.map(c => ({
    channel: c.channel.charAt(0).toUpperCase() + c.channel.slice(1),
    revenue: c.revenue,
    deals: c.deals,
  }));

  return (
    <div className="space-y-6">
      {/* Model Selector */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#4A4640]">Attribution Model</p>
          <p className="text-xs text-[#8C857A]">How credit is distributed across touchpoints</p>
        </div>
        <Select value={model} onValueChange={(v) => setModel(v as AttributionModel)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MODEL_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#F9F6F0] rounded-xl p-4">
          <p className="text-xs text-[#8C857A] mb-1">Attributed Revenue</p>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">
            ${data.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#F9F6F0] rounded-xl p-4">
          <p className="text-xs text-[#8C857A] mb-1">Closed Deals</p>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">
            {data.totalDeals}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h4 className="text-sm font-medium text-[#4A4640] mb-4">Revenue by Channel</h4>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#FDFBF7',
                    border: '1px solid rgba(184, 149, 108, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-[#8C857A]">
              No channel data
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div>
          <h4 className="text-sm font-medium text-[#4A4640] mb-4">Deals by Channel</h4>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
                <XAxis 
                  dataKey="channel" 
                  tick={{ fontSize: 12, fill: '#8C857A' }}
                  axisLine={{ stroke: '#E5E2DB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#8C857A' }}
                  axisLine={{ stroke: '#E5E2DB' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FDFBF7',
                    border: '1px solid rgba(184, 149, 108, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="deals" fill="#B8956C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-[#8C857A]">
              No deal data
            </div>
          )}
        </div>
      </div>

      {/* Channel Details Table */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[#4A4640]">Channel Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#B8956C]/20">
                <th className="text-left py-2 text-[#8C857A] font-medium">Channel</th>
                <th className="text-right py-2 text-[#8C857A] font-medium">Revenue</th>
                <th className="text-right py-2 text-[#8C857A] font-medium">Deals</th>
                <th className="text-right py-2 text-[#8C857A] font-medium">Touches</th>
                <th className="text-right py-2 text-[#8C857A] font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {data.byChannel.map(channel => (
                <tr key={channel.channel} className="border-b border-[#F3EDE4]">
                  <td className="py-2 font-medium text-[#1A1915] capitalize">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: CHANNEL_COLORS[channel.channel] || '#6B7280' }}
                      />
                      {channel.channel}
                    </div>
                  </td>
                  <td className="py-2 text-right text-[#1A1915]">
                    ${channel.revenue.toLocaleString()}
                  </td>
                  <td className="py-2 text-right text-[#4A4640]">
                    {channel.deals}
                  </td>
                  <td className="py-2 text-right text-[#4A4640]">
                    {channel.touchpoints}
                  </td>
                  <td className="py-2 text-right text-[#4A4640]">
                    {channel.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttributionChart;
