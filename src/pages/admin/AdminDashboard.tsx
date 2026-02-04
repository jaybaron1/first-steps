import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { adminSupabase as supabase } from "@/lib/adminBackend";
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
  Route,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/admin/StatsCard";
import RealtimeFeed from "@/components/admin/RealtimeFeed";
import TopPagesCard from "@/components/admin/TopPagesCard";
import RecentVisitorsCard from "@/components/admin/RecentVisitorsCard";
import AlertsPanel from "@/components/admin/AlertsPanel";
import LiveVisitorMap from "@/components/admin/LiveVisitorMap";
import ActiveUsersPanel from "@/components/admin/ActiveUsersPanel";
import VisitorTimeline from "@/components/admin/VisitorTimeline";
import { useAdminStats } from "@/hooks/useAdminStats";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, loading, error } = useAdminStats();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin-portal");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Command Center | Galavanteer Admin</title>
        <meta
          name="robots"
          content="noindex, nofollow, noarchive, nosnippet,
  noimageindex"
        />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div
        className="admin-theme min-h-screen bg-gradient-to-br
  from-[#0A0A0A] via-[#1A1915] to-[#0A0A0A]"
      >
        {/* Ambient Background Effects */}
        <div className="fixed inset-0 opacity-30 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 bg-[#B8956C]/10
  rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B8956C]/5
   rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
        </div>

        {/* Header */}
        <header
          className="relative border-b border-[#B8956C]/10
  bg-[#1A1915]/80 backdrop-blur-xl sticky top-0 z-50"
        >
          <div
            className="max-w-[1800px] mx-auto px-8 py-5 flex items-center
  justify-between"
          >
            <div className="flex items-center gap-4 animate-fadeIn">
              <div
                className="relative w-12 h-12 rounded-xl bg-gradient-to-br
  from-[#B8956C] to-[#9A7B58] flex items-center justify-center shadow-lg
  shadow-[#B8956C]/20"
              >
                <Shield className="w-6 h-6 text-[#FDFBF7]" />
                <div
                  className="absolute -inset-0.5 bg-gradient-to-r
  from-[#B8956C] to-[#9A7B58] rounded-xl opacity-0 blur group-hover:opacity-100
  transition duration-300"
                />
              </div>
              <div>
                <h1
                  className="text-xl font-display font-semibold
  text-[#FDFBF7] tracking-tight"
                >
                  Command Center
                </h1>
                <p className="text-xs text-[#B5AEA3] flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Enterprise Intelligence Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="text-[#B5AEA3] hover:text-[#FDFBF7]
  hover:bg-[#B8956C]/10 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              {/* Live Indicator */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full
  bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border
  border-emerald-500/20"
              >
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div
                    className="absolute inset-0 w-2 h-2 rounded-full
  bg-emerald-500 animate-ping"
                  />
                </div>
                <span
                  className="text-xs font-medium
  text-emerald-400"
                >
                  LIVE
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-[#B5AEA3] hover:text-[#FDFBF7]
  hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative max-w-[1800px] mx-auto px-8 py-10">
          {error && (
            <div
              className="mb-8 p-5 bg-red-500/10 border border-red-500/20
  rounded-xl text-red-400 text-sm backdrop-blur-sm animate-slideDown"
            >
              {error}
            </div>
          )}

          {/* Hero Stats Grid - Staggered Animation */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
   mb-10"
          >
            <div className="animate-fadeInUp" style={{ animationDelay: "0ms" }}>
              <StatsCard
                label="Active Visitors"
                value={stats.activeVisitors}
                icon={Users}
                loading={loading}
                accentColor="text-emerald-400"
                trend={{ value: 0, label: "Last 5 minutes" }}
              />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
              <StatsCard
                label="Page Views Today"
                value={stats.pageViewsToday}
                icon={Eye}
                loading={loading}
                accentColor="text-blue-400"
              />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
              <StatsCard
                label="Unique Visitors"
                value={stats.uniqueVisitorsToday}
                icon={TrendingUp}
                loading={loading}
                accentColor="text-purple-400"
              />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: "300ms" }}>
              <StatsCard
                label="Leads Today"
                value={stats.leadsToday}
                icon={Zap}
                loading={loading}
                accentColor="text-[#B8956C]"
              />
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="animate-fadeInUp" style={{ animationDelay: "400ms" }}>
              <StatsCard
                label="Avg. Time on Site"
                value={stats.avgTimeOnSite}
                icon={Clock}
                loading={loading}
                accentColor="text-cyan-400"
              />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: "500ms" }}>
              <StatsCard
                label="Bounce Rate"
                value={`${stats.bounceRate}%`}
                icon={Activity}
                loading={loading}
                accentColor="text-amber-400"
              />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: "600ms" }}>
              <StatsCard
                label="Active Campaigns"
                value={stats.activeCampaigns}
                icon={BarChart3}
                loading={loading}
                accentColor="text-indigo-400"
              />
            </div>
          </div>

          {/* Live Visitor Map - Premium Card */}
          <div
            className="bg-gradient-to-br from-[#1A1915]/90 to-[#2D2A24]/90
  border border-[#B8956C]/20 rounded-2xl p-8 mb-10 backdrop-blur-xl shadow-2xl
  shadow-black/20 animate-fadeInUp"
            style={{ animationDelay: "700ms" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Map className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#FDFBF7]"
                  >
                    Live Visitor Map
                  </h3>
                  <p className="text-xs text-[#B5AEA3]">Real-time geographic distribution</p>
                </div>
              </div>
              <div
                className="flex items-center gap-2 text-xs
  text-emerald-400"
              >
                <div
                  className="w-2 h-2 rounded-full bg-emerald-500
  animate-pulse"
                />
                Streaming
              </div>
            </div>
            <LiveVisitorMap />
          </div>

          {/* Main Grid - Activity & Users */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Real-Time Activity Feed */}
            <div
              className="lg:col-span-2 bg-gradient-to-br from-[#1A1915]/90
  to-[#2D2A24]/90 border border-[#B8956C]/20 rounded-2xl p-8 backdrop-blur-xl
  shadow-2xl shadow-black/20 animate-fadeInUp"
              style={{ animationDelay: "800ms" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#B8956C]/10">
                    <Activity className="w-6 h-6 text-[#B8956C]" />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-display font-semibold
  text-[#FDFBF7]"
                    >
                      Real-Time Activity
                    </h3>
                    <p className="text-xs text-[#B5AEA3]">Live visitor events stream</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 text-xs
  text-emerald-400"
                >
                  <div
                    className="w-2 h-2 rounded-full bg-emerald-500
  animate-pulse"
                  />
                  Live
                </div>
              </div>
              <RealtimeFeed maxItems={8} />
            </div>

            {/* Active Users Panel */}
            <div
              className="bg-gradient-to-br from-[#1A1915]/90
  to-[#2D2A24]/90 border border-[#B8956C]/20 rounded-2xl p-8 backdrop-blur-xl
  shadow-2xl shadow-black/20 animate-fadeInUp"
              style={{ animationDelay: "900ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Users className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#FDFBF7]"
                  >
                    Active Users
                  </h3>
                  <p className="text-xs text-[#B5AEA3]">Currently browsing</p>
                </div>
              </div>
              <ActiveUsersPanel />
            </div>
          </div>

          {/* Visitor Timeline & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Visitor Timeline */}
            <div
              className="bg-gradient-to-br from-[#1A1915]/90
  to-[#2D2A24]/90 border border-[#B8956C]/20 rounded-2xl p-8 backdrop-blur-xl
  shadow-2xl shadow-black/20 animate-fadeInUp"
              style={{ animationDelay: "1000ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Route className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#FDFBF7]"
                  >
                    Visitor Journeys
                  </h3>
                  <p className="text-xs text-[#B5AEA3]">Session timelines</p>
                </div>
              </div>
              <VisitorTimeline />
            </div>

            {/* Alerts Panel */}
            <div
              className="bg-gradient-to-br from-[#1A1915]/90
  to-[#2D2A24]/90 border border-[#B8956C]/20 rounded-2xl p-8 backdrop-blur-xl
  shadow-2xl shadow-black/20 animate-fadeInUp"
              style={{ animationDelay: "1100ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Bell className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#FDFBF7]"
                  >
                    Alerts
                  </h3>
                  <p className="text-xs text-[#B5AEA3]">Important events</p>
                </div>
              </div>
              <AlertsPanel />
            </div>
          </div>

          {/* Bottom Grid - Pages & Visitors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Pages */}
            <div
              className="bg-gradient-to-br from-[#1A1915]/90
  to-[#2D2A24]/90 border border-[#B8956C]/20 rounded-2xl p-8 backdrop-blur-xl
  shadow-2xl shadow-black/20 animate-fadeInUp"
              style={{ animationDelay: "1200ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <FileText className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#FDFBF7]"
                  >
                    Top Pages Today
                  </h3>
                  <p className="text-xs text-[#B5AEA3]">Most viewed content</p>
                </div>
              </div>
              <TopPagesCard />
            </div>

            {/* Recent Visitors */}
            <div
              className="bg-gradient-to-br from-[#1A1915]/90
  to-[#2D2A24]/90 border border-[#B8956C]/20 rounded-2xl p-8 backdrop-blur-xl
  shadow-2xl shadow-black/20 animate-fadeInUp"
              style={{ animationDelay: "1300ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Users className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#FDFBF7]"
                  >
                    Recent Visitors
                  </h3>
                  <p className="text-xs text-[#B5AEA3]">Latest sessions</p>
                </div>
              </div>
              <RecentVisitorsCard />
            </div>
          </div>
        </main>
      </div>

      <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out both;
          }

          .animate-slideDown {
            animation: slideDown 0.4s ease-out;
          }
        `}</style>
    </>
  );
};

export default AdminDashboard;
