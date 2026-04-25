import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import { usePartners } from "@/hooks/usePartnersCRM";
import {
  configurationLabels,
  productLevelLabels,
  referralTypeLabels,
} from "@/lib/partnersFormat";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const schema = z.object({
  partner_id: z.string().uuid({ message: "Select a partner" }),
  client_name: z.string().trim().min(1, "Required").max(200),
  company: z.string().trim().max(200).optional(),
  contact_name: z.string().trim().max(200).optional(),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional(),
  referral_type: z.enum(["direct_introduction", "self_identified"]),
  product_level: z
    .enum([
      "level_1_base_boardroom",
      "level_2_integrated_company_knowledge",
      "level_3_present_persona",
      "level_4_future_persona",
    ])
    .optional(),
  configuration: z.enum(["standard", "co_branded"]),
  partner_persona_included: z.boolean(),
  notes: z.string().trim().max(2000).optional(),
});

const PartnersNewReferralPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = usePartnersAuth();
  const { data: partners = [] } = usePartners();
  const qc = useQueryClient();

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    partner_id: "",
    client_name: "",
    company: "",
    contact_name: "",
    email: "",
    phone: "",
    referral_type: "direct_introduction" as "direct_introduction" | "self_identified",
    product_level: undefined as
      | "level_1_base_boardroom"
      | "level_2_integrated_company_knowledge"
      | "level_3_present_persona"
      | "level_4_future_persona"
      | undefined,
    configuration: "standard" as "standard" | "co_branded",
    partner_persona_included: false,
    notes: "",
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("partner_clients")
        .insert({
          partner_id: parsed.data.partner_id,
          client_name: parsed.data.client_name,
          company: parsed.data.company || null,
          contact_name: parsed.data.contact_name || null,
          email: parsed.data.email || null,
          phone: parsed.data.phone || null,
          referral_type: parsed.data.referral_type,
          product_level: parsed.data.product_level || null,
          configuration: parsed.data.configuration,
          partner_persona_included: parsed.data.partner_persona_included,
          notes: parsed.data.notes || null,
          owner_id: user.id,
        })
        .select("id, attribution_status")
        .single();

      if (error) throw error;

      qc.invalidateQueries({ queryKey: ["partners-crm"] });

      if (data?.attribution_status === "disputed") {
        toast({
          title: "Referral logged — attribution disputed",
          description:
            "This client matches another partner's record. Both have been flagged for review.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Referral logged",
          description: "Client added successfully.",
        });
      }

      navigate(`/partners/clients/${data!.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save referral.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          New referral
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Log a client referred by one of your partners.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 border-slate-200 shadow-none space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="partner_id" className="text-xs font-medium text-slate-700">
                Referral partner *
              </Label>
              <Select
                value={form.partner_id}
                onValueChange={(v) => update("partner_id", v)}
              >
                <SelectTrigger className="h-10 border-slate-200">
                  <SelectValue placeholder="Select a partner" />
                </SelectTrigger>
                <SelectContent>
                  {partners.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-400">
                      No partners yet.{" "}
                      <a href="/partners/directory" className="underline">
                        Add one
                      </a>
                      .
                    </div>
                  ) : (
                    partners.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                        {p.email && (
                          <span className="text-slate-400"> · {p.email}</span>
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.partner_id && (
                <p className="text-xs text-red-600">{errors.partner_id}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="client_name" className="text-xs font-medium text-slate-700">
                Client name *
              </Label>
              <Input
                id="client_name"
                value={form.client_name}
                onChange={(e) => update("client_name", e.target.value)}
                className="h-10 border-slate-200"
              />
              {errors.client_name && (
                <p className="text-xs text-red-600">{errors.client_name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-xs font-medium text-slate-700">
                Company
              </Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                className="h-10 border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact_name" className="text-xs font-medium text-slate-700">
                Contact name
              </Label>
              <Input
                id="contact_name"
                value={form.contact_name}
                onChange={(e) => update("contact_name", e.target.value)}
                className="h-10 border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="h-10 border-slate-200"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="phone" className="text-xs font-medium text-slate-700">
                Phone
              </Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="h-10 border-slate-200"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 shadow-none space-y-5">
          <h2 className="text-sm font-semibold text-slate-900">Referral details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">Referral type</Label>
              <Select
                value={form.referral_type}
                onValueChange={(v) =>
                  update("referral_type", v as typeof form.referral_type)
                }
              >
                <SelectTrigger className="h-10 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(referralTypeLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">Product level</Label>
              <Select
                value={form.product_level || ""}
                onValueChange={(v) =>
                  update("product_level", v as typeof form.product_level)
                }
              >
                <SelectTrigger className="h-10 border-slate-200">
                  <SelectValue placeholder="Select product level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(productLevelLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">Configuration</Label>
              <Select
                value={form.configuration}
                onValueChange={(v) =>
                  update("configuration", v as typeof form.configuration)
                }
              >
                <SelectTrigger className="h-10 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(configurationLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between md:col-span-1 pt-6">
              <Label
                htmlFor="persona"
                className="text-xs font-medium text-slate-700 cursor-pointer"
              >
                Partner persona included
              </Label>
              <Switch
                id="persona"
                checked={form.partner_persona_included}
                onCheckedChange={(v) => update("partner_persona_included", v)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-medium text-slate-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              className="border-slate-200 resize-none"
              placeholder="Context, intro details, special arrangements…"
            />
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/partners/clients")}
            className="border-slate-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log referral"}
          </Button>
        </div>
        {!isAdmin && (
          <p className="text-xs text-slate-400 text-right">
            Only partners you own appear in the dropdown.
          </p>
        )}
      </form>
    </div>
  );
};

export default PartnersNewReferralPage;
