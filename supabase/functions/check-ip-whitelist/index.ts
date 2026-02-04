import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simple IP validation function
const isValidIP = (ip: string): boolean => {
  // IPv4 regex
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 regex (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  
  if (ipv4Regex.test(ip)) {
    // Validate IPv4 octets are 0-255
    const octets = ip.split('.');
    return octets.every(octet => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  return ipv6Regex.test(ip);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    // Get client IP
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

    // Validate IP format
    if (ipAddress === "unknown" || !isValidIP(ipAddress)) {
      console.error(`Invalid IP address format: ${ipAddress}`);
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          error: "Invalid IP address format"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log(`Checking IP: ${ipAddress}`);

    // Check if there are any whitelist entries
    const { data: whitelistCount } = await supabaseClient
      .from("ip_whitelist")
      .select("id", { count: "exact", head: true });

    // If whitelist is empty, allow access (whitelist not yet configured)
    if (!whitelistCount) {
      console.log("IP whitelist not configured, allowing access");
      return new Response(
        JSON.stringify({ 
          allowed: true
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

    // Check if IP is whitelisted
    const { data: isWhitelisted } = await supabaseClient.rpc("is_ip_whitelisted", {
      _ip_address: ipAddress,
    });

    if (isWhitelisted) {
      console.log(`IP ${ipAddress} is whitelisted`);
      return new Response(
        JSON.stringify({ allowed: true }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log(`IP ${ipAddress} is NOT whitelisted`);
    return new Response(
      JSON.stringify({ 
        allowed: false, 
        message: "Access denied"
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in check-ip-whitelist function:", error);
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
