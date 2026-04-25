import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type RateRow = {
  id?: string;
  user_id: string;
  user_email?: string | null;
  rate_build: number;
  rate_upgrade: number;
  rate_persona_addition: number;
  rate_rebuild: number;
  rate_light_reactivation: number;
  rate_refresh: number;
  mrr_commissionable: boolean;
  rate_mrr: number;
  pricing_floor: number;
  notes?: string | null;
};

const DEFAULTS: Omit<RateRow, "user_id" | "user_email"> = {
  rate_build: 0.20, rate_upgrade: 0.20, rate_persona_addition: 0.20,
  rate_rebuild: 0.20, rate_light_reactivation: 0.10, rate_refresh: 0.15,
  mrr_commissionable: false, rate_mrr: 0.00, pricing_floor: 1000,
};

interface Props {
  user: { id: string; email: string | null } | null;
  onClose: () => void;
}

const SDRRateCardModal: React.FC<Props> = ({ user, onClose }) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState<RateRow | null>(null);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["sdr-rates", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("sdr_commission_rates")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data as RateRow | null;
    },
  });

  useEffect(() => {
    if (!user) { setForm(null); return; }
    setForm(existing || { ...DEFAULTS, user_id: user.id, user_email: user.email });
  }, [user, existing]);

  const saveMut = useMutation({
    mutationFn: async (vars: RateRow) => {
      const payload = { ...vars, user_email: user?.email };
      const { error } = await supabase
        .from("sdr_commission_rates")
        .upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sdr-rates"] });
      toast({ title: "Rates saved" });
      onClose();
    },
    onError: (e: Error) =>
      toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  if (!user) return null;

  const update = (k: keyof RateRow, v: any) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const PctField = ({ label, k }: { label: string; k: keyof RateRow }) => (
    <div className="space-y-1">
      <Label className="text-[11px] text-slate-600">{label}</Label>
      <div className="relative">
        <Input
          type="number" step="0.01" min={0} max={1}
          value={(form?.[k] as number) ?? 0}
          onChange={(e) => update(k, Number(e.target.value))}
          className="h-9 border-slate-200 pr-8 text-sm"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">×100%</span>
      </div>
      <p className="text-[10px] text-slate-400 tabular-nums">
        = {(((form?.[k] as number) ?? 0) * 100).toFixed(1)}%
      </p>
    </div>
  );

  return (
    <Dialog open={!!user} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Commission rates — {user.email}</DialogTitle>
          <DialogDescription>
            Per-SDR overrides. Defaults match Margarita's contract (20/20/20/20/10/15, no MRR).
          </DialogDescription>
        </DialogHeader>

        {isLoading || !form ? (
          <div className="py-8 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); saveMut.mutate(form); }}
            className="space-y-5"
          >
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">One-time fees</p>
              <div className="grid grid-cols-3 gap-3">
                <PctField label="Build" k="rate_build" />
                <PctField label="Upgrade" k="rate_upgrade" />
                <PctField label="Persona addition" k="rate_persona_addition" />
                <PctField label="Rebuild" k="rate_rebuild" />
                <PctField label="Light reactivation" k="rate_light_reactivation" />
                <PctField label="Refresh" k="rate_refresh" />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Recurring (MRR)</p>
                  <p className="text-xs text-slate-500 mt-0.5">If on, this SDR earns commission on subscription MRR they sourced.</p>
                </div>
                <Switch
                  checked={form.mrr_commissionable}
                  onCheckedChange={(v) => update("mrr_commissionable", v)}
                />
              </div>
              {form.mrr_commissionable && (
                <div className="grid grid-cols-2 gap-3">
                  <PctField label="MRR rate" k="rate_mrr" />
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="space-y-1">
                <Label className="text-[11px] text-slate-600">Pricing floor (commission void below)</Label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                  <Input
                    type="number" min={0} value={form.pricing_floor}
                    onChange={(e) => update("pricing_floor", Number(e.target.value))}
                    className="h-9 border-slate-200 pl-6 text-sm"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="border-slate-200">Cancel</Button>
              <Button type="submit" disabled={saveMut.isPending} className="bg-slate-900 hover:bg-slate-800 text-white">
                {saveMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save rates"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SDRRateCardModal;
