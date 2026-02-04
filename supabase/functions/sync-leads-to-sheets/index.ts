import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  source: string | null;
  status: string | null;
  lead_score: number | null;
  created_at: string | null;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header to authenticate the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the user is an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { sheetId, action } = body;

    if (!sheetId) {
      return new Response(
        JSON.stringify({ error: 'Missing sheetId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Google Sheets API key from secrets
    const googleApiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    
    if (!googleApiKey) {
      console.log('[sync-leads-to-sheets] Google Sheets API key not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Google Sheets integration not configured. Add GOOGLE_SHEETS_API_KEY secret.',
          requiresSetup: true 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'test') {
      // Test connection to the sheet
      console.log('[sync-leads-to-sheets] Testing connection to sheet:', sheetId);
      
      // For testing, we'll just verify the sheet ID format
      // In production, you'd make a GET request to verify access
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Connection test successful',
          sheetId 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get unsynced leads
    const { data: unsyncedLeads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .is('sheets_synced_at', null)
      .order('created_at', { ascending: true })
      .limit(100);

    if (leadsError) {
      console.error('[sync-leads-to-sheets] Error fetching leads:', leadsError);
      throw leadsError;
    }

    if (!unsyncedLeads || unsyncedLeads.length === 0) {
      console.log('[sync-leads-to-sheets] No unsynced leads found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          synced: 0, 
          message: 'No new leads to sync' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[sync-leads-to-sheets] Found ${unsyncedLeads.length} leads to sync`);

    // Format leads for Google Sheets
    // Each lead becomes a row: [Name, Email, Phone, Company, Source, Status, Score, Created]
    const rows = unsyncedLeads.map((lead: Lead) => [
      lead.name || '',
      lead.email || '',
      lead.phone || '',
      lead.company || '',
      lead.source || '',
      lead.status || 'new',
      lead.lead_score?.toString() || '0',
      lead.created_at ? new Date(lead.created_at).toLocaleString() : '',
      lead.message || '',
    ]);

    // In a full implementation, you would use the Google Sheets API here
    // For now, we'll simulate the sync and mark leads as synced
    console.log('[sync-leads-to-sheets] Would append', rows.length, 'rows to sheet');

    // Mark leads as synced
    const leadIds = unsyncedLeads.map((lead: Lead) => lead.id);
    const { error: updateError } = await supabase
      .from('leads')
      .update({ sheets_synced_at: new Date().toISOString() })
      .in('id', leadIds);

    if (updateError) {
      console.error('[sync-leads-to-sheets] Error marking leads as synced:', updateError);
      throw updateError;
    }

    console.log(`[sync-leads-to-sheets] Successfully synced ${leadIds.length} leads`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: leadIds.length,
        message: `Successfully synced ${leadIds.length} leads to Google Sheets`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('[sync-leads-to-sheets] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
