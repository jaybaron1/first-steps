import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PageSpeedMetrics {
  LARGEST_CONTENTFUL_PAINT_MS?: { numericValue: number };
  FIRST_INPUT_DELAY_MS?: { numericValue: number };
  CUMULATIVE_LAYOUT_SHIFT_SCORE?: { numericValue: number };
  FIRST_CONTENTFUL_PAINT_MS?: { numericValue: number };
  INTERACTIVE?: { numericValue: number };
  TOTAL_BLOCKING_TIME_MS?: { numericValue: number };
  SPEED_INDEX?: { numericValue: number };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Lighthouse audit...');
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get API keys from environment
    const pageSpeedApiKey = Deno.env.get('PAGESPEED_API_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const alertEmail = Deno.env.get('ALERT_EMAIL');

    if (!pageSpeedApiKey || !resendApiKey || !alertEmail) {
      throw new Error('Missing required environment variables');
    }

    // Get the URL to audit (default to the production URL)
    const auditUrl = Deno.env.get('VITE_SITE_URL') || 'https://brandoncarlcoaching.com';
    
    console.log(`Auditing URL: ${auditUrl}`);

    // Call PageSpeed Insights API
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(auditUrl)}&key=${pageSpeedApiKey}&category=performance&category=accessibility&category=best-practices&category=seo&category=pwa`;
    
    const response = await fetch(pageSpeedUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PageSpeed API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Received PageSpeed data');

    // Extract scores (0-100 scale)
    const lighthouseResult = data.lighthouseResult;
    const categories = lighthouseResult.categories;
    
    const performanceScore = categories.performance?.score ? categories.performance.score * 100 : null;
    const seoScore = categories.seo?.score ? categories.seo.score * 100 : null;
    const accessibilityScore = categories.accessibility?.score ? categories.accessibility.score * 100 : null;
    const bestPracticesScore = categories['best-practices']?.score ? categories['best-practices'].score * 100 : null;
    const pwaScore = categories.pwa?.score ? categories.pwa.score * 100 : null;

    // Extract Core Web Vitals
    const audits = lighthouseResult.audits as PageSpeedMetrics;
    const lcp = audits.LARGEST_CONTENTFUL_PAINT_MS?.numericValue || null;
    const fid = audits.FIRST_INPUT_DELAY_MS?.numericValue || null;
    const cls = audits.CUMULATIVE_LAYOUT_SHIFT_SCORE?.numericValue || null;
    const fcp = audits.FIRST_CONTENTFUL_PAINT_MS?.numericValue || null;
    const tti = audits.INTERACTIVE?.numericValue || null;
    const tbt = audits.TOTAL_BLOCKING_TIME_MS?.numericValue || null;
    const speedIndex = audits.SPEED_INDEX?.numericValue || null;

    console.log('Scores:', { performanceScore, seoScore, accessibilityScore, bestPracticesScore });

    // Store results in database
    const { error: dbError } = await supabase
      .from('lighthouse_audits')
      .insert({
        url: auditUrl,
        performance_score: performanceScore,
        seo_score: seoScore,
        accessibility_score: accessibilityScore,
        best_practices_score: bestPracticesScore,
        pwa_score: pwaScore,
        largest_contentful_paint: lcp,
        first_input_delay: fid,
        cumulative_layout_shift: cls,
        first_contentful_paint: fcp,
        time_to_interactive: tti,
        total_blocking_time: tbt,
        speed_index: speedIndex,
        audit_data: lighthouseResult,
        status: 'completed'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Audit results saved to database');

    // Check if any scores are below thresholds and send email alert
    const thresholds = {
      performance: 90,
      seo: 90,
      accessibility: 90,
      bestPractices: 90
    };

    const alerts = [];
    if (performanceScore !== null && performanceScore < thresholds.performance) {
      alerts.push(`Performance: ${performanceScore.toFixed(1)}/100 (threshold: ${thresholds.performance})`);
    }
    if (seoScore !== null && seoScore < thresholds.seo) {
      alerts.push(`SEO: ${seoScore.toFixed(1)}/100 (threshold: ${thresholds.seo})`);
    }
    if (accessibilityScore !== null && accessibilityScore < thresholds.accessibility) {
      alerts.push(`Accessibility: ${accessibilityScore.toFixed(1)}/100 (threshold: ${thresholds.accessibility})`);
    }
    if (bestPracticesScore !== null && bestPracticesScore < thresholds.bestPractices) {
      alerts.push(`Best Practices: ${bestPracticesScore.toFixed(1)}/100 (threshold: ${thresholds.bestPractices})`);
    }

    // Send email with results
    const resend = new Resend(resendApiKey);
    
    const emailSubject = alerts.length > 0 
      ? `🚨 Lighthouse Alert: Performance Issues Detected`
      : `✅ Lighthouse Report: All Metrics Passing`;

    const emailBody = `
      <h1>Lighthouse Audit Report</h1>
      <p><strong>URL:</strong> ${auditUrl}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      
      <h2>Scores</h2>
      <ul>
        <li>Performance: ${performanceScore?.toFixed(1) || 'N/A'}/100 ${performanceScore && performanceScore >= thresholds.performance ? '✅' : '⚠️'}</li>
        <li>SEO: ${seoScore?.toFixed(1) || 'N/A'}/100 ${seoScore && seoScore >= thresholds.seo ? '✅' : '⚠️'}</li>
        <li>Accessibility: ${accessibilityScore?.toFixed(1) || 'N/A'}/100 ${accessibilityScore && accessibilityScore >= thresholds.accessibility ? '✅' : '⚠️'}</li>
        <li>Best Practices: ${bestPracticesScore?.toFixed(1) || 'N/A'}/100 ${bestPracticesScore && bestPracticesScore >= thresholds.bestPractices ? '✅' : '⚠️'}</li>
        <li>PWA: ${pwaScore?.toFixed(1) || 'N/A'}/100</li>
      </ul>

      <h2>Core Web Vitals</h2>
      <ul>
        <li>Largest Contentful Paint: ${lcp ? (lcp / 1000).toFixed(2) + 's' : 'N/A'}</li>
        <li>First Input Delay: ${fid ? fid.toFixed(2) + 'ms' : 'N/A'}</li>
        <li>Cumulative Layout Shift: ${cls?.toFixed(3) || 'N/A'}</li>
        <li>First Contentful Paint: ${fcp ? (fcp / 1000).toFixed(2) + 's' : 'N/A'}</li>
        <li>Time to Interactive: ${tti ? (tti / 1000).toFixed(2) + 's' : 'N/A'}</li>
        <li>Total Blocking Time: ${tbt ? tbt.toFixed(2) + 'ms' : 'N/A'}</li>
        <li>Speed Index: ${speedIndex ? (speedIndex / 1000).toFixed(2) + 's' : 'N/A'}</li>
      </ul>

      ${alerts.length > 0 ? `
        <h2>⚠️ Issues Requiring Attention</h2>
        <ul>
          ${alerts.map(alert => `<li>${alert}</li>`).join('')}
        </ul>
      ` : '<p>✅ All metrics are within acceptable thresholds!</p>'}

      <p><a href="${auditUrl}">View your site</a></p>
    `;

    const emailResult = await resend.emails.send({
      from: 'Lighthouse Audits <onboarding@resend.dev>',
      to: [alertEmail],
      subject: emailSubject,
      html: emailBody,
    });

    console.log('Email sent:', emailResult);

    return new Response(
      JSON.stringify({
        success: true,
        scores: {
          performance: performanceScore,
          seo: seoScore,
          accessibility: accessibilityScore,
          bestPractices: bestPracticesScore,
          pwa: pwaScore
        },
        alerts: alerts.length,
        emailSent: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in lighthouse-audit function:', error);
    
    // Try to log error to database
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      await supabase.from('lighthouse_audits').insert({
        url: Deno.env.get('VITE_SITE_URL') || 'https://brandoncarlcoaching.com',
        status: 'failed',
        error_message: error.message
      });
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});