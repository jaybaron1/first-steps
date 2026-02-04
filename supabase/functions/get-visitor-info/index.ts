import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Country code to name mapping for common codes
const countryCodeToName: Record<string, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'BE': 'Belgium',
  'IE': 'Ireland',
  'PT': 'Portugal',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'JP': 'Japan',
  'CN': 'China',
  'KR': 'South Korea',
  'IN': 'India',
  'SG': 'Singapore',
  'HK': 'Hong Kong',
  'TW': 'Taiwan',
  'MY': 'Malaysia',
  'TH': 'Thailand',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'AR': 'Argentina',
  'CL': 'Chile',
  'CO': 'Colombia',
  'ZA': 'South Africa',
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
  'IL': 'Israel',
  'RU': 'Russia',
  'UA': 'Ukraine',
  'NZ': 'New Zealand',
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

    let country: string | null = null;
    let city: string | null = null;

    // Check for Cloudflare geo headers (if behind Cloudflare)
    const cfCountry = req.headers.get('cf-ipcountry');
    if (cfCountry && cfCountry !== 'XX') {
      country = countryCodeToName[cfCountry] || cfCountry;
    }

    // Check for Vercel geo headers
    const vercelCountry = req.headers.get('x-vercel-ip-country');
    const vercelCity = req.headers.get('x-vercel-ip-city');
    if (vercelCountry) {
      country = countryCodeToName[vercelCountry] || vercelCountry;
    }
    if (vercelCity) {
      city = decodeURIComponent(vercelCity);
    }

    // If no geo headers, try ipinfo.io (more reliable with edge function IPs)
    if (!country && ip !== 'unknown' && ip !== '127.0.0.1') {
      try {
        // ipinfo.io allows up to 50k requests/month without API key
        const geoResponse = await fetch(`https://ipinfo.io/${ip}/json`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.country) {
            country = countryCodeToName[geoData.country] || geoData.country;
            city = geoData.city || null;
          }
        }
      } catch (geoError) {
        console.warn('[get-visitor-info] Geo lookup failed:', geoError);
      }
    }

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
