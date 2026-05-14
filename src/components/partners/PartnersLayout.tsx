import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import { clearGhostPartnerId } from "@/lib/partnerGhost";
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
  Sparkles,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import GhostPartnerPicker from "@/components/partners/GhostPartnerPicker";

type NavItem = {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  show: (ctx: { isStaff: boolean; isAdmin: boolean; isPartner: boolean; isWhiteLabel: boolean }) => boolean;
};

const navItems: NavItem[] = [
  // Staff (admin + sdr) — full CRM
  { path: "/partners", label: "Dashboard", icon: LayoutDashboard, end: true, show: (c) => c.isStaff },
  { path: "/partners/clients", label: "Clients", icon: Users, show: (c) => c.isStaff },
  { path: "/partners/new", label: "Add Referral", icon: Plus, show: (c) => c.isStaff },
  { path: "/partners/directory", label: "Partners", icon: Briefcase, show: (c) => c.isStaff },
  { path: "/partners/appointments", label: "Appointments", icon: Calendar, show: (c) => c.isStaff },
  { path: "/partners/commissions", label: "Commissions", icon: Receipt, show: (c) => c.isStaff },
  { path: "/partners/activity", label: "Activity", icon: Activity, show: (c) => c.isStaff },
  { path: "/partners/users", label: "Team users", icon: ShieldCheck, show: (c) => c.isAdmin },

  // Partner-only items
  { path: "/partners/me", label: "Dashboard", icon: LayoutDashboard, end: true, show: (c) => c.isPartner },
  { path: "/partners/landing", label: "My Landing Page", icon: Sparkles, show: (c) => c.isPartner && c.isWhiteLabel },
];

const PartnersLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, isAdmin, isStaff, isPartner, isWhiteLabel, isGhosting, realRole, partnerName } = usePartnersAuth();
  const isRealAdmin = realRole === "admin";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/partners/login", { replace: true });
  };

  const exitGhost = () => {
    clearGhostPartnerId();
    navigate("/partners/directory", { replace: true });
  };

  const visible = navItems.filter((i) => i.show({ isStaff, isAdmin, isPartner, isWhiteLabel }));

  const titleLabel = isPartner ? "Partner Portal" : "Partners CRM";
  const roleLabel = isAdmin ? "Administrator" : isPartner ? "Partner" : "SDR";

  return (
    <>
      <Helmet>
        <title>{titleLabel} | Galavanteer</title>
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
                  {titleLabel}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Galavanteer
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {visible.map((item) => (
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

          {isAdmin && !isGhosting && (
            <div className="border-t border-slate-200 pt-3">
              <GhostPartnerPicker />
            </div>
          )}

          <div className="px-3 py-4 border-t border-slate-200">
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-medium text-slate-900 truncate">
                {user.email}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                {roleLabel} · {role}
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
          {isGhosting && (
            <div className="bg-amber-100 border-b border-amber-300 px-6 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-amber-900 text-sm">
                <Eye className="w-4 h-4" />
                <span>
                  Viewing as <span className="font-semibold">{partnerName}</span>. This is what they see in their portal.
                </span>
              </div>
              <button
                onClick={exitGhost}
                className="text-xs font-medium text-amber-900 hover:text-amber-950 underline underline-offset-2"
              >
                Exit ghost mode
              </button>
            </div>
          )}
          <div className="max-w-[1400px] mx-auto px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default PartnersLayout;
