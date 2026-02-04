import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { adminSupabase as supabase } from '@/lib/adminBackend';
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
    { label: 'Active Visitors', value: '—', icon: Users, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Page Views Today', value: '—', icon: Activity, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Conversion Rate', value: '—', icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Active Campaigns', value: '—', icon: Zap, color: 'text-amber-600 dark:text-amber-400' },
  ];

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
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Connected</span>
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
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#B8956C]/10 via-[#B8956C]/5 to-transparent border border-[hsl(var(--admin-border))] p-8 mb-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5" />
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold text-[hsl(var(--admin-text))] font-display mb-2">
                Welcome to the Command Center
              </h2>
              <p className="text-[hsl(var(--admin-text-muted))] max-w-2xl">
                This is your central hub for monitoring visitor intelligence, tracking leads, 
                analyzing campaigns, and optimizing business growth. Phase 1 authentication is complete.
              </p>
            </div>
            <Globe className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 text-[hsl(var(--admin-text-subtle))]/10" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl p-6 hover:border-[hsl(var(--admin-border))] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-[hsl(var(--admin-text-subtle))]">—</span>
                </div>
                <p className="text-3xl font-semibold text-[hsl(var(--admin-text))] mb-1">{stat.value}</p>
                <p className="text-sm text-[hsl(var(--admin-text-muted))]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Placeholder Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real-Time Activity */}
            <div className="lg:col-span-2 bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-[hsl(var(--admin-text))]">Real-Time Activity</h3>
                <Activity className="w-5 h-5 text-[hsl(var(--admin-text-subtle))]" />
              </div>
              <div className="flex items-center justify-center h-48 text-[hsl(var(--admin-text-subtle))]">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Activity feed will appear here</p>
                  <p className="text-xs text-[hsl(var(--admin-text-subtle))] mt-1">Phase 2: Visitor Tracking</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl p-6">
              <h3 className="text-lg font-medium text-[hsl(var(--admin-text))] mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  disabled
                  className="w-full p-3 text-left text-sm text-[hsl(var(--admin-text-subtle))] bg-[hsl(var(--admin-bg-card))] rounded-lg border border-[hsl(var(--admin-border-subtle))] opacity-50 cursor-not-allowed"
                >
                  View Visitor Map (Coming Soon)
                </button>
                <button
                  disabled
                  className="w-full p-3 text-left text-sm text-[hsl(var(--admin-text-subtle))] bg-[hsl(var(--admin-bg-card))] rounded-lg border border-[hsl(var(--admin-border-subtle))] opacity-50 cursor-not-allowed"
                >
                  Lead Dashboard (Coming Soon)
                </button>
                <button
                  disabled
                  className="w-full p-3 text-left text-sm text-[hsl(var(--admin-text-subtle))] bg-[hsl(var(--admin-bg-card))] rounded-lg border border-[hsl(var(--admin-border-subtle))] opacity-50 cursor-not-allowed"
                >
                  Campaign Analytics (Coming Soon)
                </button>
              </div>
            </div>
          </div>

          {/* Phase Status */}
          <div className="mt-8 p-6 bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-xl">
            <h3 className="text-lg font-medium text-[hsl(var(--admin-text))] mb-4">Build Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--admin-text))]">Phase 1: Authentication Foundation</p>
                  <p className="text-xs text-[hsl(var(--admin-text-subtle))]">Login, logout, password reset, protected routes</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--admin-bg-card))] border border-[hsl(var(--admin-border))] flex items-center justify-center">
                  <span className="text-xs font-medium text-[hsl(var(--admin-text-subtle))]">2</span>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--admin-text-muted))]">Phase 2: Database Schema</p>
                  <p className="text-xs text-[hsl(var(--admin-text-subtle))]">Visitor sessions, page views, events, leads</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--admin-bg-card))] border border-[hsl(var(--admin-border))] flex items-center justify-center">
                  <span className="text-xs font-medium text-[hsl(var(--admin-text-subtle))]">3</span>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--admin-text-muted))]">Phase 3: Visitor Tracking System</p>
                  <p className="text-xs text-[hsl(var(--admin-text-subtle))]">Cookie-less fingerprinting, real-time collection</p>
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
