import React, { useEffect, useMemo, useRef } from "react";
import QRCode from "qrcode";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePortalAuth } from "@/components/portal/PortalRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, LogOut, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LandingPageEditor from "@/components/portal/LandingPageEditor";

const PROD_BASE = "https://galavanteer.com";

const PortalDashboardPage: React.FC = () => {
  const { partnerId, partnerName, partnerSlug, isWhiteLabel } = usePortalAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const url = partnerSlug ? `${PROD_BASE}/r/${partnerSlug}` : "";

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 180,
        margin: 1,
        color: { dark: "#1A1915", light: "#FFFFFF" },
      });
    }
  }, [url]);

  const { data: clicks = [] } = useQuery({
    queryKey: ["portal", "clicks", partnerId],
    queryFn: async () => {
      const { data } = await supabase
        .from("partner_referral_clicks")
        .select("id, created_at, landing_url, referrer")
        .eq("partner_id", partnerId)
        .order("created_at", { ascending: false })
        .limit(200);
      return data ?? [];
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["portal", "clients", partnerId],
    queryFn: async () => {
      const { data } = await supabase
        .from("partner_clients")
        .select("id, client_name, company, client_status, created_at")
        .eq("partner_id", partnerId)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ["portal", "events", partnerId],
    queryFn: async () => {
      const { data } = await supabase
        .from("commercial_events")
        .select("id, event_type, amount_charged, commission_amount, payment_status, event_date, client:partner_clients!inner(partner_id, client_name)")
        .eq("client.partner_id", partnerId)
        .order("event_date", { ascending: false });
      return data ?? [];
    },
  });

  const stats = useMemo(() => {
    const last30 = clicks.filter(
      (c) => new Date(c.created_at).getTime() > Date.now() - 30 * 86400_000,
    );
    const totalCommission = events.reduce(
      (sum, e) => sum + Number(e.commission_amount || 0),
      0,
    );
    const paid = events
      .filter((e) => e.payment_status === "paid")
      .reduce((sum, e) => sum + Number(e.commission_amount || 0), 0);
    return {
      clicks30: last30.length,
      clicksAll: clicks.length,
      clientsCount: clients.length,
      totalCommission,
      paid,
      owed: totalCommission - paid,
    };
  }, [clicks, clients, events]);

  const fmtUsd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast({ title: "Link copied" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/portal/login";
  };

  return (
    <>
      <Helmet>
        <title>Partner Portal — {partnerName} | Galavanteer</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Partner portal</p>
              <h1 className="text-lg font-semibold text-slate-900">{partnerName}</h1>
            </div>
            <Button variant="outline" onClick={signOut} className="h-9 border-slate-200">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </Button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          {!partnerSlug && (
            <Card className="p-5 border-amber-200 bg-amber-50">
              <p className="text-sm text-amber-900">
                Your referral link isn't set up yet. Email
                <a href="mailto:jason@galavanteer.com" className="underline mx-1">
                  jason@galavanteer.com
                </a>
                to get your custom link and QR code.
              </p>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Clicks (30d)", stats.clicks30],
              ["Clicks (all)", stats.clicksAll],
              ["Clients", stats.clientsCount],
              ["Commission earned", fmtUsd(stats.totalCommission)],
            ].map(([label, val]) => (
              <Card key={label as string} className="p-4 border-slate-200 shadow-none">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">{val}</p>
              </Card>
            ))}
          </div>

          {/* Link + QR */}
          {partnerSlug && (
            <Card className="p-5 border-slate-200 shadow-none">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Your referral link</h2>
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-5 items-start">
                <div className="bg-white border border-slate-200 rounded-md p-2 inline-flex">
                  <canvas ref={canvasRef} />
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={url}
                      className="flex-1 h-9 px-3 border border-slate-200 rounded-md font-mono text-xs bg-slate-50"
                    />
                    <Button variant="outline" onClick={copyLink} className="h-9 border-slate-200">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Anyone who clicks this link is attributed to you. Drop it on your site, in
                    your email signature, or share the QR.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* White-label persona panel */}
          {isWhiteLabel && (
            <Card className="p-5 border-slate-200 shadow-none bg-gradient-to-br from-slate-50 to-amber-50/30">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Your boardroom persona</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    You're set up as a featured personality inside the boardrooms you sell. Jason
                    will publish your persona profile here once it's built.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Recent clients */}
          <Card className="border-slate-200 shadow-none overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Your clients</h2>
            </div>
            {clients.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-slate-400">No clients yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="text-left px-5 py-2">Name</th>
                    <th className="text-left px-5 py-2">Company</th>
                    <th className="text-left px-5 py-2">Status</th>
                    <th className="text-left px-5 py-2">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map((c) => (
                    <tr key={c.id}>
                      <td className="px-5 py-2.5 font-medium text-slate-900">
                        {c.client_name?.split(" ")[0] || "—"}
                      </td>
                      <td className="px-5 py-2.5 text-slate-700">{c.company || "—"}</td>
                      <td className="px-5 py-2.5 text-slate-600 text-xs">{c.client_status}</td>
                      <td className="px-5 py-2.5 text-slate-500 text-xs">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          {/* Commission */}
          <Card className="border-slate-200 shadow-none overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Commission ledger</h2>
              <p className="text-xs text-slate-500 tabular-nums">
                Paid {fmtUsd(stats.paid)} · Owed {fmtUsd(stats.owed)}
              </p>
            </div>
            {events.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-slate-400">No events yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="text-left px-5 py-2">Date</th>
                    <th className="text-left px-5 py-2">Type</th>
                    <th className="text-right px-5 py-2">Amount</th>
                    <th className="text-right px-5 py-2">Commission</th>
                    <th className="text-left px-5 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((e) => (
                    <tr key={e.id}>
                      <td className="px-5 py-2.5 text-slate-600 text-xs tabular-nums">
                        {new Date(e.event_date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-2.5 text-slate-700 text-xs">{e.event_type}</td>
                      <td className="px-5 py-2.5 text-right tabular-nums">
                        {fmtUsd(Number(e.amount_charged))}
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums font-medium text-slate-900">
                        {fmtUsd(Number(e.commission_amount))}
                      </td>
                      <td className="px-5 py-2.5 text-xs">
                        <span
                          className={
                            e.payment_status === "paid"
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }
                        >
                          {e.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </main>
      </div>
    </>
  );
};

export default PortalDashboardPage;
