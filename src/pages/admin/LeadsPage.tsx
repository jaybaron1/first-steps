import React from 'react';
import { UserCheck, Filter, Target, MousePointerClick, Flame, FileText, Sparkles, Thermometer } from 'lucide-react';
import LeadsPanel from '@/components/admin/LeadsPanel';
import ConversionFunnel from '@/components/admin/ConversionFunnel';
import GoalsPanel from '@/components/admin/GoalsPanel';
import CTAPerformance from '@/components/admin/CTAPerformance';
import CTAHeatmap from '@/components/admin/CTAHeatmap';
import FormSubmissionsPanel from '@/components/admin/FormSubmissionsPanel';
import LeadEnrichmentStatus from '@/components/admin/LeadEnrichmentStatus';
import HotLeadsPanel from '@/components/admin/HotLeadsPanel';

const LeadsPage: React.FC = () => {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold text-[#1A1915]">Lead Generation</h2>
        <p className="text-sm text-[#8C857A]">Capture, score, and convert prospects</p>
      </div>

      {/* Hot Leads Panel - NEW */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-8 mb-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Thermometer className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Hot Leads Requiring Action
              </h3>
              <p className="text-xs text-[#8C857A]">High-score leads that need immediate follow-up</p>
            </div>
          </div>
        </div>
        <HotLeadsPanel />
      </div>

      {/* Lead Management */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 mb-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <UserCheck className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">Lead Management</h3>
              <p className="text-xs text-[#8C857A]">All leads with scoring and status</p>
            </div>
          </div>
        </div>
        <LeadsPanel />
      </div>

      {/* Form Submissions & Lead Enrichment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <FileText className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">Form Submissions</h3>
              <p className="text-xs text-[#8C857A]">Track form starts and completions</p>
            </div>
          </div>
          <FormSubmissionsPanel />
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Sparkles className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">Lead Enrichment</h3>
              <p className="text-xs text-[#8C857A]">Company data enrichment status</p>
            </div>
          </div>
          <LeadEnrichmentStatus />
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 mb-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Filter className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Conversion Funnel
              </h3>
              <p className="text-xs text-[#8C857A]">Multi-step journey visualization</p>
            </div>
          </div>
        </div>
        <ConversionFunnel />
      </div>

      {/* Goals & CTA Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Target className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Conversion Goals
              </h3>
              <p className="text-xs text-[#8C857A]">Track key actions</p>
            </div>
          </div>
          <GoalsPanel />
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <MousePointerClick className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">CTA Performance</h3>
              <p className="text-xs text-[#8C857A]">Button click analytics</p>
            </div>
          </div>
          <CTAPerformance />
        </div>
      </div>

      {/* CTA Heatmap */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Flame className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">CTA Heatmap</h3>
              <p className="text-xs text-[#8C857A]">Click density by page section</p>
            </div>
          </div>
        </div>
        <CTAHeatmap />
      </div>
    </>
  );
};

export default LeadsPage;
