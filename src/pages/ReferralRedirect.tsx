import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { trackingSupabase as supabase } from "@/lib/trackingBackend";
import { setReferralPartner } from "@/lib/referralAttribution";
import { Loader2 } from "lucide-react";
import PartnerLandingPage from "./PartnerLandingPage";

type LandingPartner = React.ComponentProps<typeof PartnerLandingPage>["partner"];

const ReferralRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const [destination, setDestination] = useState<string | null>(null);
  const [landing, setLanding] = useState<(LandingPartner & {
    is_white_label: boolean | null;
    landing_published: boolean | null;
  }) | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;

    (async () => {
      const { data: partner } = await supabase
        .from("partners")
        .select(
          "id, name, slug, status, website, is_white_label, landing_published, landing_headline, landing_subheadline, landing_bio, landing_bullets, landing_photo_url, landing_logo_url, landing_testimonial, landing_accent_color"
        )
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
      supabase
        .from("partner_referral_clicks")
        .insert({
          partner_id: partner.id,
          slug_used: partner.slug || slug,
          session_id: sessionId,
          landing_url: window.location.href,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        })
        .then(() => {});

      // White-label + published → render co-branded landing page
      if (partner.is_white_label && partner.landing_published) {
        const refSlug = partner.slug || slug;
        try {
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}?ref=${encodeURIComponent(refSlug)}`
          );
        } catch {
          // no-op
        }
        setLanding(partner as typeof landing);
        return;
      }

      // Otherwise: silent redirect with ?ref= tag
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
  if (landing) return <PartnerLandingPage partner={landing} />;
  if (destination) return <Navigate to={destination} replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
    </div>
  );
};

export default ReferralRedirect;
