import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const ts = (d: Date) =>
  d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escapeICS = (s: string) =>
  (s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return new Response("Missing token", { status: 401 });

    // Resolve token → user
    const { data: tokenRow } = await supabase
      .from("ics_feed_tokens")
      .select("user_id")
      .eq("token", token)
      .maybeSingle();
    if (!tokenRow) return new Response("Invalid token", { status: 403 });

    // Determine role
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: tokenRow.user_id,
      _role: "admin",
    });

    let query = supabase
      .from("appointments")
      .select("*, partner_clients(client_name)")
      .order("scheduled_at", { ascending: true });

    if (!isAdmin) {
      query = query.eq("owner_id", tokenRow.user_id);
    }

    const { data: appts, error } = await query;
    if (error) return new Response(error.message, { status: 500 });

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Galavanteer//Partners CRM//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:Galavanteer ${isAdmin ? "All Appointments" : "My Appointments"}`,
      "X-WR-TIMEZONE:America/New_York",
    ];

    for (const a of appts || []) {
      const start = new Date(a.scheduled_at);
      const end = new Date(start.getTime() + (a.duration_minutes || 30) * 60000);
      const clientName = (a as any).partner_clients?.client_name || "Client";
      lines.push(
        "BEGIN:VEVENT",
        `UID:${a.ics_uid}`,
        `DTSTAMP:${ts(new Date(a.created_at))}`,
        `DTSTART:${ts(start)}`,
        `DTEND:${ts(end)}`,
        `SUMMARY:${escapeICS(a.title)} — ${escapeICS(clientName)}`,
      );
      if (a.location) lines.push(`LOCATION:${escapeICS(a.location)}`);
      if (a.meeting_link) lines.push(`URL:${a.meeting_link}`);
      const desc = [a.notes, a.meeting_link].filter(Boolean).join("\n");
      if (desc) lines.push(`DESCRIPTION:${escapeICS(desc)}`);
      lines.push(`STATUS:${(a.status || "scheduled").toUpperCase() === "CANCELLED" ? "CANCELLED" : "CONFIRMED"}`);
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");

    return new Response(lines.join("\r\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="galavanteer.ics"',
        "Cache-Control": "no-cache, max-age=0",
      },
    });
  } catch (e: any) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
});
