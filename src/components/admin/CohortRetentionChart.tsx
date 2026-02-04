import React from 'react';
import { useCohortAnalysis } from '@/hooks/useCohortAnalysis';
import { Skeleton } from '@/components/ui/skeleton';

const CohortRetentionChart: React.FC = () => {
  const { metrics, loading, error } = useCohortAnalysis();

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  if (error || !metrics || metrics.cohorts.length === 0) {
    return (
      <div className="text-center py-8 text-[#8C857A]">
        No cohort data available. Add customer data to see retention analysis.
      </div>
    );
  }

  const { cohorts, retentionMatrix } = metrics;

  // Get max months to display
  const maxMonths = Math.max(...retentionMatrix.map((r) => r.length), 1);
  const monthHeaders = Array.from({ length: Math.min(maxMonths, 7) }, (_, i) => 
    i === 0 ? 'M0' : `M${i}`
  );

  // Color scale for retention (green = high, red = low)
  const getRetentionColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500 text-white';
    if (rate >= 60) return 'bg-green-400 text-white';
    if (rate >= 40) return 'bg-amber-400 text-[#1A1915]';
    if (rate >= 20) return 'bg-orange-400 text-white';
    return 'bg-red-400 text-white';
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="text-[#8C857A]">Cohorts: </span>
          <span className="font-semibold text-[#1A1915]">{cohorts.length}</span>
        </div>
        <div>
          <span className="text-[#8C857A]">Avg Retention (M3): </span>
          <span className="font-semibold text-[#1A1915]">
            {cohorts.length > 0
              ? (cohorts.reduce((sum, c) => sum + (c.retentionByMonth[3] || 0), 0) / cohorts.length).toFixed(0)
              : 0}%
          </span>
        </div>
      </div>

      {/* Retention matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left font-medium text-[#8C857A] p-2 min-w-[80px]">Cohort</th>
              <th className="text-center font-medium text-[#8C857A] p-2">Users</th>
              {monthHeaders.map((m) => (
                <th key={m} className="text-center font-medium text-[#8C857A] p-2 w-12">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.slice(-6).map((cohort, cohortIdx) => (
              <tr key={cohort.cohortMonth} className="border-t border-[#B8956C]/10">
                <td className="p-2 font-medium text-[#1A1915]">
                  {cohort.cohortMonth}
                </td>
                <td className="text-center p-2 text-[#8C857A]">
                  {cohort.totalCustomers}
                </td>
                {monthHeaders.map((_, monthIdx) => {
                  const retention = cohort.retentionByMonth[monthIdx];
                  if (retention === undefined) {
                    return <td key={monthIdx} className="p-2" />;
                  }
                  return (
                    <td key={monthIdx} className="p-1">
                      <div
                        className={`text-center py-1 px-2 rounded ${getRetentionColor(retention)}`}
                        title={`${retention.toFixed(0)}% retention at month ${monthIdx}`}
                      >
                        {retention.toFixed(0)}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cohorts.length > 6 && (
        <p className="text-center text-xs text-[#8C857A]">
          Showing last 6 cohorts of {cohorts.length} total
        </p>
      )}
    </div>
  );
};

export default CohortRetentionChart;
