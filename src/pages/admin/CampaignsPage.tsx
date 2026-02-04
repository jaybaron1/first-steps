import React from 'react';
import { FlaskConical, BarChart3, Link2, Mail } from 'lucide-react';
import ABTestingPanel from '@/components/admin/ABTestingPanel';

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

      {/* A/B Testing */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 mb-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <FlaskConical className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">A/B Testing</h3>
              <p className="text-xs text-[#8C857A]">Experiment management and results</p>
            </div>
          </div>
        </div>
        <ABTestingPanel />
      </div>

      {/* Campaign Overview & UTM Tracking - Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <BarChart3 className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Active Campaigns
              </h3>
              <p className="text-xs text-[#8C857A]">Performance overview</p>
            </div>
          </div>
          <div className="h-48 flex items-center justify-center text-[#8C857A] text-sm">
            Campaign overview coming soon
          </div>
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Link2 className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">UTM Tracking</h3>
              <p className="text-xs text-[#8C857A]">Parameter performance</p>
            </div>
          </div>
          <div className="h-48 flex items-center justify-center text-[#8C857A] text-sm">
            UTM tracking dashboard coming soon
          </div>
        </div>
      </div>

      {/* Email Performance - Placeholder */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#B8956C]/10">
            <Mail className="w-6 h-6 text-[#B8956C]" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-[#1A1915]">
              Email Marketing
            </h3>
            <p className="text-xs text-[#8C857A]">Campaign performance metrics</p>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center text-[#8C857A] text-sm">
          Email integration required — connect your email provider to see stats
        </div>
      </div>
    </>
  );
};

export default CampaignsPage;
