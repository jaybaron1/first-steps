import React, { useEffect, useMemo, useRef, useState } from "react";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import { buildReferralUrl, buildReferralCaptureUrl, exportFlyerToPdf, generateQrDataUrl } from "@/lib/partnerFlyer";
import FlyerRoundtableIntro, { type FlyerData } from "@/components/partners/marketing/FlyerRoundtableIntro";
import FlyerFounderOffer from "@/components/partners/marketing/FlyerFounderOffer";
import FlyerEventInvite from "@/components/partners/marketing/FlyerEventInvite";
import FlyerSalesSheet from "@/components/partners/marketing/FlyerSalesSheet";
import SalesMaterialReference from "@/components/partners/marketing/SalesMaterialReference";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";

type TemplateKey = "intro" | "founder" | "event" | "sales";

const TEMPLATES: { key: TemplateKey; label: string; description: string; defaults: { headline: string; tagline: string; bullets: string[] } }[] = [
  {
    key: "intro",
    label: "Roundtable Intro",
    description: "Editorial one-pager introducing The Roundtable.",
    defaults: {
      headline: "An invitation to The Roundtable.",
      tagline: "A private ChatGPT workspace built around the operators, founders, and investors I trust.",
      bullets: [
        "A private workspace, calibrated to how you actually think.",
        "No prompts to memorize. No agents to babysit.",
        "Quietly compounding leverage, conversation by conversation.",
      ],
    },
  },
  {
    key: "founder",
    label: "Founder Offer",
    description: "Bold dark layout for high-intent intros.",
    defaults: {
      headline: "Stop renting intelligence. Build your own.",
      tagline: "A fully built private ChatGPT workspace, designed around your operating model in one working session.",
      bullets: [
        "1:1 build session with the team that designed The Roundtable.",
        "Your context, your voice, your decisions — privately.",
        "Live in days, not quarters.",
      ],
    },
  },
  {
    key: "event",
    label: "Event Invite",
    description: "Minimal, QR-led layout for dinners and salons.",
    defaults: {
      headline: "An evening at The Roundtable.",
      tagline: "A small, off-the-record gathering for operators thinking carefully about AI.",
      bullets: [
        "Curated guest list",
        "No slides. No pitches. No press.",
        "Scan to request a seat.",
      ],
    },
  },
  {
    key: "sales",
    label: "Sales Sheet",
    description: "What it is, how it works, what it costs. The full pitch on one page.",
    defaults: {
      headline: "The Roundtable, built for you.",
      tagline: "A private ChatGPT workspace, calibrated to how you actually think and decide. No prompts to memorize. No agents to babysit. Quiet leverage that compounds, conversation by conversation.",
      bullets: [],
    },
  },
];

const DEFAULT_ACCENT = "#B8956C";

