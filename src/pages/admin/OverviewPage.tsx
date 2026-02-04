import React from 'react';
import {
  Users,
  Eye,
  TrendingUp,
  Zap,
  Clock,
  Activity,
  BarChart3,
  Map,
  Route,
  Bell,
  FileText,
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import RealtimeFeed from '@/components/admin/RealtimeFeed';
import TopPagesCard from '@/components/admin/TopPagesCard';
import RecentVisitorsCard from '@/components/admin/RecentVisitorsCard';
import AlertsPanel from '@/components/admin/AlertsPanel';
import LiveVisitorMap from '@/components/admin/LiveVisitorMap';
import ActiveUsersPanel from '@/components/admin/ActiveUsersPanel';
import VisitorTimeline from '@/components/admin/VisitorTimeline';
import { useAdminStats } from '@/hooks/useAdminStats';

const OverviewPage: React.FC = () => {
  const { stats, loading, error } = useAdminStats();

  return (
    <>
      {error && (
        <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm animate-slideDown">
          {error}
        </div>
      )}

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          label="Active Visitors"
          value={stats.activeVisitors}
          icon={Users}
          loading={loading}
          accentColor="text-emerald-600"
          trend={{ value: 0, label: 'Last 5 minutes' }}
        />
        <StatsCard
          label="Page Views Today"
          value={stats.pageViewsToday}
          icon={Eye}
          loading={loading}
          accentColor="text-blue-600"
        />
        <StatsCard
          label="Unique Visitors"
          value={stats.uniqueVisitorsToday}
          icon={TrendingUp}
          loading={loading}
          accentColor="text-purple-600"
        />
        <StatsCard
          label="Leads Today"
          value={stats.leadsToday}
          icon={Zap}
          loading={loading}
          accentColor="text-[#B8956C]"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard
          label="Avg. Time on Site"
          value={stats.avgTimeOnSite}
          icon={Clock}
          loading={loading}
          accentColor="text-cyan-600"
        />
        <StatsCard
          label="Bounce Rate"
          value={`${stats.bounceRate}%`}
          icon={Activity}
          loading={loading}
          accentColor="text-amber-600"
        />
        <StatsCard
          label="Active Campaigns"
          value={stats.activeCampaigns}
          icon={BarChart3}
          loading={loading}
          accentColor="text-indigo-600"
        />
      </div>

      {/* Live Visitor Map */}
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 mb-10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Map className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Live Visitor Map
              </h3>
              <p className="text-xs text-[#8C857A]">Real-time geographic distribution</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Streaming
          </div>
        </div>
        <LiveVisitorMap />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Real-Time Activity */}
        <div className="lg:col-span-2 bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#B8956C]/10">
                <Activity className="w-6 h-6 text-[#B8956C]" />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                  Real-Time Activity
                </h3>
                <p className="text-xs text-[#8C857A]">Live visitor events</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          </div>
          <RealtimeFeed maxItems={8} />
        </div>

        {/* Active Users */}
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Users className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">Active Users</h3>
              <p className="text-xs text-[#8C857A]">Currently browsing</p>
            </div>
          </div>
          <ActiveUsersPanel />
        </div>
      </div>

      {/* Timeline & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Route className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Visitor Journeys
              </h3>
              <p className="text-xs text-[#8C857A]">Session timelines</p>
            </div>
          </div>
          <VisitorTimeline />
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Bell className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">Alerts</h3>
              <p className="text-xs text-[#8C857A]">Important events</p>
            </div>
          </div>
          <AlertsPanel />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <FileText className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Top Pages Today
              </h3>
              <p className="text-xs text-[#8C857A]">Most viewed</p>
            </div>
          </div>
          <TopPagesCard />
        </div>

        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#B8956C]/10">
              <Users className="w-6 h-6 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-[#1A1915]">
                Recent Visitors
              </h3>
              <p className="text-xs text-[#8C857A]">Latest sessions</p>
            </div>
          </div>
          <RecentVisitorsCard />
        </div>
      </div>
    </>
  );
};

export default OverviewPage;
