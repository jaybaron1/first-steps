import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, sessionToken } = await req.json();

    if (!action || !["create", "update", "terminate"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action. Must be create, update, or terminate." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "create") {
      const token = crypto.randomUUID();

      const { error } = await serviceClient.from("admin_sessions").insert({
        user_id: user.id,
        session_token: token,
      });

      if (error) {
        console.error("Session create error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create session" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify({ sessionToken: token }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!sessionToken || typeof sessionToken !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing sessionToken for update/terminate" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (action === "update") {
      const { error } = await serviceClient
        .from("admin_sessions")
        .update({ last_activity: new Date().toISOString() })
        .eq("session_token", sessionToken)
        .eq("user_id", user.id)
        .is("terminated_at", null);

      if (error) {
        console.error("Session update error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update session" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "terminate") {
      const { error } = await serviceClient
        .from("admin_sessions")
        .update({ terminated_at: new Date().toISOString() })
        .eq("session_token", sessionToken)
        .eq("user_id", user.id)
        .is("terminated_at", null);

      if (error) {
        console.error("Session terminate error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to terminate session" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Session management error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
