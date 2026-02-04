import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  LogOut, 
  Users, 
  Activity, 
  BarChart3, 
  Globe,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin-portal');
  };

  const stats = [
    { label: 'Active Visitors', value: '—', icon: Users, color: 'text-emerald-400' },
    { label: 'Page Views Today', value: '—', icon: Activity, color: 'text-blue-400' },
    { label: 'Conversion Rate', value: '—', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Active Campaigns', value: '—', icon: Zap, color: 'text-amber-400' },
  ];

  return (
    <>
      <Helmet>
        <title>Command Center | Galavanteer Admin</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0b]">
        {/* Header */}
        <header className="border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg font-medium text-white">Command Center</h1>
                <p className="text-xs text-gray-500">Galavanteer Admin Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400">Connected</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white hover:bg-white/5"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/5 p-8 mb-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5" />
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Welcome to the Command Center
              </h2>
              <p className="text-gray-400 max-w-2xl">
                This is your central hub for monitoring visitor intelligence, tracking leads, 
                analyzing campaigns, and optimizing business growth. Phase 1 authentication is complete.
              </p>
            </div>
            <Globe className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 text-white/5" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-[#111113] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-gray-600">—</span>
                </div>
                <p className="text-3xl font-semibold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Placeholder Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real-Time Activity */}
            <div className="lg:col-span-2 bg-[#111113] border border-white/5 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Real-Time Activity</h3>
                <Activity className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex items-center justify-center h-48 text-gray-600">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Activity feed will appear here</p>
                  <p className="text-xs text-gray-700 mt-1">Phase 2: Visitor Tracking</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  disabled
                  className="w-full p-3 text-left text-sm text-gray-500 bg-white/5 rounded-lg border border-white/5 opacity-50 cursor-not-allowed"
                >
                  View Visitor Map (Coming Soon)
                </button>
                <button
                  disabled
                  className="w-full p-3 text-left text-sm text-gray-500 bg-white/5 rounded-lg border border-white/5 opacity-50 cursor-not-allowed"
                >
                  Lead Dashboard (Coming Soon)
                </button>
                <button
                  disabled
                  className="w-full p-3 text-left text-sm text-gray-500 bg-white/5 rounded-lg border border-white/5 opacity-50 cursor-not-allowed"
                >
                  Campaign Analytics (Coming Soon)
                </button>
              </div>
            </div>
          </div>

          {/* Phase Status */}
          <div className="mt-8 p-6 bg-[#111113] border border-white/5 rounded-xl">
            <h3 className="text-lg font-medium text-white mb-4">Build Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <span className="text-xs font-medium text-emerald-400">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Phase 1: Authentication Foundation</p>
                  <p className="text-xs text-gray-500">Login, logout, password reset, protected routes</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">2</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phase 2: Database Schema</p>
                  <p className="text-xs text-gray-600">Visitor sessions, page views, events, leads</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">3</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phase 3: Visitor Tracking System</p>
                  <p className="text-xs text-gray-600">Cookie-less fingerprinting, real-time collection</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
