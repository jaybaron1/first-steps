import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Session, User } from "@supabase/supabase-js";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { Loader2 } from "lucide-react";

export interface PortalAuthContext {
  user: User;
  session: Session;
  partnerId: string;
  partnerName: string;
  partnerSlug: string | null;
  isWhiteLabel: boolean;
}

const Ctx = React.createContext<PortalAuthContext | null>(null);
export const usePortalAuth = () => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("usePortalAuth must be used inside <PortalRoute>");
  return c;
};

const PortalRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [partner, setPartner] = useState<{
    id: string;
    name: string;
    slug: string | null;
    is_white_label: boolean;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    const resolve = async (uid: string) => {
      const { data } = await supabase
        .from("partners")
        .select("id, name, slug, is_white_label")
        .eq("portal_user_id", uid)
        .maybeSingle();
      if (mounted) setPartner(data ?? null);
    };

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      if (s?.user) await resolve(s.user.id);
      if (mounted) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!mounted) return;
      setSession(s);
      if (s?.user) {
        setTimeout(() => resolve(s.user.id), 0);
      } else {
        setPartner(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">No partner account</h1>
          <p className="text-sm text-slate-600 mb-6">
            You're signed in but not linked to a referral partner. Contact Jason
            (jason@galavanteer.com) to get set up.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-slate-700 underline underline-offset-4"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <Ctx.Provider
      value={{
        user: session.user,
        session,
        partnerId: partner.id,
        partnerName: partner.name,
        partnerSlug: partner.slug,
        isWhiteLabel: partner.is_white_label,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export default PortalRoute;
