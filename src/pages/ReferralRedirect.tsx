import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { trackingSupabase as supabase } from "@/lib/trackingBackend";
import { setReferralPartner } from "@/lib/referralAttribution";
import { Loader2 } from "lucide-react";

const ReferralRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const [destination, setDestination] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;

    (async () => {
      const { data: partner } = await supabase
        .from("partners")
        .select("id, slug, status")
        .eq("slug", slug.toLowerCase())
        .maybeSingle();

      if (cancelled) return;

      if (!partner) {
        setNotFound(true);
        return;
      }

      setReferralPartner(partner.id);

      // Log click (fire-and-forget)
      const sessionId = sessionStorage.getItem("galavanteer_session_id");
      supabase.from("partner_referral_clicks").insert({
        partner_id: partner.id,
        slug_used: partner.slug || slug,
        session_id: sessionId,
        landing_url: window.location.href,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      }).then(() => {});

      const to = params.get("to");
      const target = to && to.startsWith("/") ? to : "/";
      const sep = target.includes("?") ? "&" : "?";
      setDestination(`${target}${sep}ref=${encodeURIComponent(partner.slug || slug)}`);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, params]);

  if (notFound) return <Navigate to="/" replace />;
  if (destination) return <Navigate to={destination} replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
    </div>
  );
};

export default ReferralRedirect;
