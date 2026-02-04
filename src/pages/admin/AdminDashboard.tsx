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
  Globe,
  MousePointerClick,
  Filter,
  FlaskConical,
  UserCheck,
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
import GeoHeatMap from "@/components/admin/GeoHeatMap";
import LeadsPanel from "@/components/admin/LeadsPanel";
import ConversionFunnel from "@/components/admin/ConversionFunnel";
import CTAPerformance from "@/components/admin/CTAPerformance";
import ABTestingPanel from "@/components/admin/ABTestingPanel";
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
        className="min-h-screen bg-gradient-to-br from-[#FDFBF7]
  via-[#F9F6F0] to-[#F3EDE4]"
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
          className="relative border-b border-[#B8956C]/20 bg-white/80
  backdrop-blur-xl sticky top-0 z-50 shadow-sm"
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-xl font-display font-semibold
  text-[#1A1915] tracking-tight"
                >
                  Command Center
                </h1>
                <p className="text-xs text-[#8C857A] flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-[#B8956C]" />
                  Enterprise Intelligence Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="text-[#4A4640] hover:text-[#1A1915]
  hover:bg-[#F3EDE4]"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              {/* Live Indicator */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full
  bg-emerald-50 border border-emerald-200"
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
  text-emerald-700"
                >
                  LIVE
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-[#4A4640] hover:text-red-600 hover:bg-red-50"
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
              className="mb-8 p-5 bg-red-50 border border-red-200
  rounded-xl text-red-800 text-sm animate-slideDown"
            >
              {error}
            </div>
          )}

          {/* Hero Stats Grid */}
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
                accentColor="text-emerald-600"
                trend={{ value: 0, label: "Last 5 minutes" }}
              />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
              <StatsCard
                label="Page Views Today"
                value={stats.pageViewsToday}
                icon={Eye}
                loading={loading}
                accentColor="text-blue-600"
              />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
              <StatsCard
                label="Unique Visitors"
                value={stats.uniqueVisitorsToday}
                icon={TrendingUp}
                loading={loading}
                accentColor="text-purple-600"
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
                accentColor="text-cyan-600"
              />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: "500ms" }}>
              <StatsCard
                label="Bounce Rate"
                value={`${stats.bounceRate}%`}
                icon={Activity}
                loading={loading}
                accentColor="text-amber-600"
              />
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: "600ms" }}>
              <StatsCard
                label="Active Campaigns"
                value={stats.activeCampaigns}
                icon={BarChart3}
                loading={loading}
                accentColor="text-indigo-600"
              />
            </div>
          </div>

          {/* Live Visitor Map */}
          <div
            className="bg-white border border-[#B8956C]/20 rounded-2xl p-8
  mb-10 shadow-lg animate-fadeInUp"
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
  text-[#1A1915]"
                  >
                    Live Visitor Map
                  </h3>
                  <p className="text-xs text-[#8C857A]">Real-time geographic distribution</p>
                </div>
              </div>
              <div
                className="flex items-center gap-2 text-xs text-emerald-700
   bg-emerald-50 px-3 py-1.5 rounded-full"
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

          {/* Geographic Distribution Heat Map */}
          <div
            className="bg-white border border-[#B8956C]/20 rounded-2xl p-8
  mb-10 shadow-lg animate-fadeInUp"
            style={{ animationDelay: "750ms" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Globe className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#1A1915]"
                  >
                    Geographic Distribution
                  </h3>
                  <p className="text-xs text-[#8C857A]">Visitor density by country</p>
                </div>
              </div>
            </div>
            <GeoHeatMap />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Real-Time Activity */}
            <div
              className="lg:col-span-2 bg-white border border-[#B8956C]/20
  rounded-2xl p-8 shadow-lg animate-fadeInUp"
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
  text-[#1A1915]"
                    >
                      Real-Time Activity
                    </h3>
                    <p className="text-xs text-[#8C857A]">Live visitor events</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 text-xs
  text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full"
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

            {/* Active Users */}
            <div
              className="bg-white border border-[#B8956C]/20 rounded-2xl
  p-8 shadow-lg animate-fadeInUp"
              style={{ animationDelay: "900ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Users className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#1A1915]"
                  >
                    Active Users
                  </h3>
                  <p className="text-xs text-[#8C857A]">Currently browsing</p>
                </div>
              </div>
              <ActiveUsersPanel />
            </div>
          </div>

          {/* Timeline & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div
              className="bg-white border border-[#B8956C]/20 rounded-2xl
  p-8 shadow-lg animate-fadeInUp"
              style={{ animationDelay: "1000ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Route className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#1A1915]"
                  >
                    Visitor Journeys
                  </h3>
                  <p className="text-xs text-[#8C857A]">Session timelines</p>
                </div>
              </div>
              <VisitorTimeline />
            </div>

            <div
              className="bg-white border border-[#B8956C]/20 rounded-2xl
  p-8 shadow-lg animate-fadeInUp"
              style={{ animationDelay: "1100ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Bell className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#1A1915]"
                  >
                    Alerts
                  </h3>
                  <p className="text-xs text-[#8C857A]">Important events</p>
                </div>
              </div>
              <AlertsPanel />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div
              className="bg-white border border-[#B8956C]/20 rounded-2xl
  p-8 shadow-lg animate-fadeInUp"
              style={{ animationDelay: "1200ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <FileText className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#1A1915]"
                  >
                    Top Pages Today
                  </h3>
                  <p className="text-xs text-[#8C857A]">Most viewed</p>
                </div>
              </div>
              <TopPagesCard />
            </div>

            <div
              className="bg-white border border-[#B8956C]/20 rounded-2xl
  p-8 shadow-lg animate-fadeInUp"
              style={{ animationDelay: "1300ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Users className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#1A1915]"
                  >
                    Recent Visitors
                  </h3>
                  <p className="text-xs text-[#8C857A]">Latest sessions</p>
                </div>
              </div>
              <RecentVisitorsCard />
            </div>
          </div>

          {/* Leads Management Section */}
          <div
            className="bg-white border border-[#B8956C]/20 rounded-2xl p-8
  mb-10 shadow-lg animate-fadeInUp"
            style={{ animationDelay: "1400ms" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <UserCheck className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#1A1915]"
                  >
                    Lead Management
                  </h3>
                  <p className="text-xs text-[#8C857A]">Captured leads and conversions</p>
                </div>
              </div>
            </div>
            <LeadsPanel />
          </div>

          {/* Conversion Funnel Section */}
          <div
            className="bg-white border border-[#B8956C]/20 rounded-2xl p-8
  mb-10 shadow-lg animate-fadeInUp"
            style={{ animationDelay: "1500ms" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <Filter className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#1A1915]"
                  >
                    Conversion Funnel
                  </h3>
                  <p className="text-xs text-[#8C857A]">Visitor journey analysis</p>
                </div>
              </div>
            </div>
            <ConversionFunnel />
          </div>

          {/* CTA Performance Section */}
          <div
            className="bg-white border border-[#B8956C]/20 rounded-2xl p-8
  mb-10 shadow-lg animate-fadeInUp"
            style={{ animationDelay: "1600ms" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <MousePointerClick className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#1A1915]"
                  >
                    CTA Performance
                  </h3>
                  <p className="text-xs text-[#8C857A]">Button click analytics</p>
                </div>
              </div>
            </div>
            <CTAPerformance />
          </div>

          {/* A/B Testing Section */}
          <div
            className="bg-white border border-[#B8956C]/20 rounded-2xl p-8
  shadow-lg animate-fadeInUp"
            style={{ animationDelay: "1700ms" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#B8956C]/10">
                  <FlaskConical className="w-6 h-6 text-[#B8956C]" />
                </div>
                <div>
                  <h3
                    className="text-lg font-display font-semibold
  text-[#1A1915]"
                  >
                    A/B Testing
                  </h3>
                  <p className="text-xs text-[#8C857A]">Experiment management</p>
                </div>
              </div>
            </div>
            <ABTestingPanel />
          </div>
        </main>
      </div>

      <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
          .animate-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
          .animate-slideDown { animation: slideDown 0.4s ease-out; }
        `}</style>
    </>
  );
};

export default AdminDashboard;
