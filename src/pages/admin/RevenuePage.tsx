import React from 'react';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Target,
  BarChart3,
  Zap,
} from 'lucide-react';
import SalesPipeline from '@/components/admin/SalesPipeline';
import AttributionChart from '@/components/admin/AttributionChart';
import CampaignROITable from '@/components/admin/CampaignROITable';
import RevenueChart from '@/components/admin/RevenueChart';
import RevenueForecast from '@/components/admin/RevenueForecast';

const RevenuePage: React.FC = () => {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold text-[#1A1915] mb-2">
          Revenue Attribution
        </h2>
        <p className="text-[#8C857A]">
          Track customer value from first touch through conversion with multi-touch attribution models
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <TrendingUp className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Revenue Trend
              </h3>
              <p className="text-xs text-[#8C857A]">Historical revenue performance</p>
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Sales Pipeline */}
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <BarChart3 className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Sales Pipeline
              </h3>
              <p className="text-xs text-[#8C857A]">Deal stages and values</p>
            </div>
          </div>
          <SalesPipeline />
        </div>

        {/* Revenue Forecast */}
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Target className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Revenue Forecast
              </h3>
              <p className="text-xs text-[#8C857A]">Projected revenue and pipeline</p>
            </div>
          </div>
          <RevenueForecast />
        </div>
      </div>

      {/* Attribution Section */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#B8956C]/10">
            <PieChart className="w-6 h-6 text-[#B8956C]" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-[#1A1915]">
              Channel Attribution
            </h3>
            <p className="text-xs text-[#8C857A]">
              Revenue attribution across marketing channels with customizable models
            </p>
          </div>
        </div>
        <AttributionChart />
      </div>

      {/* Campaign ROI */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#B8956C]/10">
            <Zap className="w-6 h-6 text-[#B8956C]" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-[#1A1915]">
              Campaign ROI
            </h3>
            <p className="text-xs text-[#8C857A]">
              Return on investment by marketing campaign
            </p>
          </div>
        </div>
        <CampaignROITable />
      </div>
    </>
  );
};

export default RevenuePage;