const PartnersMarketingPage: React.FC = () => {
  const { partnerId, partnerName: ctxName, partnerSlug } = usePartnersAuth();
  const [loading, setLoading] = useState(true);
  const [partnerName, setPartnerName] = useState<string>(ctxName || "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string>(DEFAULT_ACCENT);
  const [template, setTemplate] = useState<TemplateKey>("intro");
  const [headline, setHeadline] = useState(TEMPLATES[0].defaults.headline);
  const [tagline, setTagline] = useState(TEMPLATES[0].defaults.tagline);
  const [bulletsText, setBulletsText] = useState(TEMPLATES[0].defaults.bullets.join("\n"));
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [setupPrice, setSetupPrice] = useState<number>(6000);
  const [downloading, setDownloading] = useState(false);

  const flyerRef = useRef<HTMLDivElement>(null);

  // Load partner row
  useEffect(() => {
    if (!partnerId) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("partners")
        .select("name, landing_photo_url, landing_logo_url, landing_accent_color")
        .eq("id", partnerId)
        .maybeSingle();
      if (data) {
        if (data.name) setPartnerName(data.name);
        setPhotoUrl(data.landing_photo_url || data.landing_logo_url || null);
        if (data.landing_accent_color) setAccentColor(data.landing_accent_color);
      }
      setLoading(false);
    })();
  }, [partnerId]);

  const referralUrl = useMemo(() => buildReferralUrl(partnerSlug), [partnerSlug]);
  const qrTargetUrl = useMemo(() => buildReferralCaptureUrl(partnerSlug), [partnerSlug]);

  // Regenerate QR when URL or accent changes
  useEffect(() => {
    let cancelled = false;
    generateQrDataUrl(qrTargetUrl, "#0f172a")
      .then((url) => { if (!cancelled) setQrDataUrl(url); })
      .catch(() => { if (!cancelled) setQrDataUrl(null); });
    return () => { cancelled = true; };
  }, [qrTargetUrl]);

  // When template changes, swap defaults (only if user hasn't customized — for simplicity, always swap)
  const handleTemplateChange = (key: TemplateKey) => {
    setTemplate(key);
    const t = TEMPLATES.find((x) => x.key === key)!;
    setHeadline(t.defaults.headline);
    setTagline(t.defaults.tagline);
    setBulletsText(t.defaults.bullets.join("\n"));
  };

  const data: FlyerData = {
    partnerName: partnerName || "Your Name",
    photoUrl,
    headline,
    tagline,
    bullets: bulletsText.split("\n").map((s) => s.trim()).filter(Boolean),
    accentColor,
    referralUrl,
    qrDataUrl,
    setupPrice,
  };

  const handleDownload = async () => {
    if (!flyerRef.current) return;
    setDownloading(true);
    try {
      const slug = partnerSlug || "partner";
      await exportFlyerToPdf(flyerRef.current, `roundtable-${template}-${slug}.pdf`);
      toast.success("Flyer downloaded");
    } catch (e: any) {
      toast.error("Download failed", { description: e?.message });
    } finally {
      setDownloading(false);
    }
  };

  const renderFlyer = (innerRef: React.Ref<HTMLDivElement>) => {
    if (template === "intro") return <FlyerRoundtableIntro data={data} innerRef={innerRef} />;
    if (template === "founder") return <FlyerFounderOffer data={data} innerRef={innerRef} />;
    if (template === "sales") return <FlyerSalesSheet data={data} innerRef={innerRef} />;
    return <FlyerEventInvite data={data} innerRef={innerRef} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Marketing assets</h1>
        <p className="text-sm text-slate-500 mt-1">
          Personalize a one-pager and download a print-ready PDF to share with your circle.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
        {/* Left: form */}
        <div className="space-y-6">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Template</label>
            <div className="mt-2 space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleTemplateChange(t.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-md border text-sm transition-colors ${
                    template === t.key
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div className="font-medium">{t.label}</div>
                  <div className={`text-xs mt-0.5 ${template === t.key ? "text-slate-300" : "text-slate-500"}`}>
                    {t.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Field label="Your name">
            <input
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
            />
          </Field>

          <Field label="Photo / logo URL" hint="Defaults to your landing-page photo. Paste any public image URL.">
            <input
              value={photoUrl || ""}
              onChange={(e) => setPhotoUrl(e.target.value || null)}
              placeholder="https://…"
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
            />
          </Field>

          <Field label="Headline">
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
            />
          </Field>

          <Field label="Tagline">
            <textarea
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
            />
          </Field>

          <Field label="Bullets" hint="One per line.">
            <textarea
              value={bulletsText}
              onChange={(e) => setBulletsText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
            />
          </Field>

          <Field label="Accent color">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-9 w-12 border border-slate-200 rounded-md cursor-pointer"
              />
              <input
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm font-mono"
              />
            </div>
          </Field>

          <Field label="Referral link" hint="Auto-generated from your slug.">
            <input
              value={referralUrl}
              readOnly
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 text-slate-600"
            />
          </Field>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PDF
          </button>
        </div>

        {/* Right: preview */}
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Preview</div>
          <div className="border border-slate-200 rounded-md bg-slate-100 p-6 overflow-hidden flex justify-center">
            <div
              style={{
                width: "794px",
                height: "1123px",
                transform: "scale(0.6)",
                transformOrigin: "top center",
                marginBottom: "-450px",
              }}
            >
              {renderFlyer(flyerRef)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div>
    <label className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</label>
    <div className="mt-1.5">{children}</div>
    {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

export default PartnersMarketingPage;
