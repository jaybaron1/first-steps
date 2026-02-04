import React from 'react';
import { Users, Globe, Route, Monitor, PieChart } from 'lucide-react';
import RecentVisitorsCard from '@/components/admin/RecentVisitorsCard';
import GeoHeatMap from '@/components/admin/GeoHeatMap';
import VisitorTimeline from '@/components/admin/VisitorTimeline';
import DeviceBrowserAnalytics from '@/components/admin/DeviceBrowserAnalytics';
import TrafficSourcesChart from '@/components/admin/TrafficSourcesChart';

const VisitorsPage: React.FC = () => {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-semibold text-[#1A1915]">Visitor Intelligence</h2>
        <p className="text-sm text-[#8C857A]">Deep insights into your audience</p>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 mb-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Globe className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Geographic Distribution
              </h3>
              <p className="text-xs text-[#8C857A]">Visitor density by country</p>
            </div>
          </div>
        </div>
        <GeoHeatMap />
      </div>

      {/* Visitor List & Journey Maps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Users className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">Visitor List</h3>
              <p className="text-xs text-[#8C857A]">All sessions with filters</p>
            </div>
          </div>
          <RecentVisitorsCard />
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Route className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Visitor Journey Maps
              </h3>
              <p className="text-xs text-[#8C857A]">Individual session timelines</p>
            </div>
          </div>
          <VisitorTimeline />
        </div>
      </div>

      {/* Device & Browser Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Monitor className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Device & Browser
              </h3>
              <p className="text-xs text-[#8C857A]">Technology breakdown</p>
            </div>
          </div>
          <DeviceBrowserAnalytics />
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <PieChart className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Traffic Sources
              </h3>
              <p className="text-xs text-[#8C857A]">Where visitors come from</p>
            </div>
          </div>
          <TrafficSourcesChart />
        </div>
      </div>
    </>
  );
};

export default VisitorsPage;
