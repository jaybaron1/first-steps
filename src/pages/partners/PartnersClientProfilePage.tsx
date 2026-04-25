import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import {
  useClient,
  useClientNotes,
  useCommercialEvents,
  usePartners,
} from "@/hooks/usePartnersCRM";
import {
  attributionStatusLabels,
  clientLifecycleLabels,
  configurationLabels,
  eventTypeLabels,
  formatCurrency,
  formatDate,
  paymentStatusLabels,
  productLevelLabels,
  referralTypeLabels,
} from "@/lib/partnersFormat";
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
import {
  ArrowLeft,
  Plus,
  Loader2,
  Trash2,
  AlertTriangle,
  Pencil,
} from "lucide-react";

const eventSchema = z.object({
  event_type: z.enum([
    "build_fee",
    "upgrade",
    "persona_addition",
    "light_reactivation",
    "refresh",
    "rebuild",
  ]),
  event_date: z.string().min(1),
  amount_charged: z.coerce.number().min(0),
  processing_fee: z.coerce.number().min(0),
  payment_status: z.enum(["not_due", "due", "paid", "disputed"]),
  payment_due_date: z.string().optional(),
  payment_date: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

const Pill: React.FC<{ tone: "ok" | "warn" | "muted" | "neutral" | "danger"; children: React.ReactNode }> =
  ({ tone, children }) => {
    const map: Record<string, string> = {
      ok: "bg-emerald-50 text-emerald-800 border-emerald-200",
      warn: "bg-amber-50 text-amber-800 border-amber-200",
      muted: "bg-slate-50 text-slate-500 border-slate-200",
      neutral: "bg-slate-100 text-slate-700 border-slate-200",
      danger: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium border ${map[tone]}`}
      >
        {children}
      </span>
    );
  };

const PartnersClientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { user, isAdmin } = usePartnersAuth();

  const { data: client, isLoading } = useClient(id);
  const { data: events = [] } = useCommercialEvents(id);
  const { data: notes = [] } = useClientNotes(id);
  const { data: partners = [] } = usePartners();

  const [eventOpen, setEventOpen] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    event_type: "build_fee" as
      | "build_fee"
      | "upgrade"
      | "persona_addition"
      | "light_reactivation"
      | "refresh"
      | "rebuild",
    event_date: new Date().toISOString().split("T")[0],
    amount_charged: "",
    processing_fee: "",
    payment_status: "not_due" as "not_due" | "due" | "paid" | "disputed",
    payment_due_date: "",
    payment_date: "",
    notes: "",
  });

  const [noteBody, setNoteBody] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    client_status: client?.client_status || "prospect",
    attribution_status: client?.attribution_status || "pending",
    product_level: client?.product_level || "",
    configuration: client?.configuration || "standard",
    partner_id: client?.partner_id || "",
    first_paid_engagement_date: client?.first_paid_engagement_date || "",
    notes: client?.notes || "",
  });

  React.useEffect(() => {
    if (client) {
      setEditForm({
        client_status: client.client_status,
        attribution_status: client.attribution_status,
        product_level: client.product_level || "",
        configuration: client.configuration,
        partner_id: client.partner_id,
        first_paid_engagement_date: client.first_paid_engagement_date || "",
        notes: client.notes || "",
      });
    }
  }, [client]);

  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return <p className="text-sm text-slate-400">Loading…</p>;
  }
  if (!client) {
    return (
      <div className="space-y-4">
        <Link to="/partners/clients" className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to clients
        </Link>
        <p className="text-sm text-slate-500">Client not found.</p>
      </div>
    );
  }

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = eventSchema.safeParse(eventForm);
    if (!parsed.success) {
      toast({
        title: "Invalid event",
        description: parsed.error.issues[0]?.message || "Check your inputs.",
        variant: "destructive",
      });
      return;
    }

    setSavingEvent(true);
    try {
      const { error } = await supabase.from("commercial_events").insert({
        client_id: client.id,
        event_type: parsed.data.event_type,
        event_date: parsed.data.event_date,
        amount_charged: parsed.data.amount_charged,
        processing_fee: parsed.data.processing_fee,
        payment_status: parsed.data.payment_status,
        payment_due_date: parsed.data.payment_due_date || null,
        payment_date: parsed.data.payment_date || null,
        notes: parsed.data.notes || null,
      });
      if (error) throw error;
      toast({ title: "Event added", description: "Commission auto-calculated." });
      qc.invalidateQueries({ queryKey: ["partners-crm"] });
      setEventOpen(false);
      setEventForm({
        event_type: "build_fee",
        event_date: new Date().toISOString().split("T")[0],
        amount_charged: "",
        processing_fee: "",
        payment_status: "not_due",
        payment_due_date: "",
        payment_date: "",
        notes: "",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not save event.",
        variant: "destructive",
      });
    } finally {
      setSavingEvent(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteBody.trim()) return;
    setSavingNote(true);
    try {
      const { error } = await supabase.from("client_notes").insert({
        client_id: client.id,
        author_id: user.id,
        author_email: user.email || null,
        body: noteBody.trim(),
      });
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["partners-crm", "notes", client.id] });
      setNoteBody("");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not add note.",
        variant: "destructive",
      });
    } finally {
      setSavingNote(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from("partner_clients")
        .update({
          client_status: editForm.client_status as typeof client.client_status,
          attribution_status: editForm.attribution_status as typeof client.attribution_status,
          product_level: (editForm.product_level || null) as typeof client.product_level,
          configuration: editForm.configuration as typeof client.configuration,
          partner_id: editForm.partner_id,
          first_paid_engagement_date: editForm.first_paid_engagement_date || null,
          notes: editForm.notes || null,
        })
        .eq("id", client.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["partners-crm"] });
      toast({ title: "Saved" });
      setEditOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not save.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("partner_clients").delete().eq("id", client.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["partners-crm"] });
      toast({ title: "Client deleted" });
      navigate("/partners/clients");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not delete.",
        variant: "destructive",
      });
    }
  };

  const totalCommission = events.reduce((s, e) => s + Number(e.commission_amount || 0), 0);
  const paidCommission = events
    .filter((e) => e.payment_status === "paid")
    .reduce((s, e) => s + Number(e.commission_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/partners/clients"
          className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to clients
        </Link>
      </div>

      {client.attribution_status === "disputed" && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Attribution dispute</p>
            <p className="text-xs text-red-700 mt-0.5">
              Another partner has claimed this client by matching email or company. Review and resolve.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            {client.client_name}
          </h1>
          {client.company && (
            <p className="text-sm text-slate-500 mt-0.5">{client.company}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Pill tone={client.client_status === "active" ? "ok" : client.client_status === "churned" ? "muted" : "neutral"}>
              {clientLifecycleLabels[client.client_status]}
            </Pill>
            <Pill tone={client.attribution_status === "approved" ? "ok" : client.attribution_status === "disputed" ? "danger" : "warn"}>
              {attributionStatusLabels[client.attribution_status]}
            </Pill>
            {client.product_level && (
              <Pill tone="neutral">{productLevelLabels[client.product_level]}</Pill>
            )}
            <Pill tone="neutral">{configurationLabels[client.configuration]}</Pill>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)} className="border-slate-200">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overview */}
        <Card className="p-5 border-slate-200 shadow-none lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">Overview</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Partner</dt>
              <dd className="text-slate-900 mt-0.5">
                {client.partner ? (
                  <Link
                    to={`/partners/directory#${client.partner.id}`}
                    className="hover:underline"
                  >
                    {client.partner.name}
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Referral type</dt>
              <dd className="text-slate-900 mt-0.5">
                {referralTypeLabels[client.referral_type]}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Contact</dt>
              <dd className="text-slate-900 mt-0.5">{client.contact_name || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Email</dt>
              <dd className="text-slate-900 mt-0.5 break-all">{client.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Phone</dt>
              <dd className="text-slate-900 mt-0.5">{client.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Date logged</dt>
              <dd className="text-slate-900 mt-0.5">{formatDate(client.date_logged)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">First paid engagement</dt>
              <dd className="text-slate-900 mt-0.5">
                {formatDate(client.first_paid_engagement_date)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Persona included</dt>
              <dd className="text-slate-900 mt-0.5">
                {client.partner_persona_included ? "Yes" : "No"}
              </dd>
            </div>
          </dl>
          {client.notes && (
            <div className="pt-3 border-t border-slate-100">
              <dt className="text-xs text-slate-500">Notes</dt>
              <dd className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">
                {client.notes}
              </dd>
            </div>
          )}
        </Card>

        {/* Commission summary */}
        <Card className="p-5 border-slate-200 shadow-none space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Commission</h2>
          <div>
            <p className="text-xs text-slate-500">Total earned</p>
            <p className="text-2xl font-semibold text-slate-900 tabular-nums mt-0.5">
              {formatCurrency(totalCommission)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Paid</p>
            <p className="text-lg font-medium text-emerald-700 tabular-nums">
              {formatCurrency(paidCommission)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Outstanding</p>
            <p className="text-lg font-medium text-amber-700 tabular-nums">
              {formatCurrency(totalCommission - paidCommission)}
            </p>
          </div>
        </Card>
      </div>

      {/* Commercial events */}
      <Card className="border-slate-200 shadow-none">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Commercial events</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Build fees, upgrades, refreshes, and reactivations.
            </p>
          </div>
          <Button onClick={() => setEventOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white">
            <Plus className="w-4 h-4" />
            Add event
          </Button>
        </div>
        {events.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-12 text-center">
            No commercial events yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Charged</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Net</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Rate</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Commission</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 text-slate-700 text-xs tabular-nums">
                      {formatDate(e.event_date)}
                    </td>
                    <td className="px-4 py-3 text-slate-900 text-xs">
                      {eventTypeLabels[e.event_type]}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(e.amount_charged)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(e.net_revenue)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-500 text-xs">
                      {(Number(e.commission_rate) * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900">
                      {formatCurrency(e.commission_amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Pill
                        tone={
                          e.payment_status === "paid"
                            ? "ok"
                            : e.payment_status === "disputed"
                              ? "danger"
                              : e.payment_status === "due"
                                ? "warn"
                                : "muted"
                        }
                      >
                        {paymentStatusLabels[e.payment_status]}
                      </Pill>
                      {e.payment_due_date && e.payment_status !== "paid" && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          Due {formatDate(e.payment_due_date)}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Notes timeline */}
      <Card className="p-5 border-slate-200 shadow-none">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Notes timeline</h2>
        <form onSubmit={handleAddNote} className="flex gap-2 mb-5">
          <Textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Add a note…"
            rows={2}
            className="border-slate-200 resize-none flex-1"
          />
          <Button
            type="submit"
            disabled={savingNote || !noteBody.trim()}
            className="bg-slate-900 hover:bg-slate-800 text-white self-start"
          >
            {savingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
          </Button>
        </form>
        {notes.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No notes yet.</p>
        ) : (
          <ol className="space-y-4">
            {notes.map((n) => (
              <li key={n.id} className="border-l-2 border-slate-200 pl-4">
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">
                    {n.author_email || "Unknown"}
                  </span>{" "}
                  · {formatDate(n.created_at)}{" "}
                  {new Date(n.created_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">{n.body}</p>
              </li>
            ))}
          </ol>
        )}
      </Card>

      {/* Add event dialog */}
      <Dialog open={eventOpen} onOpenChange={setEventOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add commercial event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEvent} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-slate-700">Event type</Label>
                <Select
                  value={eventForm.event_type}
                  onValueChange={(v) =>
                    setEventForm((f) => ({ ...f, event_type: v as typeof f.event_type }))
                  }
                >
                  <SelectTrigger className="h-10 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventTypeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Event date</Label>
                <Input
                  type="date"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm((f) => ({ ...f, event_date: e.target.value }))}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Payment due date</Label>
                <Input
                  type="date"
                  value={eventForm.payment_due_date}
                  onChange={(e) =>
                    setEventForm((f) => ({ ...f, payment_due_date: e.target.value }))
                  }
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Amount charged ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={eventForm.amount_charged}
                  onChange={(e) =>
                    setEventForm((f) => ({ ...f, amount_charged: e.target.value }))
                  }
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Processing fee ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={eventForm.processing_fee}
                  onChange={(e) =>
                    setEventForm((f) => ({ ...f, processing_fee: e.target.value }))
                  }
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Payment status</Label>
                <Select
                  value={eventForm.payment_status}
                  onValueChange={(v) =>
                    setEventForm((f) => ({ ...f, payment_status: v as typeof f.payment_status }))
                  }
                >
                  <SelectTrigger className="h-10 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(paymentStatusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Payment date</Label>
                <Input
                  type="date"
                  value={eventForm.payment_date}
                  onChange={(e) =>
                    setEventForm((f) => ({ ...f, payment_date: e.target.value }))
                  }
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-slate-700">Notes</Label>
                <Textarea
                  value={eventForm.notes}
                  onChange={(e) => setEventForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="border-slate-200 resize-none"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Commission auto-calculates: 20% standard, 15% refresh, 10% light reactivation.
              No commission below $1,000.
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEventOpen(false)} className="border-slate-200">
                Cancel
              </Button>
              <Button type="submit" disabled={savingEvent} className="bg-slate-900 hover:bg-slate-800 text-white">
                {savingEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-slate-700">Partner</Label>
                <Select
                  value={editForm.partner_id}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, partner_id: v }))}
                >
                  <SelectTrigger className="h-10 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Client status</Label>
                <Select
                  value={editForm.client_status}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, client_status: v as typeof f.client_status }))}
                >
                  <SelectTrigger className="h-10 border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(clientLifecycleLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Attribution</Label>
                <Select
                  value={editForm.attribution_status}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, attribution_status: v as typeof f.attribution_status }))}
                >
                  <SelectTrigger className="h-10 border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(attributionStatusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Product level</Label>
                <Select
                  value={editForm.product_level || ""}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, product_level: v as typeof f.product_level }))}
                >
                  <SelectTrigger className="h-10 border-slate-200"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(productLevelLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700">Configuration</Label>
                <Select
                  value={editForm.configuration}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, configuration: v as typeof f.configuration }))}
                >
                  <SelectTrigger className="h-10 border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(configurationLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-slate-700">First paid engagement date</Label>
                <Input
                  type="date"
                  value={editForm.first_paid_engagement_date}
                  onChange={(e) => setEditForm((f) => ({ ...f, first_paid_engagement_date: e.target.value }))}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-slate-700">Notes</Label>
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="border-slate-200 resize-none"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-slate-200">Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-slate-900 hover:bg-slate-800 text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this client?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the client and all of their commercial events and notes. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PartnersClientProfilePage;
