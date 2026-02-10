import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadNotification {
  name: string;
  email: string;
  role: string;
  interest: string;
  serviceDisplay: string;
  thinkingPartner: string;
  whatWouldChange: string;
  customResponse: string;
  additionalContext: string;
  conversation: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: LeadNotification = await req.json();

    if (!data.name || !data.email) {
      throw new Error("Missing name or email");
    }

    const emailResponse = await resend.emails.send({
      from: "Galavanteer Leads <onboarding@resend.dev>",
      to: ["jason@galavanteer.com"],
      subject: `🔥 New Lead: ${data.name} — ${data.serviceDisplay || "Unknown"}`,
      html: `
        <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #FDFBF7; border: 1px solid #E8E2D8; padding: 32px;">
          <div style="border-bottom: 2px solid #B8956C; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="margin: 0; font-size: 22px; color: #1A1915;">New Lead Captured</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: #8A8478;">${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1A1915;">
            <tr><td style="padding: 8px 0; font-weight: 600; width: 140px; vertical-align: top;">Name</td><td style="padding: 8px 0;">${data.name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #B8956C;">${data.email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Role</td><td style="padding: 8px 0;">${data.role || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Interest</td><td style="padding: 8px 0; color: #B8956C; font-weight: 600;">${data.serviceDisplay || data.interest || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Thinking Partner</td><td style="padding: 8px 0;">${data.thinkingPartner || "Not specified"}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">What Would Change</td><td style="padding: 8px 0;">${data.whatWouldChange || "Not specified"}</td></tr>
            ${data.additionalContext ? `<tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Additional Context</td><td style="padding: 8px 0;">${data.additionalContext}</td></tr>` : ""}
          </table>

          ${data.conversation ? `
          <div style="margin-top: 24px; padding: 16px; background: #F5F0E8; border-left: 3px solid #B8956C;">
            <h3 style="margin: 0 0 12px; font-size: 14px; color: #1A1915;">Full Conversation</h3>
            <pre style="margin: 0; font-size: 12px; line-height: 1.6; color: #4A4640; white-space: pre-wrap; font-family: 'Helvetica Neue', sans-serif;">${data.conversation}</pre>
          </div>` : ""}
        </div>
      `,
    });

    console.log("Lead notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending lead notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
