import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface CompanyData {
  company_name: string | null;
  company_size: string | null;
  company_industry: string | null;
  company_domain: string | null;
}

interface ClearbitRevealResponse {
  company?: {
    name?: string;
    domain?: string;
    metrics?: {
      employeesRange?: string;
    };
    category?: {
      industry?: string;
    };
  };
}

async function enrichWithClearbit(ip: string): Promise<CompanyData | null> {
  const clearbitApiKey = Deno.env.get('CLEARBIT_API_KEY');
  
  if (!clearbitApiKey) {
    console.log('[enrich-visitor] CLEARBIT_API_KEY not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://reveal.clearbit.com/v1/companies/find?ip=${encodeURIComponent(ip)}`,
      {
        headers: {
          'Authorization': `Bearer ${clearbitApiKey}`,
        },
      }
    );

    if (response.status === 404) {
      // No company found for this IP (likely consumer/residential IP)
      console.log('[enrich-visitor] No company found for IP:', ip);
      return null;
    }

    if (!response.ok) {
      console.error('[enrich-visitor] Clearbit API error:', response.status);
      return null;
    }

    const data: ClearbitRevealResponse = await response.json();

    if (!data.company) {
      return null;
    }

    return {
      company_name: data.company.name || null,
      company_domain: data.company.domain || null,
      company_size: data.company.metrics?.employeesRange || null,
      company_industry: data.company.category?.industry || null,
    };
  } catch (error) {
    console.error('[enrich-visitor] Error calling Clearbit:', error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { ip_address, session_id, email } = await req.json();

    if (!ip_address) {
      return new Response(
        JSON.stringify({ error: 'ip_address is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[enrich-visitor] Enriching IP:', ip_address);

    // Try Clearbit enrichment
    const companyData = await enrichWithClearbit(ip_address);

    if (!companyData) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No company data found for this IP',
          data: null,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[enrich-visitor] Found company:', companyData.company_name);

    // If session_id provided, update the visitor_sessions table
    if (session_id) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: updateError } = await supabase
        .from('visitor_sessions')
        .update({
          company_name: companyData.company_name,
          company_size: companyData.company_size,
          company_industry: companyData.company_industry,
        })
        .eq('session_id', session_id);

      if (updateError) {
        console.error('[enrich-visitor] Error updating session:', updateError);
      } else {
        console.log('[enrich-visitor] Updated session:', session_id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: companyData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[enrich-visitor] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
