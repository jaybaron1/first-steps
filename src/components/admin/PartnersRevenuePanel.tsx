import React from 'react';
import { Briefcase, TrendingUp, DollarSign, Users } from 'lucide-react';
import { usePartnerRevenue } from '@/hooks/usePartnerRevenue';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const PartnersRevenuePanel: React.FC = () => {
  const { metrics, loading } = usePartnerRevenue();

  if (loading || !metrics) {
    return (
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg mb-8">
        <p className="text-sm text-[#8C857A]">Loading partner revenue…</p>
      </div>
    );
  }

  const growth =
    metrics.partnerRevenueLastMonth > 0
      ? ((metrics.partnerRevenueThisMonth - metrics.partnerRevenueLastMonth) /
          metrics.partnerRevenueLastMonth) *
        100
      : 0;

  return (
    <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[#B8956C]/10">
          <Briefcase className="w-6 h-6 text-[#B8956C]" />
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-[#1A1915]">Partner-Sourced Revenue</h3>
          <p className="text-xs text-[#8C857A]">
            Auto-rolled up from Partners CRM · {metrics.partnerSharePercent.toFixed(1)}% of total revenue
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#FDFBF7] border border-[#B8956C]/15 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#8C857A] text-xs mb-1">
            <DollarSign className="w-3.5 h-3.5" /> Total partner revenue
          </div>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">
            {fmt(metrics.totalPartnerRevenue)}
          </p>
        </div>
        <div className="bg-[#FDFBF7] border border-[#B8956C]/15 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#8C857A] text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5" /> This month
          </div>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">
            {fmt(metrics.partnerRevenueThisMonth)}
          </p>
          <p className={`text-xs mt-1 ${growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {growth >= 0 ? '+' : ''}
            {growth.toFixed(1)}% vs last month
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-700 text-xs mb-1">
            <DollarSign className="w-3.5 h-3.5" /> Commissions owed
          </div>
          <p className="text-2xl font-display font-semibold text-amber-900">
            {fmt(metrics.totalCommissionsOwed)}
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-700 text-xs mb-1">
            <DollarSign className="w-3.5 h-3.5" /> Commissions paid
          </div>
          <p className="text-2xl font-display font-semibold text-emerald-900">
            {fmt(metrics.totalCommissionsPaid)}
          </p>
        </div>
      </div>

      {metrics.topPartners.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-[#4A4640] mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" /> Top partners by revenue
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#8C857A] uppercase tracking-wider border-b border-[#B8956C]/15">
                  <th className="py-2">Partner</th>
                  <th className="py-2 text-right">Clients</th>
                  <th className="py-2 text-right">This month</th>
                  <th className="py-2 text-right">Total revenue</th>
                  <th className="py-2 text-right">Commission earned</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topPartners.map((p) => (
                  <tr key={p.partner_id} className="border-b border-[#B8956C]/10 last:border-0">
                    <td className="py-2.5 text-[#1A1915] font-medium">{p.partner_name}</td>
                    <td className="py-2.5 text-right text-[#4A4640]">{p.client_count}</td>
                    <td className="py-2.5 text-right text-[#4A4640]">{fmt(p.this_month)}</td>
                    <td className="py-2.5 text-right text-[#1A1915] font-medium">{fmt(p.total_revenue)}</td>
                    <td className="py-2.5 text-right text-[#B8956C]">{fmt(p.total_commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersRevenuePanel;
