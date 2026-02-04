import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import {
  Shield,
  LogOut,
  RefreshCw,
  Sparkles,
  LayoutDashboard,
  Users,
  UserCheck,
  FlaskConical,
  FileText,
  Server,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { path: '/admin/visitors', label: 'Visitors', icon: Users },
  { path: '/admin/leads', label: 'Leads', icon: UserCheck },
  { path: '/admin/campaigns', label: 'Campaigns', icon: FlaskConical },
  { path: '/admin/revenue', label: 'Revenue', icon: FileText },
  { path: '/admin/content', label: 'Content', icon: FileText },
  { path: '/admin/seo', label: 'SEO', icon: Search },
  { path: '/admin/system', label: 'System', icon: Server },
  { path: '/admin/security', label: 'Security', icon: ShieldCheck },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
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

      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#F9F6F0] to-[#F3EDE4]">
        {/* Ambient Background Effects */}
        <div className="fixed inset-0 opacity-30 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 bg-[#B8956C]/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B8956C]/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          />
        </div>

        {/* Header */}
        <header className="relative border-b border-[#B8956C]/20 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1800px] mx-auto px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4 animate-fadeIn">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#B8956C] to-[#9A7B58] flex items-center justify-center shadow-lg shadow-[#B8956C]/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold text-[#1A1915] tracking-tight">
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
                className="text-[#4A4640] hover:text-[#1A1915] hover:bg-[#F3EDE4]"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              {/* Live Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className="text-xs font-medium text-emerald-700">LIVE</span>
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

          {/* Tab Navigation */}
          <div className="max-w-[1800px] mx-auto px-8">
            <nav className="flex gap-1 -mb-px">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                      isActive
                        ? 'border-[#B8956C] text-[#B8956C]'
                        : 'border-transparent text-[#8C857A] hover:text-[#4A4640] hover:border-[#B8956C]/30'
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative max-w-[1800px] mx-auto px-8 py-10">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
