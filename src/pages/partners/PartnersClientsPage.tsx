import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useClients } from "@/hooks/usePartnersCRM";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import { useToast } from "@/hooks/use-toast";
import {
  attributionStatusLabels,
  clientLifecycleLabels,
  downloadCSV,
  formatDate,
  productLevelLabels,
} from "@/lib/partnersFormat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Card } from "@/components/ui/card";
import { Search, Download, Plus, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StatusBadge: React.FC<{ status: string; tone: "neutral" | "warn" | "ok" | "muted" }> = ({
  status,
  tone,
}) => {
  const tones: Record<string, string> = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    warn: "bg-amber-50 text-amber-800 border-amber-200",
    ok: "bg-emerald-50 text-emerald-800 border-emerald-200",
    muted: "bg-slate-50 text-slate-500 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium border ${tones[tone]}`}
    >
      {status}
    </span>
  );
};

const PartnersClientsPage: React.FC = () => {
  const { data: clients = [], isLoading } = useClients();
  const { isAdmin } = usePartnersAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [attributionFilter, setAttributionFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("partner_clients")
        .delete()
        .eq("id", deleteTarget.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["partners-crm"] });
      toast({ title: "Client deleted", description: deleteTarget.name });
      setDeleteTarget(null);
    } catch (err) {
      toast({
        title: "Could not delete",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (statusFilter !== "all" && c.client_status !== statusFilter) return false;
      if (attributionFilter !== "all" && c.attribution_status !== attributionFilter) return false;
      if (productFilter !== "all" && c.product_level !== productFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = [
          c.client_name,
          c.company,
          c.contact_name,
          c.email,
          c.partner?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [clients, search, statusFilter, attributionFilter, productFilter]);

  const handleExport = () => {
    downloadCSV(
      `clients-${new Date().toISOString().split("T")[0]}.csv`,
      filtered.map((c) => ({
        client_name: c.client_name,
        company: c.company || "",
        contact_name: c.contact_name || "",
        email: c.email || "",
        phone: c.phone || "",
        partner: c.partner?.name || "",
        referral_type: c.referral_type,
        attribution_status: c.attribution_status,
        client_status: c.client_status,
        product_level: c.product_level || "",
        configuration: c.configuration,
        partner_persona_included: c.partner_persona_included,
        date_logged: c.date_logged,
        first_paid_engagement_date: c.first_paid_engagement_date || "",
      })),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Clients</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length} of {clients.length} client{clients.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="border-slate-200">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Link
            to="/partners/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New referral
          </Link>
        </div>
      </div>

      <Card className="p-4 border-slate-200 shadow-none">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, or partner…"
              className="pl-10 h-9 border-slate-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9 border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.entries(clientLifecycleLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={attributionFilter} onValueChange={setAttributionFilter}>
            <SelectTrigger className="w-[170px] h-9 border-slate-200">
              <SelectValue placeholder="Attribution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All attribution</SelectItem>
              {Object.entries(attributionStatusLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[200px] h-9 border-slate-200">
              <SelectValue placeholder="Product level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All product levels</SelectItem>
              {Object.entries(productLevelLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
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
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Partner</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Attribution</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400 text-sm">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No clients match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/partners/clients/${c.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {c.client_name}
                      </Link>
                      {c.company && (
                        <p className="text-xs text-slate-500 mt-0.5">{c.company}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {c.partner?.name || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-700 text-xs">
                      {c.product_level ? productLevelLabels[c.product_level] : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {c.attribution_status === "disputed" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium border bg-red-50 text-red-700 border-red-200">
                          <AlertTriangle className="w-3 h-3" />
                          Disputed
                        </span>
                      ) : (
                        <StatusBadge
                          status={attributionStatusLabels[c.attribution_status]}
                          tone={
                            c.attribution_status === "approved"
                              ? "ok"
                              : c.attribution_status === "rejected"
                                ? "muted"
                                : "warn"
                          }
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={clientLifecycleLabels[c.client_status]}
                        tone={
                          c.client_status === "active" || c.client_status === "reactivated"
                            ? "ok"
                            : c.client_status === "churned"
                              ? "muted"
                              : "neutral"
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs tabular-nums">
                      {formatDate(c.date_logged)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PartnersClientsPage;
