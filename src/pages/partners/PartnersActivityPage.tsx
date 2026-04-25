import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useClients,
  useCommercialEvents,
  type ClientNote,
} from "@/hooks/usePartnersCRM";
import { useQuery } from "@tanstack/react-query";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import {
  eventTypeLabels,
  formatCurrency,
  formatDate,
} from "@/lib/partnersFormat";
import { Card } from "@/components/ui/card";
import {
  UserPlus,
  Receipt,
  StickyNote,
  CheckCircle2,
} from "lucide-react";

type FeedItem = {
  id: string;
  type: "client" | "event" | "note" | "payment";
  date: string;
  clientId: string;
  clientName: string;
  body: React.ReactNode;
};

const useRecentNotes = () =>
  useQuery({
    queryKey: ["partners-crm", "all-notes"],
    queryFn: async (): Promise<(ClientNote & { client_name?: string })[]> => {
      const { data, error } = await supabase
        .from("client_notes")
        .select("*, partner_clients!inner(client_name)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []).map((n: ClientNote & { partner_clients?: { client_name?: string } }) => ({
        ...n,
        client_name: n.partner_clients?.client_name,
      }));
    },
  });

const PartnersActivityPage: React.FC = () => {
  const { data: clients = [] } = useClients();
  const { data: events = [] } = useCommercialEvents();
  const { data: notes = [] } = useRecentNotes();

  const feed: FeedItem[] = useMemo(() => {
    const items: FeedItem[] = [];

    clients.forEach((c) => {
      items.push({
        id: `c-${c.id}`,
        type: "client",
        date: c.created_at || c.date_logged,
        clientId: c.id,
        clientName: c.client_name,
        body: (
          <span>
            New referral{c.partner ? ` via ${c.partner.name}` : ""}
            {c.company && <span className="text-slate-400"> · {c.company}</span>}
          </span>
        ),
      });
    });

    events.forEach((e) => {
      const client = e.client;
      items.push({
        id: `e-${e.id}`,
        type: "event",
        date: e.created_at,
        clientId: e.client_id,
        clientName: client?.client_name || "Unknown",
        body: (
          <span>
            {eventTypeLabels[e.event_type]} logged ·{" "}
            <span className="text-slate-700 font-medium">
              {formatCurrency(e.amount_charged)}
            </span>{" "}
            (commission {formatCurrency(e.commission_amount)})
          </span>
        ),
      });

      if (e.payment_status === "paid" && e.payment_date) {
        items.push({
          id: `p-${e.id}`,
          type: "payment",
          date: e.payment_date,
          clientId: e.client_id,
          clientName: client?.client_name || "Unknown",
          body: (
            <span>
              Commission paid ·{" "}
              <span className="text-emerald-700 font-medium">
                {formatCurrency(e.commission_amount)}
              </span>
            </span>
          ),
        });
      }
    });

    notes.forEach((n) => {
      items.push({
        id: `n-${n.id}`,
        type: "note",
        date: n.created_at,
        clientId: n.client_id,
        clientName: n.client_name || "Unknown",
        body: (
          <span>
            <span className="text-slate-500">
              {n.author_email || "Note"}:{" "}
            </span>
            <span className="text-slate-700">{n.body}</span>
          </span>
        ),
      });
    });

    return items
      .filter((i) => i.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 80);
  }, [clients, events, notes]);

  const iconFor = (type: FeedItem["type"]) => {
    switch (type) {
      case "client":
        return <UserPlus className="w-3.5 h-3.5 text-slate-600" />;
      case "event":
        return <Receipt className="w-3.5 h-3.5 text-slate-600" />;
      case "payment":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case "note":
        return <StickyNote className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Activity</h1>
        <p className="text-sm text-slate-500 mt-1">
          Recent referrals, events, payments, and notes.
        </p>
      </div>

      <Card className="p-5 border-slate-200 shadow-none">
        {feed.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-12 text-center">
            No activity yet.
          </p>
        ) : (
          <ol className="space-y-4">
            {feed.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0 mt-0.5">
                  {iconFor(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">
                    <Link
                      to={`/partners/clients/${item.clientId}`}
                      className="font-medium hover:underline"
                    >
                      {item.clientName}
                    </Link>{" "}
                    <span className="text-slate-700">{item.body}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDate(item.date)} ·{" "}
                    {new Date(item.date).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
};

export default PartnersActivityPage;
