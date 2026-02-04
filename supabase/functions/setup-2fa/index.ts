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
const Setup2FASchema = z.object({
  action: z.enum(["generate", "verify", "disable"], { message: "Action must be 'generate', 'verify', or 'disable'" }),
  token: z.string().min(6).max(8).optional(),
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use service role for secure operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
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
    const validationResult = Setup2FASchema.safeParse(body);

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

    const { action, token } = validationResult.data;

    if (action === "generate") {
      // Generate new TOTP secret
      const secret = new OTPAuth.Secret();
      const totp = new OTPAuth.TOTP({
        issuer: "Brandon Carl Coaching",
        label: user.email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret,
      });

      // Generate backup codes (8 codes)
      const backupCodes = Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () =>
          Math.floor(Math.random() * 10)
        ).join("")
      );

      // Store secret in database (not yet enabled)
      const { error: insertError } = await supabaseClient
        .from("mfa_secrets")
        .upsert({
          user_id: user.id,
          secret: secret.base32,
          enabled: false,
          backup_codes: backupCodes,
        });

      if (insertError) {
        console.error("Error storing MFA secret:", insertError);
        throw insertError;
      }

      // Generate QR code URL - never expose the secret to client
      const qrCodeUrl = totp.toString();

      console.log(`Generated 2FA secret for ${user.email}`);

      // Only return QR code URL and backup codes, NOT the secret
      return new Response(
        JSON.stringify({
          qrCodeUrl,
          backupCodes,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } else if (action === "verify") {
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Token is required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Get user's MFA secret using service role
      const { data: mfaData, error: mfaError } = await supabaseClient
        .from("mfa_secrets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (mfaError || !mfaData) {
        console.error(`2FA setup not found for user ${user.email}`);
        return new Response(
          JSON.stringify({ error: "Setup not found", valid: false }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Verify token
      const totp = new OTPAuth.TOTP({
        issuer: "Brandon Carl Coaching",
        label: user.email,
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
          
          // Enable 2FA and update codes
          await supabaseClient
            .from("mfa_secrets")
            .update({ backup_codes: updatedCodes, enabled: true })
            .eq("user_id", user.id);

          console.log(`2FA enabled with backup code for ${user.email}`);

          return new Response(
            JSON.stringify({
              valid: true,
              message: "Setup verified successfully",
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

        console.error(`Invalid verification token for user ${user.email}`);
        return new Response(
          JSON.stringify({ error: "Verification failed", valid: false }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Enable 2FA if this is first verification
      if (!mfaData.enabled) {
        await supabaseClient
          .from("mfa_secrets")
          .update({ enabled: true })
          .eq("user_id", user.id);

        console.log(`2FA enabled for ${user.email}`);
      }

      return new Response(
        JSON.stringify({
          valid: true,
          message: "Setup verified successfully",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } else if (action === "disable") {
      // Disable 2FA
      const { error: deleteError } = await supabaseClient
        .from("mfa_secrets")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      console.log(`2FA disabled for ${user.email}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: "2FA disabled successfully",
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

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in setup-2fa function:", error);
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
