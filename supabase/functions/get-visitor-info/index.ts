import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get IP address from various headers (in order of reliability)
    const ip = 
      req.headers.get('x-real-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') ||
      'unknown';

    // Supabase Edge Functions have access to geo data via Deno
    // Try to get geo info from the request context
    let country: string | null = null;
    let city: string | null = null;

    // Check for Cloudflare geo headers (if behind Cloudflare)
    const cfCountry = req.headers.get('cf-ipcountry');
    if (cfCountry) {
      country = cfCountry;
    }

    // Check for Vercel geo headers
    const vercelCountry = req.headers.get('x-vercel-ip-country');
    const vercelCity = req.headers.get('x-vercel-ip-city');
    if (vercelCountry) {
      country = vercelCountry;
    }
    if (vercelCity) {
      city = decodeURIComponent(vercelCity);
    }

    // Log for debugging
    console.log('[get-visitor-info] IP:', ip, 'Country:', country, 'City:', city);

    return new Response(
      JSON.stringify({
        ip_address: ip !== 'unknown' ? ip : null,
        country,
        city,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[get-visitor-info] Error:', error);
    return new Response(
      JSON.stringify({
        ip_address: null,
        country: null,
        city: null,
        error: 'Failed to get visitor info',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
