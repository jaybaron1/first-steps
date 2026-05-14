import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { z } from "zod";
import { trackingSupabase as supabase } from "@/lib/trackingBackend";
import { setReferralPartner } from "@/lib/referralAttribution";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";

type Partner = {
  id: string;
  name: string;
  slug: string | null;
  landing_photo_url: string | null;
  landing_accent_color: string | null;
};

const FormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const PartnerReferralCapture: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("partners")
        .select("id, name, slug, landing_photo_url, landing_accent_color")
        .eq("slug", slug.toLowerCase())
        .maybeSingle();
      if (cancelled) return;
      if (!data) {
        setNotFound(true);
        return;
      }
      setPartner(data as Partner);
      setReferralPartner(data.id);
      const sessionId = sessionStorage.getItem("galavanteer_session_id");
      supabase
        .from("partner_referral_clicks")
        .insert({
          partner_id: data.id,
          slug_used: data.slug || slug,
          session_id: sessionId,
          landing_url: window.location.href,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        })
        .then(() => {});
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;
    const parsed = FormSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) fe[issue.path[0] as string] = issue.message;
      setErrors(fe);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const sessionId = sessionStorage.getItem("galavanteer_session_id");
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
      source: "partner_qr",
      status: "new",
      referred_by_partner_id: partner.id,
      referral_session_id: sessionId,
    });
    setSubmitting(false);
    if (error) {
      setErrors({ form: "Something went wrong. Please try again." });
      return;
    }
    setSubmitted(true);
  };

  if (notFound) return <Navigate to="/" replace />;

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  const accent = partner.landing_accent_color || "#0f172a";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 pt-6 pb-5 border-b border-slate-100 flex items-center gap-4">
            {partner.landing_photo_url ? (
              <img
                src={partner.landing_photo_url}
                alt={partner.name}
                className="w-14 h-14 rounded-full object-cover border-2"
                style={{ borderColor: accent }}
              />
            ) : (
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: accent }}
              >
                {partner.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Referred by</p>
              <p className="text-lg font-semibold text-slate-900 leading-tight">{partner.name}</p>
            </div>
          </div>

          {submitted ? (
            <div className="px-6 py-10 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: accent }}
              >
                <Check className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900 mb-2">You're on the list</h1>
              <p className="text-sm text-slate-600">
                {partner.name} has been notified and will be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900 mb-1">
                  Request an introduction
                </h1>
                <p className="text-sm text-slate-600">
                  Drop your details and {partner.name} will reach out personally.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  required
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                  required
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone <span className="text-slate-400 font-normal">(optional)</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={40}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">What are you hoping to solve? <span className="text-slate-400 font-normal">(optional)</span></Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={1000}
                  rows={3}
                />
              </div>

              {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full text-white"
                style={{ backgroundColor: accent }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request an introduction"}
              </Button>

              <p className="text-[11px] text-slate-400 text-center pt-2">
                By submitting, you agree to be contacted by Galavanteer about this referral.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerReferralCapture;
