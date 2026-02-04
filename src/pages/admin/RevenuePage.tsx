import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Target,
  BarChart3,
  Zap,
  Plus,
  Clock,
  Users,
  AlertTriangle,
  Grid3X3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SalesPipeline from '@/components/admin/SalesPipeline';
import AttributionChart from '@/components/admin/AttributionChart';
import CampaignROITable from '@/components/admin/CampaignROITable';
import RevenueChart from '@/components/admin/RevenueChart';
import RevenueForecast from '@/components/admin/RevenueForecast';
import UnitEconomicsCard from '@/components/admin/UnitEconomicsCard';
import AtRiskDealsPanel from '@/components/admin/AtRiskDealsPanel';
import StageVelocityChart from '@/components/admin/StageVelocityChart';
import CohortRetentionChart from '@/components/admin/CohortRetentionChart';
import ChurnAnalysisPanel from '@/components/admin/ChurnAnalysisPanel';
import DealEntryModal from '@/components/admin/DealEntryModal';
import RevenueEntryModal from '@/components/admin/RevenueEntryModal';

const RevenuePage: React.FC = () => {
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [revenueModalOpen, setRevenueModalOpen] = useState(false);

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-[#1A1915] mb-2">
            Revenue Attribution
          </h2>
          <p className="text-[#8C857A]">
            Track customer value from first touch through conversion with multi-touch attribution models
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setDealModalOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Deal
          </Button>
          <Button
            onClick={() => setRevenueModalOpen(true)}
            className="gap-2 bg-[#B8956C] hover:bg-[#A67C52] text-white"
          >
            <DollarSign className="w-4 h-4" />
            Record Revenue
          </Button>
        </div>
      </div>

      {/* Unit Economics */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[#B8956C]/10">
            <Users className="w-5 h-5 text-[#B8956C]" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-[#1A1915]">
              Unit Economics
            </h3>
            <p className="text-xs text-[#8C857A]">LTV, CAC, and customer value metrics</p>
          </div>
        </div>
        <UnitEconomicsCard />
      </div>

      {/* Revenue Trend */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg mb-8">
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

      {/* Pipeline & At-Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

        {/* At-Risk Deals */}
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                At-Risk Deals
              </h3>
              <p className="text-xs text-[#8C857A]">Deals stalled beyond expected velocity</p>
            </div>
          </div>
          <AtRiskDealsPanel />
        </div>
      </div>

      {/* Stage Velocity & Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Stage Velocity */}
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Clock className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Stage Velocity
              </h3>
              <p className="text-xs text-[#8C857A]">Average time spent in each stage</p>
            </div>
          </div>
          <StageVelocityChart />
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
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg mb-8">
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

      {/* Cohort & Churn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Cohort Retention */}
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Grid3X3 className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Cohort Retention
              </h3>
              <p className="text-xs text-[#8C857A]">Customer retention by signup month</p>
            </div>
          </div>
          <CohortRetentionChart />
        </div>

        {/* Churn Analysis */}
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-100">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Churn Analysis
              </h3>
              <p className="text-xs text-[#8C857A]">Customer churn and growth metrics</p>
            </div>
          </div>
          <ChurnAnalysisPanel />
        </div>
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

      {/* Modals */}
      <DealEntryModal isOpen={dealModalOpen} onClose={() => setDealModalOpen(false)} />
      <RevenueEntryModal isOpen={revenueModalOpen} onClose={() => setRevenueModalOpen(false)} />
    </>
  );
};

export default RevenuePage;
