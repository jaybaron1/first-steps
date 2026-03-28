import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { name, email, title, companyWebsite, source } = await req.json();

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !title?.trim()) {
      return new Response(
        JSON.stringify({ error: "Name, email, and title are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedTitle = title.trim();

    // Rate limiting: check IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") || "unknown";

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("source", "free_trial")
      .gte("created_at", oneHourAgo)
      .filter("metadata->>ip_address", "eq", ip);

    if ((recentCount ?? 0) >= 3) {
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Duplicate check: same email within last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count: dupCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("email", trimmedEmail)
      .eq("source", "free_trial")
      .gte("created_at", thirtyDaysAgo);

    if ((dupCount ?? 0) > 0) {
      return new Response(
        JSON.stringify({
          error: "You've already signed up. Check your email or contact jason@galavanteer.com",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save to leads table
    const metadata = {
      type: "free_trial",
      title: trimmedTitle,
      company_website: companyWebsite || null,
      source: source || "Direct",
      ip_address: ip,
      timestamp: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from("leads").insert({
      name: trimmedName,
      email: trimmedEmail,
      company: companyWebsite || null,
      source: "free_trial",
      status: "new",
      metadata,
    });

    if (insertError) {
      console.error("Failed to save lead:", insertError);
    }

    // Send emails via Resend
    const resend = new Resend(RESEND_API_KEY);
    const now = new Date();
    const ptTime = now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

    const adminSubject = `New Free Trial Signup - ${trimmedName}${companyWebsite ? ` from ${companyWebsite}` : ""}`;
    const adminBody = `New Roundtable Free Trial Signup\n\nName: ${trimmedName}\nEmail: ${trimmedEmail}\nTitle/Role: ${trimmedTitle}\nCompany Website: ${companyWebsite || "Not provided"}\n\nSigned up: ${ptTime} PT\nSource: ${source || "Direct"}\n\n---\nNext Steps:\nSet up their Roundtable instance within 24-48 hours.`;

    const firstName = trimmedName.split(" ")[0];
    const userBody = `Hi ${firstName},\n\nYou're in! Your 3-day free trial of The Roundtable is confirmed.\n\nWhat happens next:\n• We'll set up your personal Roundtable within 24-48 hours\n• You'll receive another email with your login credentials and getting started guide\n• Your trial includes full access to 60+ expert personas\n\nWhat you can do while you wait:\n• Think about the first big decision you want to examine\n• Review the Four Levels to understand what's possible: https://galavanteer.com/one-pager\n• Questions? Just reply to this email\n\nWe're excited to have you at the table.\n\nJason Baron\nFounder, Galavanteer\n\n---\nP.S. Didn't sign up for this? Reply and let us know.`;

    const emailPromises = [
      resend.emails.send({
        from: "Jason Baron <jason@galavanteer.com>",
        to: ["john@sharecompany.ai"],
        subject: adminSubject,
        text: adminBody,
      }),
      resend.emails.send({
        from: "Jason Baron <jason@galavanteer.com>",
        to: ["jason@galavanteer.com"],
        subject: adminSubject,
        text: adminBody,
      }),
      resend.emails.send({
        from: "Jason Baron <jason@galavanteer.com>",
        to: [trimmedEmail],
        reply_to: "jason@galavanteer.com",
        subject: "Welcome to The Roundtable - Your Trial Starts Soon",
        text: userBody,
      }),
    ];

    const results = await Promise.allSettled(emailPromises);
    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.error("Some emails failed to send:", failures);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("notify-free-trial error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
