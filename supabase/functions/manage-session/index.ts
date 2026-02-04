import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const ManageSessionSchema = z.object({
  action: z.enum(["create", "update", "terminate", "check"], { message: "Action must be 'create', 'update', 'terminate', or 'check'" }),
  sessionToken: z.string().uuid({ message: "Invalid session token format" }).optional(),
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify the user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = ManageSessionSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request data",
          details: validationResult.error.errors[0]?.message 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { action, sessionToken } = validationResult.data;

    // Get client info
    const ip_address = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
                      req.headers.get("x-real-ip") || 
                      "unknown";
    const user_agent = req.headers.get("user-agent") || "unknown";

    if (action === "create") {
      // Clean up expired sessions first
      await supabaseClient.rpc("cleanup_expired_sessions");

      // Create new session
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      const { error: insertError } = await supabaseClient
        .from("active_sessions")
        .insert({
          user_id: user.id,
          user_email: user.email!,
          session_token: token,
          ip_address,
          user_agent,
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        throw insertError;
      }

      console.log(`Session created for ${user.email}`);

      return new Response(
        JSON.stringify({ sessionToken: token, expiresAt }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } else if (action === "update") {
      if (!sessionToken) {
        return new Response(
          JSON.stringify({ error: "Session token required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Update last activity
      const { error: updateError } = await supabaseClient
        .from("active_sessions")
        .update({ 
          last_activity: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        })
        .eq("session_token", sessionToken)
        .eq("user_id", user.id);

      if (updateError) {
        throw updateError;
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } else if (action === "terminate") {
      if (!sessionToken) {
        return new Response(
          JSON.stringify({ error: "Session token required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Terminate session
      const { error: deleteError } = await supabaseClient
        .from("active_sessions")
        .delete()
        .eq("session_token", sessionToken);

      if (deleteError) {
        throw deleteError;
      }

      console.log(`Session terminated for ${user.email}`);

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } else if (action === "check") {
      if (!sessionToken) {
        return new Response(
          JSON.stringify({ error: "Session token required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Check if session is still valid
      const { data, error } = await supabaseClient
        .from("active_sessions")
        .select("*")
        .eq("session_token", sessionToken)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ valid: false }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      // Check if session has expired (30 minutes of inactivity)
      const lastActivity = new Date(data.last_activity);
      const now = new Date();
      const minutesSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

      if (minutesSinceActivity > 30) {
        // Session expired, delete it
        await supabaseClient
          .from("active_sessions")
          .delete()
          .eq("session_token", sessionToken);

        return new Response(
          JSON.stringify({ valid: false, reason: "expired" }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      return new Response(
        JSON.stringify({ valid: true, lastActivity: data.last_activity }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in manage-session function:", error);
    return new Response(
      JSON.stringify({ error: "Operation failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
