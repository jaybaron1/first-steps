import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminSignupRequest {
  newAdminEmail: string;
  signupTime: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { newAdminEmail, signupTime }: AdminSignupRequest = await req.json();

    const alertEmail = Deno.env.get("ALERT_EMAIL");
    
    if (!alertEmail) {
      console.error("ALERT_EMAIL not configured");
      return new Response(
        JSON.stringify({ error: "Alert email not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const formattedTime = new Date(signupTime).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "long",
    });

    const emailResponse = await resend.emails.send({
      from: "Security Alerts <onboarding@resend.dev>",
      to: [alertEmail],
      subject: "🔐 New Admin Account Created",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Security Alert</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">New Admin Account Created</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              A new administrator account has been registered for your dashboard.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Admin Email:</p>
              <p style="margin: 0; color: #1f2937; font-size: 18px; font-weight: bold;">${newAdminEmail}</p>
              
              <p style="margin: 20px 0 10px 0; color: #6b7280; font-size: 14px;">Time:</p>
              <p style="margin: 0; color: #1f2937;">${formattedTime}</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⚠️ Security Reminder:</strong> If you did not authorize this account creation, 
                please review your admin users immediately and take appropriate action.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                This is an automated security notification from Brandon Carl Coaching Dashboard.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Admin signup notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-admin-signup function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
