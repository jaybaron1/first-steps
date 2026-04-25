import React, { useState } from "react";
import { z } from "zod";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import { usePartners, type Partner } from "@/hooks/usePartnersCRM";
import { partnerStatusLabels, formatDate } from "@/lib/partnersFormat";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(200),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional(),
  status: z.enum(["active", "inactive", "expired", "terminated"]),
  agreement_date: z.string().optional(),
  last_promotional_activity_date: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

type FormState = {
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "expired" | "terminated";
  agreement_date: string;
  last_promotional_activity_date: string;
  notes: string;
};

const blank: FormState = {
  name: "",
  email: "",
  phone: "",
  status: "active",
  agreement_date: "",
  last_promotional_activity_date: "",
  notes: "",
};

const PartnersDirectoryPage: React.FC = () => {
  const { data: partners = [], isLoading } = usePartners();
  const { user, isAdmin } = usePartnersAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(blank);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => {
    setEditingId(null);
    setForm(blank);
    setOpen(true);
  };

  const openEdit = (p: Partner) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      email: p.email || "",
      phone: p.phone || "",
      status: p.status,
      agreement_date: p.agreement_date || "",
      last_promotional_activity_date: p.last_promotional_activity_date || "",
      notes: p.notes || "",
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Invalid input",
        description: parsed.error.issues[0]?.message,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        status: parsed.data.status,
        agreement_date: parsed.data.agreement_date || null,
        last_promotional_activity_date: parsed.data.last_promotional_activity_date || null,
        notes: parsed.data.notes || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("partners")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast({ title: "Partner updated" });
      } else {
        const { error } = await supabase
          .from("partners")
          .insert({ ...payload, owner_id: user.id });
        if (error) throw error;
        toast({ title: "Partner added" });
      }
      qc.invalidateQueries({ queryKey: ["partners-crm"] });
      setOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not save partner.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("partners").delete().eq("id", deleteId);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["partners-crm"] });
      toast({ title: "Partner deleted" });
    } catch (err) {
      toast({
        title: "Cannot delete",
        description:
          err instanceof Error
            ? err.message
            : "This partner may have linked clients. Remove them first.",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const statusTone = (s: string) =>
    s === "active"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : s === "terminated"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Partner directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {partners.length} partner{partners.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button onClick={openNew} className="bg-slate-900 hover:bg-slate-800 text-white">
          <Plus className="w-4 h-4" />
          New partner
        </Button>
      </div>

      <Card className="border-slate-200 shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Agreement</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Last activity</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">Loading…</td></tr>
              ) : partners.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">No partners yet.</td></tr>
              ) : (
                partners.map((p) => (
                  <tr key={p.id} id={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 text-slate-700 break-all">{p.email || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{p.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium border ${statusTone(p.status)}`}>
                        {partnerStatusLabels[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs tabular-nums">{formatDate(p.agreement_date)}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs tabular-nums">{formatDate(p.last_promotional_activity_date)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                          aria-label="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit partner" : "New partner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-slate-700">Partner name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-10 border-slate-200"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as FormState["status"] }))}
                >
                  <SelectTrigger className="h-10 border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(partnerStatusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Agreement date</Label>
                <Input
                  type="date"
                  value={form.agreement_date}
                  onChange={(e) => setForm((f) => ({ ...f, agreement_date: e.target.value }))}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-slate-700">Last promotional activity</Label>
                <Input
                  type="date"
                  value={form.last_promotional_activity_date}
                  onChange={(e) => setForm((f) => ({ ...f, last_promotional_activity_date: e.target.value }))}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-slate-700">Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="border-slate-200 resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-200">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this partner?</AlertDialogTitle>
            <AlertDialogDescription>
              You cannot delete a partner who still has linked clients. Remove or reassign them first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PartnersDirectoryPage;
