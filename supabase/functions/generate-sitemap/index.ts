import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  images?: Array<{ url: string; title: string }>;
  videos?: Array<{ thumbnailUrl: string; title: string; description: string }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const baseUrl = 'https://galavanteer.com';
    const currentDate = new Date().toISOString().split('T')[0];

    // Define static pages with their metadata
    const staticPages: SitemapURL[] = [
      {
        loc: '/',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '1.0',
        images: [
          { url: '/social-images/homepage-og.jpg', title: 'Galavanteer Custom AI Solutions' },
          { url: '/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png', title: 'Galavanteer Logo' }
        ]
      },
      {
        loc: '/about',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8',
        images: [
          { url: '/social-images/about-og.jpg', title: 'About Galavanteer' }
        ]
      },
      {
        loc: '/examples',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.9',
        images: [
          { url: '/social-images/examples-og.jpg', title: 'AI Examples and Case Studies' }
        ],
        videos: [
          {
            thumbnailUrl: '/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png',
            title: 'Custom AI Solutions Demo',
            description: 'Interactive demonstrations of custom AI assistants and GPT systems'
          }
        ]
      },
      {
        loc: '/real-wins',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.9',
        images: [
          { url: '/social-images/examples-og.jpg', title: 'Real Client Wins' }
        ]
      },
      {
        loc: '/experience',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.9',
        images: [
          { url: '/social-images/experience-og.jpg', title: 'Experience Galavanteer AI' }
        ]
      },
      {
        loc: '/pricing',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8',
        images: [
          { url: '/social-images/pricing-og.jpg', title: 'AI Solutions Pricing' }
        ]
      },
      {
        loc: '/clarity',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7',
        images: [
          { url: '/social-images/clarity-og.jpg', title: 'Clarity Session' }
        ]
      },
      {
        loc: '/faq',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6',
        images: [
          { url: '/social-images/faq-og.jpg', title: 'Frequently Asked Questions' }
        ]
      },
      {
        loc: '/privacy',
        lastmod: currentDate,
        changefreq: 'yearly',
        priority: '0.3'
      }
    ];

    // Generate XML sitemap
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    sitemap += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
    sitemap += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

    for (const page of staticPages) {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${page.loc}</loc>\n`;
      sitemap += `    <lastmod>${page.lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;

      // Add images
      if (page.images) {
        for (const image of page.images) {
          sitemap += '    <image:image>\n';
          sitemap += `      <image:loc>${baseUrl}${image.url}</image:loc>\n`;
          sitemap += `      <image:title>${image.title}</image:title>\n`;
          sitemap += '    </image:image>\n';
        }
      }

      // Add videos
      if (page.videos) {
        for (const video of page.videos) {
          sitemap += '    <video:video>\n';
          sitemap += `      <video:thumbnail_loc>${baseUrl}${video.thumbnailUrl}</video:thumbnail_loc>\n`;
          sitemap += `      <video:title>${video.title}</video:title>\n`;
          sitemap += `      <video:description>${video.description}</video:description>\n`;
          sitemap += '    </video:video>\n';
        }
      }

      sitemap += '  </url>\n';
    }

    sitemap += '</urlset>';

    console.log('Sitemap generated successfully');

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
