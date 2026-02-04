
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageType?: string;
  schemaData?: object;
  pageType?: 'website' | 'article' | 'service' | 'product';
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleTags?: string[];
  productPrice?: string;
  productCurrency?: string;
  twitterLabel1?: string;
  twitterData1?: string;
  twitterLabel2?: string;
  twitterData2?: string;
}

const SEOHead = ({
  title = "Galavanteer | AI Systems & Custom GPTs for Business",
  description = "Design custom GPTs and AI systems for business automation, personal productivity, and creative workflows. We build intelligent tools that think with you.",
  keywords = "custom GPT, AI systems, business automation, productivity tools, artificial intelligence, workflow automation, personal AI assistant",
  canonicalUrl,
  ogImage = "https://zmlxeqfvdnjnzctyhimq.supabase.co/storage/v1/object/public/public-assets/social_preview.png",
  ogImageWidth = "1200",
  ogImageHeight = "630",
  ogImageType = "image/png",
  schemaData,
  pageType = 'website',
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  articleTags,
  productPrice,
  productCurrency = "USD",
  twitterLabel1,
  twitterData1,
  twitterLabel2,
  twitterData2
}: SEOHeadProps) => {
   const currentUrl = typeof window !== "undefined" ? (canonicalUrl || window.location.href) : canonicalUrl || "https://galavanteer.com";
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "name": "Galavanteer Custom AI Solutions",
    "alternateName": "Galavanteer",
    "url": "https://galavanteer.com",
    "logo": "https://galavanteer.com/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png",
    "image": "https://galavanteer.com/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png",
    "founder": {
      "@type": "Person",
      "name": "Jason Baron",
      "jobTitle": "Founder & AI Systems Developer",
      "email": "jason@galavanteer.com",
      "url": "https://galavanteer.com/about",
      "sameAs": [
        "https://www.linkedin.com/in/jasondbaron",
        "https://jasondbaron.com"
      ]
    },
    "description": "Custom AI systems and GPT development for business automation and productivity",
    "priceRange": "$$$",
    "serviceArea": [
      {"@type":"AdministrativeArea","name":"United States"},
      {"@type":"AdministrativeArea","name":"Canada"},
      {"@type":"AdministrativeArea","name":"United Kingdom"},
      {"@type":"AdministrativeArea","name":"Australia"}
    ],
    "areaServed": {
      "@type": "GeoShape",
      "name": "Global - English-speaking markets"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": "Remote-first, serving worldwide"
    },
    "knowsAbout": ["Artificial Intelligence", "Custom GPT Development", "Business Automation", "Workflow Optimization", "AI Assistant Development", "Machine Learning Applications", "Voice-trained AI", "ChatGPT Customization"],
    "sameAs": [
      "https://www.instagram.com/galavanteer_ai",
      "https://www.linkedin.com/in/jasondbaron",
      "https://jasondbaron.com"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Services & Custom GPT Development",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom GPT Build",
            "description": "Personalized AI assistants built in your voice and style - includes 30-day tuning period",
            "serviceType": "AI Development",
            "provider": {"@type": "Organization", "name": "Galavanteer Custom AI Solutions"}
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "AI Advisory Team",
            "description": "Virtual board of advisors for strategic business decisions",
            "serviceType": "AI Consulting",
            "provider": {"@type": "Organization", "name": "Galavanteer Custom AI Solutions"}
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "1:1 Clarity Sessions",
            "description": "Personalized AI strategy and consultation",
            "serviceType": "Consulting",
            "provider": {"@type": "Organization", "name": "Galavanteer Custom AI Solutions"}
          }
        }
      ]
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "jason@galavanteer.com",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "20",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://galavanteer.com/#website",
    "name": "Galavanteer - AI Systems & Custom GPTs",
    "alternateName": "Galavanteer AI Development",
    "url": "https://galavanteer.com",
    "description": "Professional AI systems and custom GPT development for businesses and creators",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://galavanteer.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const combinedSchema = schemaData
    ? [organizationSchema, websiteSchema, schemaData]
    : [organizationSchema, websiteSchema];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Jason Baron" />
      <meta name="theme-color" content="#6366f1" />

      {/* Prevent duplicate <meta name="robots"> collisions */}
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Galavanteer AI" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* SEO Enhancement */}
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="English" />
      
      {/* Disambiguation meta tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="business-type" content="AI Development, Custom GPT Services, Business Automation" />
      <meta name="industry" content="Artificial Intelligence, Software Development, Business Consulting" />
      <meta name="geo.region" content="US" />
      <meta name="geo.country" content="United States" />
      
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      {/* Hreflang for English regions */}
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />
      <link rel="alternate" hrefLang="en-us" href={currentUrl} />
      <link rel="alternate" hrefLang="en-gb" href={currentUrl} />
      <link rel="alternate" hrefLang="en-ca" href={currentUrl} />
      <link rel="alternate" hrefLang="en-au" href={currentUrl} />
      
      {/* Article-specific tags */}
      {pageType === 'article' && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {pageType === 'article' && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {pageType === 'article' && articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}
      {pageType === 'article' && articleTags && articleTags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Product-specific tags */}
      {pageType === 'product' && productPrice && (
        <>
          <meta property="product:price:amount" content={productPrice} />
          <meta property="product:price:currency" content={productCurrency} />
        </>
      )}
      
      {/* ✅ OG + Twitter */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={pageType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:alt" content="Galavanteer AI Systems - Custom GPT Development" />
      <meta property="og:updated_time" content={new Date().toISOString()} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@galavanteer_ai" />
      <meta name="twitter:creator" content="@galavanteer_ai" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:url" content={currentUrl} />
      
      {/* Twitter Card Enhanced Labels */}
      {twitterLabel1 && twitterData1 && (
        <>
          <meta name="twitter:label1" content={twitterLabel1} />
          <meta name="twitter:data1" content={twitterData1} />
        </>
      )}
      {twitterLabel2 && twitterData2 && (
        <>
          <meta name="twitter:label2" content={twitterLabel2} />
          <meta name="twitter:data2" content={twitterData2} />
        </>
      )}
      
      {/* Additional Social Media */}
      <meta property="instagram:account_id" content="galavanteer_ai" />
      <meta property="fb:admins" content="galavanteer" />
      
      {/* LinkedIn specific */}
      <meta property="linkedin:owner" content="jasondbaron" />
      
      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />
      
      {/* Microsoft */}
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="msapplication-config" content="none" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(combinedSchema)}
      </script>
      
      {/* Preload critical resources */}
      <link rel="preload" href="/src/index.css" as="style" />
      <link rel="preload" href={ogImage} as="image" type={ogImageType} />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//calendly.com" />
      <link rel="preconnect" href="https://www.instagram.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//instagram.com" />
      <link rel="dns-prefetch" href="//linkedin.com" />
    </Helmet>
  );
};

export default SEOHead;
