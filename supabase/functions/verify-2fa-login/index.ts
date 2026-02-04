import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import * as OTPAuth from "npm:otpauth@9.1.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const Verify2FASchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID format" }),
  token: z.string().min(6, { message: "Token must be at least 6 characters" }).max(8, { message: "Token must be at most 8 characters" }),
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use service role to access encrypted secrets
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse and validate request body
    const body = await req.json();
    const validationResult = Verify2FASchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ error: "Invalid request data", valid: false }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { userId, token } = validationResult.data;

    // Server-side rate limiting: Check failed attempts in last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count: failedAttempts } = await supabaseClient
      .from("failed_login_attempts")
      .select("*", { count: "exact", head: true })
      .eq("email", (await supabaseClient.auth.admin.getUserById(userId)).data.user?.email || "")
      .gte("attempted_at", fifteenMinutesAgo);

    if (failedAttempts && failedAttempts >= 5) {
      console.error(`Rate limit exceeded for user ${userId}`);
      return new Response(
        JSON.stringify({ error: "Too many failed attempts. Please try again later.", valid: false }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get user's MFA secret using service role
    const { data: mfaData, error: mfaError } = await supabaseClient
      .from("mfa_secrets")
      .select("*")
      .eq("user_id", userId)
      .eq("enabled", true)
      .single();

    if (mfaError || !mfaData) {
      console.error(`2FA verification failed for user ${userId}`);
      return new Response(
        JSON.stringify({ error: "Authentication failed", valid: false }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify token
    const totp = new OTPAuth.TOTP({
      issuer: "Brandon Carl Coaching",
      label: "user",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(mfaData.secret),
    });

    const delta = totp.validate({ token, window: 1 });

    if (delta === null) {
      // Check if it's a backup code
      if (mfaData.backup_codes && mfaData.backup_codes.includes(token)) {
        // Remove used backup code
        const updatedCodes = mfaData.backup_codes.filter((c: string) => c !== token);
        
        await supabaseClient
          .from("mfa_secrets")
          .update({ backup_codes: updatedCodes })
          .eq("user_id", userId);

        console.log(`Backup code used for user ${userId}`);

        return new Response(
          JSON.stringify({
            valid: true,
            message: "Authentication successful",
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      console.error(`Invalid 2FA token for user ${userId}`);
      return new Response(
        JSON.stringify({ error: "Authentication failed", valid: false }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`2FA login verified for user ${userId}`);

    return new Response(
      JSON.stringify({
        valid: true,
        message: "Authentication successful",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-2fa-login function:", error);
    return new Response(
      JSON.stringify({ error: "Authentication failed", valid: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
