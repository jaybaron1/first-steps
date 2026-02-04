import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse the request body
    const body = await req.text();
    const data = JSON.parse(body);

    const { session_id, page_url, time_on_page, scroll_depth } = data;

    if (!session_id || !page_url) {
      console.log('[track-page-exit] Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[track-page-exit] Updating page view:', {
      session_id,
      page_url,
      time_on_page,
      scroll_depth,
    });

    // Update the most recent page view for this session and URL
    const { error: pageViewError } = await supabase
      .from('page_views')
      .update({
        time_on_page: time_on_page || 0,
        scroll_depth: scroll_depth || 0,
      })
      .eq('session_id', session_id)
      .eq('page_url', page_url)
      .order('created_at', { ascending: false })
      .limit(1);

    if (pageViewError) {
      console.error('[track-page-exit] Error updating page view:', pageViewError);
    }

    // Update session total time
    const { data: sessionData } = await supabase
      .from('visitor_sessions')
      .select('total_time_seconds')
      .eq('session_id', session_id)
      .maybeSingle();

    if (sessionData) {
      const { error: sessionError } = await supabase
        .from('visitor_sessions')
        .update({
          total_time_seconds: (sessionData.total_time_seconds || 0) + (time_on_page || 0),
          last_seen: new Date().toISOString(),
        })
        .eq('session_id', session_id);

      if (sessionError) {
        console.error('[track-page-exit] Error updating session:', sessionError);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[track-page-exit] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
