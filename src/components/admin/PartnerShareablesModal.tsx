import React, { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { Partner } from "@/hooks/usePartnersCRM";
import { Copy, Download, Loader2, ExternalLink } from "lucide-react";

interface Props {
  partner: Partner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);

const PROD_BASE = "https://galavanteer.com";

const PartnerShareablesModal: React.FC<Props> = ({ partner, open, onOpenChange }) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [slug, setSlug] = useState(partner?.slug || "");
  const [website, setWebsite] = useState(partner?.website || "");
  const [whiteLabel, setWhiteLabel] = useState(partner?.is_white_label || false);
  const [saving, setSaving] = useState(false);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);

  useEffect(() => {
    if (!partner) return;
    setSlug(partner.slug || slugify(partner.name));
    setWebsite(partner.website || "");
    setWhiteLabel(partner.is_white_label || false);
  }, [partner]);

  const fullUrl = useMemo(
    () => (slug ? `${PROD_BASE}/r/${slug}` : ""),
    [slug],
  );

  // Render QR
  useEffect(() => {
    if (!fullUrl) {
      setPngUrl(null);
      setSvgString(null);
      return;
    }
    QRCode.toDataURL(fullUrl, {
      width: 1024,
      margin: 2,
      color: { dark: "#1A1915", light: "#FFFFFF" },
      errorCorrectionLevel: "H",
    }).then(setPngUrl);
    QRCode.toString(fullUrl, {
      type: "svg",
      margin: 2,
      color: { dark: "#1A1915", light: "#FFFFFF" },
      errorCorrectionLevel: "H",
    }).then(setSvgString);
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, fullUrl, {
        width: 220,
        margin: 1,
        color: { dark: "#1A1915", light: "#FFFFFF" },
        errorCorrectionLevel: "H",
      });
    }
  }, [fullUrl]);

  const save = async () => {
    if (!partner) return;
    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      toast({ title: "Slug required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("partners")
        .update({
          slug: cleanSlug,
          website: website || null,
          is_white_label: whiteLabel,
        })
        .eq("id", partner.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["partners-crm"] });
      toast({ title: "Saved" });
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

  const copyLink = async () => {
    if (!fullUrl) return;
    await navigator.clipboard.writeText(fullUrl);
    toast({ title: "Link copied" });
  };

  const downloadPng = () => {
    if (!pngUrl || !partner) return;
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `galavanteer-qr-${slug}.png`;
    a.click();
  };

  const downloadSvg = () => {
    if (!svgString || !partner) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `galavanteer-qr-${slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Shareables — {partner.name}</DialogTitle>
          <DialogDescription>
            Their referral link, QR code, and embed snippet. Anyone who clicks the link is
            attributed to this partner permanently (until another partner link overwrites it).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700">Slug (URL handle)</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="margarita"
                className="h-10 border-slate-200 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700">Their website</Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://margaritaxistris.com"
                className="h-10 border-slate-200"
              />
            </div>
            <div className="col-span-2 flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
              <div>
                <Label className="text-xs font-medium text-slate-900">
                  White-label personality
                </Label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Partner is featured as a persona inside their own boardroom (e.g. Margarita).
                </p>
              </div>
              <Switch checked={whiteLabel} onCheckedChange={setWhiteLabel} />
            </div>
          </div>

          <Button
            onClick={save}
            disabled={saving}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save settings"}
          </Button>

          <div className="border-t border-slate-200 pt-5 grid grid-cols-[220px_1fr] gap-5 items-start">
            <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center justify-center">
              <canvas ref={canvasRef} />
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">
                  Referral link
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    readOnly
                    value={fullUrl}
                    className="h-9 border-slate-200 font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    onClick={copyLink}
                    className="h-9 border-slate-200"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-9 px-3 border border-slate-200 rounded-md text-slate-600 hover:text-slate-900"
                    title="Open"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={downloadPng}
                  className="flex-1 h-9 border-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  PNG (1024px)
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadSvg}
                  className="flex-1 h-9 border-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  SVG (vector)
                </Button>
              </div>

              <div>
                <Label className="text-[11px] uppercase tracking-wider text-slate-500">
                  Embed snippet
                </Label>
                <textarea
                  readOnly
                  value={`<a href="${fullUrl}">Book with Galavanteer</a>`}
                  className="mt-1.5 w-full text-[11px] font-mono p-2 border border-slate-200 rounded-md bg-slate-50 resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerShareablesModal;
