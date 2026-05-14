import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Session, User } from "@supabase/supabase-js";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { Loader2 } from "lucide-react";
import { getGhostPartnerId } from "@/lib/partnerGhost";

interface PartnersRouteProps {
  children: React.ReactNode;
}

export type PartnersRole = "admin" | "sdr" | "partner";

export interface PartnersAuthContext {
  user: User;
  session: Session;
  role: PartnersRole;
  isAdmin: boolean;
  isStaff: boolean; // admin or sdr
  isPartner: boolean;
  // Populated when role === 'partner' (or when an admin is ghosting a partner)
  partnerId: string | null;
  partnerName: string | null;
  partnerSlug: string | null;
  isWhiteLabel: boolean;
  // Ghost-mode flags (admin viewing as partner)
  isGhosting: boolean;
  realRole: PartnersRole;
}

const PartnersAuthContextRC = React.createContext<PartnersAuthContext | null>(null);

export const usePartnersAuth = (): PartnersAuthContext => {
  const ctx = React.useContext(PartnersAuthContextRC);
  if (!ctx) throw new Error("usePartnersAuth must be used inside <PartnersRoute>");
  return ctx;
};

interface PartnerRow {
  id: string;
  name: string;
  slug: string | null;
  is_white_label: boolean | null;
}

const PartnersRoute: React.FC<PartnersRouteProps> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<PartnersRole | null>(null);
  const [partner, setPartner] = useState<PartnerRow | null>(null);
  const [ghostId, setGhostId] = useState<string | null>(() => getGhostPartnerId());
  const [ghostPartner, setGhostPartner] = useState<PartnerRow | null>(null);

  // React to ghost-id changes from anywhere in the app
  useEffect(() => {
    const onChange = () => setGhostId(getGhostPartnerId());
    window.addEventListener("partners-ghost-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("partners-ghost-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  // Load the ghosted partner row whenever an admin sets a ghost id
  useEffect(() => {
    let active = true;
    const isAdmin = role === "admin";
    if (!isAdmin || !ghostId) {
      setGhostPartner(null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("partners")
        .select("id, name, slug, is_white_label")
        .eq("id", ghostId)
        .maybeSingle();
      if (active) setGhostPartner(data ?? null);
    })();
    return () => {
      active = false;
    };
  }, [ghostId, role]);
  useEffect(() => {
    let mounted = true;

    const resolveRole = async (uid: string): Promise<PartnersRole | null> => {
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: uid,
        _role: "admin",
      });
      if (isAdmin) return "admin";
      const { data: isSdr } = await supabase.rpc("has_role", {
        _user_id: uid,
        _role: "sdr",
      });
      if (isSdr) return "sdr";
      const { data: isPartner } = await supabase.rpc("has_role", {
        _user_id: uid,
        _role: "partner",
      });
      if (isPartner) return "partner";
      return null;
    };

    const resolvePartner = async (uid: string): Promise<PartnerRow | null> => {
      const { data } = await supabase
        .from("partners")
        .select("id, name, slug, is_white_label")
        .eq("portal_user_id", uid)
        .maybeSingle();
      return data ?? null;
    };

    const init = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (s?.user) {
        const r = await resolveRole(s.user.id);
        let p: PartnerRow | null = null;
        if (r === "partner") {
          p = await resolvePartner(s.user.id);
        }
        if (!mounted) return;
        setSession(s);
        setUser(s.user);
        setRole(r);
        setPartner(p);
      }
      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, s) => {
      if (!mounted) return;
      if (!s) {
        setSession(null);
        setUser(null);
        setRole(null);
        setPartner(null);
        return;
      }
      setSession(s);
      setUser(s.user);
      setTimeout(async () => {
        if (!s.user) return;
        const r = await resolveRole(s.user.id);
        const p = r === "partner" ? await resolvePartner(s.user.id) : null;
        if (mounted) {
          setRole(r);
          setPartner(p);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Verifying access…</span>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/partners/login" state={{ from: location }} replace />;
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">No access</h1>
          <p className="text-sm text-slate-600 mb-6">
            Your account is signed in but has not been granted access. Contact an
            administrator to request access.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-slate-700 underline underline-offset-4 hover:text-slate-900"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (role === "partner" && !partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Account not linked</h1>
          <p className="text-sm text-slate-600 mb-6">
            You're signed in as a partner but no partner profile is linked to your account.
            Contact jason@galavanteer.com to get set up.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-slate-700 underline underline-offset-4 hover:text-slate-900"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <PartnersAuthContextRC.Provider
      value={{
        user,
        session,
        role,
        isAdmin: role === "admin",
        isStaff: role === "admin" || role === "sdr",
        isPartner: role === "partner",
        partnerId: partner?.id ?? null,
        partnerName: partner?.name ?? null,
        partnerSlug: partner?.slug ?? null,
        isWhiteLabel: !!partner?.is_white_label,
      }}
    >
      {children}
    </PartnersAuthContextRC.Provider>
  );
};

export default PartnersRoute;
