import React from 'react';
import { useRevenueMetrics } from '@/hooks/useRevenueMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { TrendingUp, Target, Calendar } from 'lucide-react';

const RevenueForecast: React.FC = () => {
  const { metrics, loading, error } = useRevenueMetrics();

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
        {error || 'No forecast data available'}
      </div>
    );
  }

  const { forecast } = metrics;

  // Calculate totals
  const totalProjected = forecast.reduce((sum, f) => sum + f.projected, 0);
  const totalPipeline = forecast.reduce((sum, f) => sum + f.pipeline, 0);
  const currentMonthActual = forecast[0]?.actual || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <p className="text-xs text-emerald-700 font-medium">6-Month Projection</p>
          </div>
          <p className="text-2xl font-display font-semibold text-emerald-900">
            ${totalProjected.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-700 font-medium">Pipeline Value</p>
          </div>
          <p className="text-2xl font-display font-semibold text-blue-900">
            ${totalPipeline.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <p className="text-xs text-amber-700 font-medium">Current Month</p>
          </div>
          <p className="text-2xl font-display font-semibold text-amber-900">
            ${currentMonthActual.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[#4A4640]">Revenue Forecast</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 11, fill: '#8C857A' }}
              axisLine={{ stroke: '#E5E2DB' }}
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
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name === 'projected' ? 'Projected' : name === 'actual' ? 'Actual' : 'Pipeline'
              ]}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => value === 'projected' ? 'Projected' : value === 'actual' ? 'Actual' : 'Pipeline'}
            />
            <Bar 
              dataKey="actual" 
              stackId="a"
              fill="#10B981"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="projected" 
              stackId="b"
              radius={[4, 4, 0, 0]}
            >
              {forecast.map((entry, index) => (
                <Cell 
                  key={index} 
                  fill={index === 0 ? '#10B981' : '#B8956C'}
                  opacity={index === 0 ? 0.3 : 1}
                />
              ))}
            </Bar>
            <Bar 
              dataKey="pipeline" 
              fill="#6366F1"
              fillOpacity={0.5}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Month by Month Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[#4A4640]">Monthly Breakdown</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {forecast.map((month, index) => (
            <div 
              key={month.month}
              className={`p-3 rounded-lg border ${
                index === 0 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-[#F9F6F0] border-[#B8956C]/20'
              }`}
            >
              <p className={`text-xs font-medium ${
                index === 0 ? 'text-emerald-700' : 'text-[#8C857A]'
              }`}>
                {month.month}
                {index === 0 && ' (Current)'}
              </p>
              <p className="text-lg font-semibold text-[#1A1915] mt-1">
                ${month.projected.toLocaleString()}
              </p>
              {month.pipeline > 0 && (
                <p className="text-xs text-[#8C857A] mt-1">
                  Pipeline: ${month.pipeline.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueForecast;
