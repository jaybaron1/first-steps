import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const ManageRoleSchema = z.object({
  targetUserId: z.string().uuid({ message: "Invalid user ID format" }),
  targetUserEmail: z.string().email({ message: "Invalid email format" }).max(255),
  action: z.enum(["grant", "revoke"], { message: "Action must be 'grant' or 'revoke'" }),
  role: z.enum(["admin", "user"], { message: "Role must be 'admin' or 'user'" }),
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

    // Verify the user is authenticated and is an admin
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

    // Check if requesting user is admin
    const { data: isAdmin } = await supabaseClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Access denied" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = ManageRoleSchema.safeParse(body);

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

    const { targetUserId, targetUserEmail, action, role } = validationResult.data;

    if (action === "grant") {
      // Grant role
      const { error: insertError } = await supabaseClient
        .from("user_roles")
        .insert({
          user_id: targetUserId,
          role: role,
        });

      if (insertError) {
        // Check if role already exists
        if (insertError.code === "23505") {
          return new Response(
            JSON.stringify({ error: "Operation failed" }),
            { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        throw insertError;
      }

      console.log(`Role granted to ${targetUserEmail} by ${user.email}`);
    } else if (action === "revoke") {
      // Revoke role
      const { error: deleteError } = await supabaseClient
        .from("user_roles")
        .delete()
        .eq("user_id", targetUserId)
        .eq("role", role);

      if (deleteError) {
        throw deleteError;
      }

      console.log(`Role revoked from ${targetUserEmail} by ${user.email}`);
    }

    // Log the action in audit logs
    await supabaseClient.from("audit_logs").insert({
      user_id: user.id,
      user_email: user.email!,
      action: `role_${action}`,
      details: {
        targetUserId,
        targetUserEmail,
        role,
      },
      ip_address: req.headers.get("x-forwarded-for") || "unknown",
      user_agent: req.headers.get("user-agent") || "unknown",
    });

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
  } catch (error: any) {
    console.error("Error in manage-user-role function:", error);
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
