import React from 'react';
import { FlaskConical, Link2 } from 'lucide-react';
import ABTestingPanel from '@/components/admin/ABTestingPanel';
import UTMTrackingDashboard from '@/components/admin/UTMTrackingDashboard';

const CampaignsPage: React.FC = () => {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold text-[#1A1915]">
          Campaign Intelligence
        </h2>
        <p className="text-sm text-[#8C857A]">A/B tests, UTM tracking, and campaign performance</p>
      </div>

      {/* A/B Testing & UTM Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <FlaskConical className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">A/B Testing</h3>
              <p className="text-xs text-[#8C857A]">Experiment management and results</p>
            </div>
          </div>
          <ABTestingPanel />
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Link2 className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">UTM Tracking</h3>
              <p className="text-xs text-[#8C857A]">Campaign parameter performance</p>
            </div>
          </div>
          <UTMTrackingDashboard />
        </div>
      </div>
    </>
  );
};

export default CampaignsPage;
