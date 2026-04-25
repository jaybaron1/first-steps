import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Session, User } from "@supabase/supabase-js";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { Loader2 } from "lucide-react";

interface PartnersRouteProps {
  children: React.ReactNode;
}

export interface PartnersAuthContext {
  user: User;
  session: Session;
  role: "admin" | "sdr";
  isAdmin: boolean;
}

const PartnersAuthContextRC = React.createContext<PartnersAuthContext | null>(null);

export const usePartnersAuth = (): PartnersAuthContext => {
  const ctx = React.useContext(PartnersAuthContextRC);
  if (!ctx) throw new Error("usePartnersAuth must be used inside <PartnersRoute>");
  return ctx;
};

const PartnersRoute: React.FC<PartnersRouteProps> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "sdr" | null>(null);

  useEffect(() => {
    let mounted = true;

    const resolveRole = async (uid: string): Promise<"admin" | "sdr" | null> => {
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
      return null;
    };

    const init = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (s?.user) {
        const r = await resolveRole(s.user.id);
        if (!mounted) return;
        setSession(s);
        setUser(s.user);
        setRole(r);
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
        return;
      }
      setSession(s);
      setUser(s.user);
      // defer role lookup
      setTimeout(async () => {
        if (!s.user) return;
        const r = await resolveRole(s.user.id);
        if (mounted) setRole(r);
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
            Your account is signed in but has not been granted access to the Partners CRM.
            Contact an administrator to request the SDR role.
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
      value={{ user, session, role, isAdmin: role === "admin" }}
    >
      {children}
    </PartnersAuthContextRC.Provider>
  );
};

export default PartnersRoute;
