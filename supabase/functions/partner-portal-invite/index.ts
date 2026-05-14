// Admin-only: provision a 'partner' role user and link it to a partners.id
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
    const RESEND = Deno.env.get("RESEND_API_KEY");

    const auth = req.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) return json({ error: "Missing auth" }, 401);

    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: auth } },
    });
    const { data: u, error: ue } = await userClient.auth.getUser();
    if (ue || !u.user) return json({ error: "Invalid session" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: u.user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const { partner_id, email } = await req.json();
    if (!partner_id || !email) return json({ error: "partner_id and email required" }, 400);

    const cleanEmail = String(email).trim().toLowerCase();

    // Check if user exists
    const { data: existingList } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let userId = existingList.users.find((x) => x.email?.toLowerCase() === cleanEmail)?.id;

    if (!userId) {
      // Generate a magic-link invite (creates the user and sends email)
      const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(
        cleanEmail,
        { redirectTo: `${new URL(req.url).origin.replace(/\/.*/, "")}/partners/login` },
      );
      if (invErr) return json({ error: invErr.message }, 400);
      userId = invited.user!.id;
    }

    // Assign 'partner' role (ignore duplicate)
    const { error: roleErr } = await admin
      .from("user_roles")
      .insert({ user_id: userId, role: "partner" });
    if (roleErr && !roleErr.message.includes("duplicate")) {
      return json({ error: roleErr.message }, 400);
    }

    // Link partner.portal_user_id
    const { error: linkErr } = await admin
      .from("partners")
      .update({ portal_user_id: userId })
      .eq("id", partner_id);
    if (linkErr) return json({ error: linkErr.message }, 400);

    // Track the invite
    await admin.from("partner_portal_invites").insert({
      partner_id,
      email: cleanEmail,
      invited_by: u.user.id,
    });

    // Optional Resend nudge with the portal URL (the magic link itself comes from auth)
    if (RESEND) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Galavanteer <onboarding@resend.dev>",
            to: [cleanEmail],
            bcc: ["jason@galavanteer.com"],
            subject: "Your Galavanteer Partner Portal is ready",
            html: `
              <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 560px; margin: 0 auto; color: #1A1915;">
                <h2 style="margin: 0 0 16px;">Welcome to the Galavanteer Partner Portal</h2>
                <p>You'll receive a separate sign-in email from our system. Once you set your password, you can log in here:</p>
                <p style="margin: 20px 0;">
                  <a href="https://galavanteer.com/portal/login" style="background:#1A1915;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Open the portal</a>
                </p>
                <p style="font-size:13px;color:#666;">Inside you'll find your referral link, QR code, live click counts, and your commission ledger.</p>
                <p style="font-size:13px;color:#666;">— Jason</p>
              </div>
            `,
          }),
        });
      } catch (e) {
        console.warn("Resend nudge failed:", e);
      }
    }

    return json({ ok: true, user_id: userId });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unknown" }, 500);
  }
});
