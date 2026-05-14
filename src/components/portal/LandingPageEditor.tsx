import React, { useEffect, useState } from "react";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ExternalLink, Eye } from "lucide-react";

interface Props {
  partnerId: string;
  partnerSlug: string | null;
}

interface LandingFields {
  landing_headline: string;
  landing_subheadline: string;
  landing_bio: string;
  landing_bullets: string; // newline-separated in editor
  landing_photo_url: string;
  landing_logo_url: string;
  landing_testimonial: string;
  landing_accent_color: string;
  landing_published: boolean;
}

const blank: LandingFields = {
  landing_headline: "",
  landing_subheadline: "",
  landing_bio: "",
  landing_bullets: "",
  landing_photo_url: "",
  landing_logo_url: "",
  landing_testimonial: "",
  landing_accent_color: "#B8956C",
  landing_published: false,
};

const LandingPageEditor: React.FC<Props> = ({ partnerId, partnerSlug }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<LandingFields>(blank);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("partners")
        .select(
          "landing_headline, landing_subheadline, landing_bio, landing_bullets, landing_photo_url, landing_logo_url, landing_testimonial, landing_accent_color, landing_published"
        )
        .eq("id", partnerId)
        .maybeSingle();
      if (!mounted || !data) {
        setLoading(false);
        return;
      }
      const bulletArr = Array.isArray(data.landing_bullets)
        ? (data.landing_bullets as string[])
        : [];
      setForm({
        landing_headline: data.landing_headline || "",
        landing_subheadline: data.landing_subheadline || "",
        landing_bio: data.landing_bio || "",
        landing_bullets: bulletArr.join("\n"),
        landing_photo_url: data.landing_photo_url || "",
        landing_logo_url: data.landing_logo_url || "",
        landing_testimonial: data.landing_testimonial || "",
        landing_accent_color: data.landing_accent_color || "#B8956C",
        landing_published: !!data.landing_published,
      });
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [partnerId]);

  const save = async () => {
    setSaving(true);
    try {
      const bullets = form.landing_bullets
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const { error } = await supabase
        .from("partners")
        .update({
          landing_headline: form.landing_headline || null,
          landing_subheadline: form.landing_subheadline || null,
          landing_bio: form.landing_bio || null,
          landing_bullets: bullets,
          landing_photo_url: form.landing_photo_url || null,
          landing_logo_url: form.landing_logo_url || null,
          landing_testimonial: form.landing_testimonial || null,
          landing_accent_color: form.landing_accent_color || null,
          landing_published: form.landing_published,
        })
        .eq("id", partnerId);
      if (error) throw error;
      toast({ title: "Landing page saved" });
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 border-slate-200 shadow-none flex justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      </Card>
    );
  }

  const previewUrl = partnerSlug ? `/r/${partnerSlug}` : null;

  return (
    <Card className="border-slate-200 shadow-none overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Your landing page</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            What people see at <span className="font-mono">/r/{partnerSlug || "your-slug"}</span>
          </p>
        </div>
        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
          <div>
            <Label className="text-xs font-medium text-slate-900">Published</Label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              When off, /r/{partnerSlug || "your-slug"} silently redirects to the homepage.
            </p>
          </div>
          <Switch
            checked={form.landing_published}
            onCheckedChange={(v) => setForm((f) => ({ ...f, landing_published: v }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs text-slate-700">Headline</Label>
            <Input
              value={form.landing_headline}
              onChange={(e) => setForm((f) => ({ ...f, landing_headline: e.target.value }))}
              placeholder="Work with me — and your own private boardroom."
              className="h-10 border-slate-200"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs text-slate-700">Subheadline</Label>
            <Input
              value={form.landing_subheadline}
              onChange={(e) => setForm((f) => ({ ...f, landing_subheadline: e.target.value }))}
              placeholder="A seat at my table, plus 60+ AI advisors."
              className="h-10 border-slate-200"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs text-slate-700">About you</Label>
            <Textarea
              value={form.landing_bio}
              onChange={(e) => setForm((f) => ({ ...f, landing_bio: e.target.value }))}
              rows={4}
              placeholder="Two or three short paragraphs about who you are and how you work."
              className="border-slate-200 resize-none"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs text-slate-700">
              What clients get (one bullet per line)
            </Label>
            <Textarea
              value={form.landing_bullets}
              onChange={(e) => setForm((f) => ({ ...f, landing_bullets: e.target.value }))}
              rows={5}
              placeholder={"A seat at my table\nYour own AI Roundtable\nMonthly working sessions"}
              className="border-slate-200 resize-none font-sans"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-700">Photo URL</Label>
            <Input
              value={form.landing_photo_url}
              onChange={(e) => setForm((f) => ({ ...f, landing_photo_url: e.target.value }))}
              placeholder="https://…/headshot.jpg"
              className="h-10 border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-700">Logo URL</Label>
            <Input
              value={form.landing_logo_url}
              onChange={(e) => setForm((f) => ({ ...f, landing_logo_url: e.target.value }))}
              placeholder="https://…/logo.svg"
              className="h-10 border-slate-200"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs text-slate-700">Testimonial (optional)</Label>
            <Textarea
              value={form.landing_testimonial}
              onChange={(e) => setForm((f) => ({ ...f, landing_testimonial: e.target.value }))}
              rows={2}
              placeholder="One short quote from a client."
              className="border-slate-200 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-700">Accent color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={form.landing_accent_color}
                onChange={(e) =>
                  setForm((f) => ({ ...f, landing_accent_color: e.target.value }))
                }
                className="h-10 w-12 rounded border border-slate-200 cursor-pointer"
              />
              <Input
                value={form.landing_accent_color}
                onChange={(e) =>
                  setForm((f) => ({ ...f, landing_accent_color: e.target.value }))
                }
                className="h-10 border-slate-200 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button
            onClick={save}
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save landing page"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LandingPageEditor;
