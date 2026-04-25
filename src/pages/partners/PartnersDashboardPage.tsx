import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useClients, useCommercialEvents, usePartners } from "@/hooks/usePartnersCRM";
import {
  formatCurrency,
  formatDate,
  productLevelLabels,
} from "@/lib/partnersFormat";
import { Card } from "@/components/ui/card";
import {
  Users,
  AlertCircle,
  DollarSign,
  CheckCircle2,
  Briefcase,
  Calendar,
  ArrowRight,
} from "lucide-react";

const StatCard: React.FC<{
  label: string;
  value: string;
  icon: React.ElementType;
  hint?: string;
}> = ({ label, value, icon: Icon, hint }) => (
  <Card className="p-5 border-slate-200 shadow-none">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-semibold text-slate-900 mt-1.5 tabular-nums">
          {value}
        </p>
        {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      </div>
      <div className="w-9 h-9 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center">
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
    </div>
  </Card>
);

const PartnersDashboardPage: React.FC = () => {
  const { data: clients = [] } = useClients();
  const { data: partners = [] } = usePartners();
  const { data: events = [] } = useCommercialEvents();

  const stats = useMemo(() => {
    const activeClients = clients.filter((c) => c.client_status === "active").length;
    const pendingAttribution = clients.filter(
      (c) => c.attribution_status === "pending" || c.attribution_status === "disputed",
    ).length;
    const activePartners = partners.filter((p) => p.status === "active").length;

    const commissionDue = events
      .filter((e) => e.payment_status === "due" || e.payment_status === "not_due")
      .reduce((sum, e) => sum + Number(e.commission_amount || 0), 0);
    const commissionPaid = events
      .filter((e) => e.payment_status === "paid")
      .reduce((sum, e) => sum + Number(e.commission_amount || 0), 0);

    const productLevelCounts: Record<string, number> = {};
    clients.forEach((c) => {
      if (c.product_level) {
        productLevelCounts[c.product_level] = (productLevelCounts[c.product_level] || 0) + 1;
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = events
      .filter((e) => e.payment_due_date && e.payment_status !== "paid")
      .filter((e) => {
        const d = new Date(e.payment_due_date!);
        return d >= today;
      })
      .sort(
        (a, b) =>
          new Date(a.payment_due_date!).getTime() - new Date(b.payment_due_date!).getTime(),
      )
      .slice(0, 5);

    return {
      activeClients,
      pendingAttribution,
      activePartners,
      commissionDue,
      commissionPaid,
      productLevelCounts,
      upcoming,
    };
  }, [clients, partners, events]);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Operating overview of partners, referrals, and commissions.
          </p>
        </div>
        <Link
          to="/partners/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
        >
          New referral
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active referred clients"
          value={String(stats.activeClients)}
          icon={Users}
        />
        <StatCard
          label="Pending attribution"
          value={String(stats.pendingAttribution)}
          icon={AlertCircle}
          hint="Pending or disputed"
        />
        <StatCard
          label="Commission due"
          value={formatCurrency(stats.commissionDue)}
          icon={DollarSign}
        />
        <StatCard
          label="Commission paid"
          value={formatCurrency(stats.commissionPaid)}
          icon={CheckCircle2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          label="Active partners"
          value={String(stats.activePartners)}
          icon={Briefcase}
        />
        <Card className="p-5 border-slate-200 shadow-none lg:col-span-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Clients by product level
          </p>
          <div className="space-y-2">
            {Object.entries(productLevelLabels).map(([key, label]) => {
              const count = stats.productLevelCounts[key] || 0;
              const total = clients.length || 1;
              const pct = (count / total) * 100;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-700">{label}</span>
                    <span className="text-slate-500 tabular-nums">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1e3a5f] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {clients.length === 0 && (
              <p className="text-xs text-slate-400 italic">No clients yet.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5 border-slate-200 shadow-none">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Upcoming payment due dates
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Next 5 commission payments scheduled.
            </p>
          </div>
          <Link
            to="/partners/commissions"
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {stats.upcoming.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-8 text-center">
            No upcoming payments scheduled.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.upcoming.map((e) => (
              <Link
                key={e.id}
                to={`/partners/clients/${e.client_id}`}
                className="flex items-center justify-between py-3 hover:bg-slate-50 -mx-2 px-2 rounded transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {e.client?.client_name || "Unknown client"}
                    {e.client?.company && (
                      <span className="text-slate-400 font-normal"> · {e.client.company}</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Due {formatDate(e.payment_due_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(e.commission_amount)}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                    {e.payment_status === "due" ? "Due" : "Scheduled"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PartnersDashboardPage;
