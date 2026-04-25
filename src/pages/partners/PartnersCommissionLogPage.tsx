import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommercialEvents } from "@/hooks/usePartnersCRM";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import {
  downloadCSV,
  eventTypeLabels,
  formatCurrency,
  formatDate,
  paymentStatusLabels,
} from "@/lib/partnersFormat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Check, Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type PaymentStatus = Database["public"]["Enums"]["payment_status"];

const PartnersCommissionLogPage: React.FC = () => {
  const { data: events = [], isLoading } = useCommercialEvents();
  const { isAdmin } = usePartnersAuth();
  const queryClient = useQueryClient();
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [partnerFilter, setPartnerFilter] = useState<string>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [dateDraft, setDateDraft] = useState<Record<string, string>>({});

  const updateEvent = useMutation({
    mutationFn: async (input: {
      id: string;
      payment_status: PaymentStatus;
      payment_date?: string | null;
    }) => {
      const patch: Record<string, unknown> = {
        payment_status: input.payment_status,
      };
      if (input.payment_status === "paid") {
        patch.payment_date =
          input.payment_date || new Date().toISOString().slice(0, 10);
      } else if (input.payment_date !== undefined) {
        patch.payment_date = input.payment_date;
      }
      const { error } = await supabase
        .from("commercial_events")
        .update(patch)
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners-crm", "events"] });
      toast({ title: "Commission updated" });
    },
    onError: (e: Error) => {
      toast({ title: "Update failed", description: e.message, variant: "destructive" });
    },
    onSettled: () => setPendingId(null),
  });

  const partners = useMemo(() => {
    const m = new Map<string, string>();
    events.forEach((e) => {
      if (e.client?.partner) m.set(e.client.partner.id, e.client.partner.name);
    });
    return Array.from(m, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (paymentFilter !== "all" && e.payment_status !== paymentFilter) return false;
      if (partnerFilter !== "all" && e.client?.partner?.id !== partnerFilter) return false;
      return true;
    });
  }, [events, paymentFilter, partnerFilter]);

  const totals = useMemo(() => {
    const due = filtered
      .filter((e) => e.payment_status === "due" || e.payment_status === "not_due")
      .reduce((s, e) => s + Number(e.commission_amount || 0), 0);
    const paid = filtered
      .filter((e) => e.payment_status === "paid")
      .reduce((s, e) => s + Number(e.commission_amount || 0), 0);
    return { due, paid, total: due + paid };
  }, [filtered]);

  const handleExport = () => {
    downloadCSV(
      `commissions-${new Date().toISOString().split("T")[0]}.csv`,
      filtered.map((e) => ({
        event_date: e.event_date,
        client: e.client?.client_name || "",
        company: e.client?.company || "",
        partner: e.client?.partner?.name || "",
        event_type: e.event_type,
        amount_charged: e.amount_charged,
        processing_fee: e.processing_fee,
        net_revenue: e.net_revenue,
        commission_rate: e.commission_rate,
        commission_amount: e.commission_amount,
        payment_status: e.payment_status,
        payment_due_date: e.payment_due_date || "",
        payment_date: e.payment_date || "",
      })),
    );
  };

  const handleMarkPaid = (id: string) => {
    setPendingId(id);
    updateEvent.mutate({
      id,
      payment_status: "paid",
      payment_date: dateDraft[id] || new Date().toISOString().slice(0, 10),
    });
  };

  const handleStatusChange = (id: string, status: PaymentStatus) => {
    setPendingId(id);
    updateEvent.mutate({
      id,
      payment_status: status,
      payment_date: status === "paid" ? dateDraft[id] || undefined : null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Commission log
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            All commercial events and commission payments.
            {isAdmin && " Click status or use Mark paid to update."}
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="border-slate-200">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 border-slate-200 shadow-none">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total commission</p>
          <p className="text-2xl font-semibold text-slate-900 tabular-nums mt-1.5">{formatCurrency(totals.total)}</p>
        </Card>
        <Card className="p-5 border-slate-200 shadow-none">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Outstanding</p>
          <p className="text-2xl font-semibold text-amber-700 tabular-nums mt-1.5">{formatCurrency(totals.due)}</p>
        </Card>
        <Card className="p-5 border-slate-200 shadow-none">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Paid</p>
          <p className="text-2xl font-semibold text-emerald-700 tabular-nums mt-1.5">{formatCurrency(totals.paid)}</p>
        </Card>
      </div>

      <Card className="p-4 border-slate-200 shadow-none">
        <div className="flex flex-wrap gap-2">
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[180px] h-9 border-slate-200">
              <SelectValue placeholder="Payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payment statuses</SelectItem>
              {Object.entries(paymentStatusLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={partnerFilter} onValueChange={setPartnerFilter}>
            <SelectTrigger className="w-[220px] h-9 border-slate-200">
              <SelectValue placeholder="Partner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All partners</SelectItem>
              {partners.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Partner</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-right px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Charged</th>
                <th className="text-right px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Commission</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Due / Paid</th>
                {isAdmin && (
                  <th className="text-right px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={isAdmin ? 9 : 8} className="px-4 py-12 text-center text-slate-400 text-sm">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={isAdmin ? 9 : 8} className="px-4 py-12 text-center text-slate-400 text-sm">No events match.</td></tr>
              ) : (
                filtered.map((e) => {
                  const tone =
                    e.payment_status === "paid"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : e.payment_status === "disputed"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : e.payment_status === "due"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-slate-50 text-slate-500 border-slate-200";
                  const isPending = pendingId === e.id && updateEvent.isPending;
                  return (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-700 text-xs tabular-nums">{formatDate(e.event_date)}</td>
                      <td className="px-4 py-3">
                        <Link to={`/partners/clients/${e.client_id}`} className="text-slate-900 hover:underline">
                          {e.client?.client_name || "—"}
                        </Link>
                        {e.client?.company && (
                          <p className="text-xs text-slate-500 mt-0.5">{e.client.company}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700 text-xs">{e.client?.partner?.name || "—"}</td>
                      <td className="px-4 py-3 text-slate-700 text-xs">{eventTypeLabels[e.event_type]}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">{formatCurrency(e.amount_charged)}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900">{formatCurrency(e.commission_amount)}</td>
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <Select
                            value={e.payment_status}
                            onValueChange={(v) => handleStatusChange(e.id, v as PaymentStatus)}
                            disabled={isPending}
                          >
                            <SelectTrigger className={`h-7 px-2 py-0 text-[10px] uppercase tracking-wider font-medium border w-[110px] ${tone}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(paymentStatusLabels).map(([k, v]) => (
                                <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium border ${tone}`}>
                            {paymentStatusLabels[e.payment_status]}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 tabular-nums">
                        {e.payment_status === "paid"
                          ? formatDate(e.payment_date)
                          : formatDate(e.payment_due_date)}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3">
                          {e.payment_status !== "paid" ? (
                            <div className="flex items-center justify-end gap-2">
                              <Input
                                type="date"
                                value={dateDraft[e.id] ?? new Date().toISOString().slice(0, 10)}
                                onChange={(ev) =>
                                  setDateDraft((d) => ({ ...d, [e.id]: ev.target.value }))
                                }
                                className="h-7 w-[130px] text-xs border-slate-200"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleMarkPaid(e.id)}
                                disabled={isPending}
                                className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                              >
                                {isPending ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                                Mark paid
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(e.id, "due")}
                                disabled={isPending}
                                className="h-7 px-2.5 text-xs text-slate-500 hover:text-slate-900"
                              >
                                Undo
                              </Button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PartnersCommissionLogPage;
