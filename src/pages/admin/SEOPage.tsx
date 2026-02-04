import React from 'react';
import { Activity, Shield, Link2, Search } from 'lucide-react';
import CoreWebVitalsPanel from '@/components/admin/CoreWebVitalsPanel';
import TechnicalSEOPanel from '@/components/admin/TechnicalSEOPanel';
import BacklinksPlaceholder from '@/components/admin/BacklinksPlaceholder';
import SearchConsolePlaceholder from '@/components/admin/SearchConsolePlaceholder';

const SEOPage: React.FC = () => {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold text-[#1A1915]">SEO & Search Intelligence</h2>
        <p className="text-sm text-[#8C857A]">Core Web Vitals, technical SEO health, and search performance</p>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#B8956C]/10">
            <Activity className="w-6 h-6 text-[#B8956C]" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-[#1A1915]">Core Web Vitals</h3>
            <p className="text-xs text-[#8C857A]">Real user performance metrics</p>
          </div>
        </div>
        <CoreWebVitalsPanel />
      </div>

      {/* Technical SEO */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#B8956C]/10">
            <Shield className="w-6 h-6 text-[#B8956C]" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-[#1A1915]">Technical SEO Health</h3>
            <p className="text-xs text-[#8C857A]">On-page optimization checks</p>
          </div>
        </div>
        <TechnicalSEOPanel />
      </div>

      {/* External Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Search className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">Search Console</h3>
              <p className="text-xs text-[#8C857A]">Keyword rankings and queries</p>
            </div>
          </div>
          <SearchConsolePlaceholder />
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Link2 className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">Backlinks</h3>
              <p className="text-xs text-[#8C857A]">Inbound link monitoring</p>
            </div>
          </div>
          <BacklinksPlaceholder />
        </div>
      </div>
    </>
  );
};

export default SEOPage;
