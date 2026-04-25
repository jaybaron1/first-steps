import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import {
  LayoutDashboard,
  Users,
  Plus,
  Briefcase,
  Receipt,
  Activity,
  LogOut,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/partners", label: "Dashboard", icon: LayoutDashboard, end: true, adminOnly: false },
  { path: "/partners/clients", label: "Clients", icon: Users, adminOnly: false },
  { path: "/partners/new", label: "Add Referral", icon: Plus, adminOnly: false },
  { path: "/partners/directory", label: "Partners", icon: Briefcase, adminOnly: false },
  { path: "/partners/appointments", label: "Appointments", icon: Calendar, adminOnly: false },
  { path: "/partners/commissions", label: "Commissions", icon: Receipt, adminOnly: false },
  { path: "/partners/activity", label: "Activity", icon: Activity, adminOnly: false },
  { path: "/partners/users", label: "Team users", icon: ShieldCheck, adminOnly: true },
];

const PartnersLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, isAdmin } = usePartnersAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/partners/login", { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Partners CRM | Galavanteer</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 bg-slate-50/50 flex flex-col">
          <div className="px-6 py-6 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
                <span className="text-white font-serif text-sm">G</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 tracking-tight">
                  Partners CRM
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Galavanteer
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.filter((item) => !item.adminOnly || isAdmin).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-slate-200">
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-medium text-slate-900 truncate">
                {user.email}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                {isAdmin ? "Administrator" : "SDR"} · {role}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default PartnersLayout;
