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
    description: "What The Roundtable is, what it does, what it costs.",
    defaults: {
      headline: "The Roundtable",
      tagline:
        "Your private boardroom, built inside your own ChatGPT. Bring any decision and the room convenes three to five advisors — pulled from a bench of sixty-plus senior operators, investors, and specialists matched to the exact problem on the table. You leave with a written brief sharp enough to act on, defend, or send.",
      bullets: [],
    },
  },
];

const DEFAULT_TAGLINE_SALES = TEMPLATES.find((t) => t.key === "sales")!.defaults.tagline;

const DEFAULT_MARGARITA_NOTE =
  "A named persona at the table from day one — sharp, candid, and tuned to the way your business actually moves.";

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
  const [imageStyle, setImageStyle] = useState<"photo" | "logo">("photo");
  const [level2Price, setLevel2Price] = useState<string>("");
  const [level3Price, setLevel3Price] = useState<string>("");
  const [level4Price, setLevel4Price] = useState<string>("");
  const [level5Price, setLevel5Price] = useState<string>("");
  const [showMargarita, setShowMargarita] = useState<boolean>(true);
  const [margaritaNote, setMargaritaNote] = useState<string>(DEFAULT_MARGARITA_NOTE);
  const [downloading, setDownloading] = useState(false);

  const flyerRef = useRef<HTMLDivElement>(null);

  // Hydration guard — don't auto-save until initial load completes
  const hydrated = useRef(false);

  // Load partner row + persisted flyer fields
  useEffect(() => {
    if (!partnerId) {
      setLoading(false);
      hydrated.current = true;
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("partners")
        .select(
          "name, landing_photo_url, landing_logo_url, landing_accent_color, flyer_setup_price, flyer_tier_prices, flyer_show_margarita, flyer_margarita_note, flyer_tagline"
        )
        .eq("id", partnerId)
        .maybeSingle();
      if (data) {
        if (data.name) setPartnerName(data.name);
        setPhotoUrl(data.landing_photo_url || data.landing_logo_url || null);
        if (data.landing_accent_color) setAccentColor(data.landing_accent_color);

        if (typeof data.flyer_setup_price === "number") setSetupPrice(data.flyer_setup_price);
        const tp = (data.flyer_tier_prices ?? {}) as Record<string, number>;
        if (tp.l2 != null) setLevel2Price(String(tp.l2));
        if (tp.l3 != null) setLevel3Price(String(tp.l3));
        if (tp.l4 != null) setLevel4Price(String(tp.l4));
        if (tp.l5 != null) setLevel5Price(String(tp.l5));
        if (typeof data.flyer_show_margarita === "boolean") setShowMargarita(data.flyer_show_margarita);
        if (data.flyer_margarita_note) setMargaritaNote(data.flyer_margarita_note);
        // Tagline only persists for the Sales Sheet template
        if (data.flyer_tagline) {
          // Will be applied if/when user is on the sales template
          (window as any).__galav_persisted_tagline = data.flyer_tagline;
        }
      }
      setLoading(false);
      // Defer hydrated flag so the initial state-setters don't trigger a save
      setTimeout(() => { hydrated.current = true; }, 0);
    })();
  }, [partnerId]);

  // Apply persisted Sales tagline when user switches to the sales template
  useEffect(() => {
    if (template === "sales") {
      const persisted = (window as any).__galav_persisted_tagline;
      if (persisted && typeof persisted === "string") setTagline(persisted);
    }
  }, [template]);

  // Auto-save flyer fields, debounced
  useEffect(() => {
    if (!hydrated.current || !partnerId) return;
    const handle = setTimeout(() => {
      const tier_prices: Record<string, number> = {};
      const l2 = Number(level2Price); if (l2 > 0) tier_prices.l2 = l2;
      const l3 = Number(level3Price); if (l3 > 0) tier_prices.l3 = l3;
      const l4 = Number(level4Price); if (l4 > 0) tier_prices.l4 = l4;
      const l5 = Number(level5Price); if (l5 > 0) tier_prices.l5 = l5;

      supabase
        .from("partners")
        .update({
          flyer_setup_price: setupPrice || 6000,
          flyer_tier_prices: tier_prices,
          flyer_show_margarita: showMargarita,
          flyer_margarita_note: margaritaNote || null,
          flyer_tagline: template === "sales" ? tagline : (window as any).__galav_persisted_tagline ?? null,
        })
        .eq("id", partnerId)
        .then(({ error }) => {
          if (error) toast.error("Couldn't save", { description: error.message });
          else if (template === "sales") (window as any).__galav_persisted_tagline = tagline;
        });
    }, 600);
    return () => clearTimeout(handle);
  }, [
    partnerId, setupPrice, level2Price, level3Price, level4Price, level5Price,
    showMargarita, margaritaNote, tagline, template,
  ]);

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
    imageStyle,
    levelPrices: {
      l2: Number(level2Price) || undefined,
      l3: Number(level3Price) || undefined,
      l4: Number(level4Price) || undefined,
      l5: Number(level5Price) || undefined,
    },
    showMargarita,
    margaritaNote,
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

      <SalesMaterialReference />

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

          <Field label="Image style" hint="Photo crops to a circle. Logo preserves aspect ratio for wide marks.">
            <div className="grid grid-cols-2 gap-2">
              {(["photo", "logo"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setImageStyle(style)}
                  className={`px-3 py-2 rounded-md border text-sm capitalize transition-colors ${
                    imageStyle === style
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
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

          {template !== "sales" && (
            <Field label="Bullets" hint="One per line.">
              <textarea
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
              />
            </Field>
          )}

          {template === "sales" && (
            <>
              <Field label="Margarita callout" hint="Every partner gets a 'Margarita sits in your room' line. Toggle off if not relevant.">
                <div className="flex items-center justify-between gap-3 px-3 py-2 border border-slate-200 rounded-md">
                  <span className="text-sm text-slate-700">
                    {showMargarita ? "Showing on flyer" : "Hidden"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowMargarita((v) => !v)}
                    role="switch"
                    aria-checked={showMargarita}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      showMargarita ? "bg-slate-900" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showMargarita ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </Field>

              {showMargarita && (
                <Field label="Margarita's note" hint="Prepopulated. Edit to your voice — Margarita can rewrite this for her own circles.">
                  <textarea
                    value={margaritaNote}
                    onChange={(e) => setMargaritaNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                  />
                </Field>
              )}

              <Field label="Workspace build price (USD)" hint="One-time setup. Shown in the Investment block.">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={setupPrice}
                  onChange={(e) => setSetupPrice(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </Field>

              <Field label="Tier prices (USD)" hint="Leave blank to show 'Quoted on request'.">
                <div className="space-y-2">
                  {[
                    { label: "2 — The Operating Frame", value: level2Price, set: setLevel2Price },
                    { label: "3 — Take A Seat",         value: level3Price, set: setLevel3Price },
                    { label: "4 — Future Me",           value: level4Price, set: setLevel4Price },
                    { label: "5 — Add a Voice",         value: level5Price, set: setLevel5Price },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 flex-1 truncate">{row.label}</span>
                      <input
                        type="number"
                        min={0}
                        step={50}
                        value={row.value}
                        onChange={(e) => row.set(e.target.value)}
                        placeholder="—"
                        className="w-28 px-2 py-1.5 border border-slate-200 rounded-md text-sm text-right"
                      />
                    </div>
                  ))}
                </div>
              </Field>
            </>
          )}

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
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Preview {template === "sales" ? "· US Letter (8.5 × 11)" : "· A4"}
          </div>
          <div className="border border-slate-200 rounded-md bg-slate-100 p-6 overflow-hidden flex justify-center">
            <div
              style={{
                width: template === "sales" ? "816px" : "794px",
                height: template === "sales" ? "1056px" : "1123px",
                transform: "scale(0.6)",
                transformOrigin: "top center",
                marginBottom: template === "sales" ? "-422px" : "-450px",
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
