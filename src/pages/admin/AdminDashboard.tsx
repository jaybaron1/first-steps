import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { 
  Shield, 
  LogOut, 
  Users, 
  Activity, 
  Eye,
  TrendingUp,
  Zap,
  Clock,
  BarChart3,
  Bell,
  FileText,
  RefreshCw,
  Map,
  Route
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/admin/StatsCard';
import RealtimeFeed from '@/components/admin/RealtimeFeed';
import TopPagesCard from '@/components/admin/TopPagesCard';
import RecentVisitorsCard from '@/components/admin/RecentVisitorsCard';
import AlertsPanel from '@/components/admin/AlertsPanel';
import LiveVisitorMap from '@/components/admin/LiveVisitorMap';
import ActiveUsersPanel from '@/components/admin/ActiveUsersPanel';
import VisitorTimeline from '@/components/admin/VisitorTimeline';
import { useAdminStats } from '@/hooks/useAdminStats';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, loading, error } = useAdminStats();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin-portal');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Command Center | Galavanteer Admin</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-theme min-h-screen bg-[hsl(var(--admin-bg))]">
        {/* Header */}
        <header className="border-b border-[hsl(var(--admin-border-subtle))] bg-[hsl(var(--admin-bg)/0.8)] backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B8956C]/10 border border-[hsl(var(--admin-border))] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#B8956C]" />
              </div>
              <div>
                <h1 className="text-lg font-medium text-[hsl(var(--admin-text))] font-display">Command Center</h1>
                <p className="text-xs text-[hsl(var(--admin-text-subtle))]">Galavanteer Admin Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-bg-card))]"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Live</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-bg-card))]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              label="Active Visitors"
              value={stats.activeVisitors}
              icon={Users}
              loading={loading}
              accentColor="text-emerald-600 dark:text-emerald-400"
              trend={{ value: 0, label: 'Last 5 minutes' }}
            />
            <StatsCard
              label="Page Views Today"
              value={stats.pageViewsToday}
              icon={Eye}
              loading={loading}
              accentColor="text-blue-600 dark:text-blue-400"
            />
            <StatsCard
              label="Unique Visitors"
              value={stats.uniqueVisitorsToday}
              icon={TrendingUp}
              loading={loading}
              accentColor="text-purple-600 dark:text-purple-400"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
              label="Avg. Time on Site"
              value={stats.avgTimeOnSite}
              icon={Clock}
              loading={loading}
              accentColor="text-cyan-600 dark:text-cyan-400"
            />
            <StatsCard
              label="Bounce Rate"
              value={`${stats.bounceRate}%`}
              icon={Activity}
              loading={loading}
              accentColor="text-amber-600 dark:text-amber-400"
            />
            <StatsCard
              label="Active Campaigns"
              value={stats.activeCampaigns}
              icon={BarChart3}
              loading={loading}
              accentColor="text-indigo-600 dark:text-indigo-400"
            />
          </div>

          {/* Live Visitor Map */}
          <div className="bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-[#B8956C]" />
                <h3 className="text-lg font-medium text-[hsl(var(--admin-text))]">Live Visitor Map</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-[hsl(var(--admin-text-subtle))]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Real-time
              </div>
            </div>
            <LiveVisitorMap />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Real-Time Activity Feed */}
            <div className="lg:col-span-2 bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#B8956C]" />
                  <h3 className="text-lg font-medium text-[hsl(var(--admin-text))]">Real-Time Activity</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-[hsl(var(--admin-text-subtle))]">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </div>
              </div>
              <RealtimeFeed maxItems={8} />
            </div>

            {/* Active Users Panel */}
            <div className="bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-[#B8956C]" />
                <h3 className="text-lg font-medium text-[hsl(var(--admin-text))]">Active Users</h3>
              </div>
              <ActiveUsersPanel />
            </div>
          </div>

          {/* Visitor Timeline & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Visitor Timeline */}
            <div className="bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Route className="w-5 h-5 text-[#B8956C]" />
                <h3 className="text-lg font-medium text-[hsl(var(--admin-text))]">Visitor Journeys</h3>
              </div>
              <VisitorTimeline />
            </div>

            {/* Alerts Panel */}
            <div className="bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-[#B8956C]" />
                <h3 className="text-lg font-medium text-[hsl(var(--admin-text))]">Alerts</h3>
              </div>
              <AlertsPanel />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-[#B8956C]" />
                <h3 className="text-lg font-medium text-[hsl(var(--admin-text))]">Top Pages Today</h3>
              </div>
              <TopPagesCard />
            </div>

            {/* Recent Visitors */}
            <div className="bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-[#B8956C]" />
                <h3 className="text-lg font-medium text-[hsl(var(--admin-text))]">Recent Visitors</h3>
              </div>
              <RecentVisitorsCard />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
