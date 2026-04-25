import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const FROM_ADDRESS =
  Deno.env.get("COMMISSION_FROM_ADDRESS") ||
  "Galavanteer <onboarding@resend.dev>";

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n || 0);

const fmtDate = (d: string | null | undefined) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY =
      Deno.env.get("RESEND_API_KEY_1") || Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!RESEND_API_KEY) throw new Error("Resend connector key missing");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseService = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Auth check using caller's JWT
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify admin role
    const admin = createClient(supabaseUrl, supabaseService);
    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    const isAdmin = roles?.some((r) => r.role === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { event_id } = await req.json();
    if (!event_id || typeof event_id !== "string") {
      return new Response(JSON.stringify({ error: "event_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load the commercial event with client + partner
    const { data: event, error: evErr } = await admin
      .from("commercial_events")
      .select(
        `id, event_type, event_date, amount_charged, commission_amount, commission_rate, payment_date, payment_status,
         client:partner_clients!inner (
           id, client_name, company,
           partner:partners!inner ( id, name, email )
         )`,
      )
      .eq("id", event_id)
      .maybeSingle();

    if (evErr || !event) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const partner = (event.client as any)?.partner;
    if (!partner?.email) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "Partner has no email" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const clientName = (event.client as any)?.client_name || "client";
    const company = (event.client as any)?.company;
    const subject = `Commission paid — ${fmtCurrency(Number(event.commission_amount))}`;

    const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;">
          <tr><td style="padding:32px 32px 8px 32px;">
            <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Galavanteer Partners</p>
            <h1 style="margin:8px 0 0 0;font-size:22px;font-weight:600;color:#0f172a;">Your commission has been paid</h1>
          </td></tr>
          <tr><td style="padding:16px 32px 0 32px;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;">
              Hi ${partner.name || "there"}, we've sent your commission for ${clientName}${company ? ` (${company})` : ""}.
            </p>
          </td></tr>
          <tr><td style="padding:24px 32px 0 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:6px;">
              <tr><td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;">Amount</td>
                  <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a;text-align:right;font-weight:600;">${fmtCurrency(Number(event.commission_amount))}</td></tr>
              <tr><td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;">Rate</td>
                  <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a;text-align:right;">${(Number(event.commission_rate) * 100).toFixed(0)}%</td></tr>
              <tr><td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#64748b;">Event</td>
                  <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a;text-align:right;">${event.event_type}</td></tr>
              <tr><td style="padding:12px 16px;font-size:13px;color:#64748b;">Paid on</td>
                  <td style="padding:12px 16px;font-size:14px;color:#0f172a;text-align:right;">${fmtDate(event.payment_date)}</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:24px 32px 32px 32px;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
              Funds should arrive in your account shortly. Reply to this email if anything looks off.
            </p>
            <p style="margin:24px 0 0 0;font-size:13px;color:#0f172a;">— The Galavanteer team</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`.trim();

    const resp = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [partner.email],
        subject,
        html,
      }),
    });

    const body = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("Resend error", resp.status, body);
      return new Response(
        JSON.stringify({ error: "send_failed", status: resp.status, body }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ success: true, recipient: partner.email, id: body?.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("notify-commission-paid error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
