import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

const buildICS = (a: any, clientName: string) => {
  const start = new Date(a.scheduled_at);
  const end = new Date(start.getTime() + (a.duration_minutes || 30) * 60000);
  const ts = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Galavanteer//Partners CRM//EN",
    "BEGIN:VEVENT",
    `UID:${a.ics_uid}`,
    `DTSTAMP:${ts(new Date())}`,
    `DTSTART:${ts(start)}`,
    `DTEND:${ts(end)}`,
    `SUMMARY:${a.title} — ${clientName}`,
    a.location ? `LOCATION:${a.location}` : "",
    a.notes ? `DESCRIPTION:${a.notes.replace(/\n/g, "\\n")}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appointment_id } = await req.json();
    if (!appointment_id) throw new Error("appointment_id required");

    const { data: appt, error } = await supabase
      .from("appointments")
      .select("*, partner_clients(client_name, contact_name, email)")
      .eq("id", appointment_id)
      .single();
    if (error || !appt) throw new Error(error?.message || "Appointment not found");

    const clientName = appt.partner_clients?.client_name || "Unknown client";

    // Recipients: admin always, owning SDR
    const recipients = new Set<string>(["jason@galavanteer.com"]);
    const { data: ownerData } = await supabase.auth.admin.getUserById(appt.owner_id);
    if (ownerData?.user?.email) recipients.add(ownerData.user.email);

    const ics = buildICS(appt, clientName);

    await resend.emails.send({
      from: "Galavanteer Scheduling <onboarding@resend.dev>",
      to: Array.from(recipients),
      subject: `📅 New appointment: ${appt.title} — ${clientName}`,
      html: `
        <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;background:#FDFBF7;border:1px solid #E8E2D8;padding:32px">
          <div style="border-bottom:2px solid #B8956C;padding-bottom:16px;margin-bottom:24px">
            <h1 style="margin:0;font-size:22px;color:#1A1915">New Appointment</h1>
            <p style="margin:4px 0 0;font-size:13px;color:#8A8478">Logged ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1A1915">
            <tr><td style="padding:8px 0;font-weight:600;width:140px">Title</td><td>${appt.title}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">Client</td><td>${clientName}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">When</td><td style="color:#B8956C;font-weight:600">${fmt(appt.scheduled_at)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">Duration</td><td>${appt.duration_minutes} min</td></tr>
            ${appt.location ? `<tr><td style="padding:8px 0;font-weight:600">Location</td><td>${appt.location}</td></tr>` : ""}
            ${appt.meeting_link ? `<tr><td style="padding:8px 0;font-weight:600">Link</td><td><a href="${appt.meeting_link}" style="color:#B8956C">${appt.meeting_link}</a></td></tr>` : ""}
            ${appt.notes ? `<tr><td style="padding:8px 0;font-weight:600;vertical-align:top">Notes</td><td>${appt.notes.replace(/\n/g, "<br>")}</td></tr>` : ""}
          </table>
          <p style="margin-top:24px;font-size:12px;color:#8A8478">Calendar invite (.ics) attached.</p>
        </div>`,
      attachments: [
        {
          filename: `${appt.title.replace(/[^a-z0-9]/gi, "_")}.ics`,
          content: btoa(ics),
        },
      ],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e: any) {
    console.error("notify-appointment error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
