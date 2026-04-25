import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCommercialEvents } from "@/hooks/usePartnersCRM";
import {
  downloadCSV,
  eventTypeLabels,
  formatCurrency,
  formatDate,
  paymentStatusLabels,
} from "@/lib/partnersFormat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";

const PartnersCommissionLogPage: React.FC = () => {
  const { data: events = [], isLoading } = useCommercialEvents();
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [partnerFilter, setPartnerFilter] = useState<string>("all");

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

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Commission log
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            All commercial events and commission payments.
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">No events match.</td></tr>
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
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium border ${tone}`}>
                          {paymentStatusLabels[e.payment_status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 tabular-nums">
                        {e.payment_status === "paid"
                          ? formatDate(e.payment_date)
                          : formatDate(e.payment_due_date)}
                      </td>
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
