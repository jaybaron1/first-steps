import React from 'react';
import { Helmet } from 'react-helmet-async';

const ServiceSchema: React.FC = () => {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "The Roundtable",
    "alternateName": "Executive Decision Intelligence",
    "description": "Cognitive infrastructure for founders and executives. AI-powered strategic thinking with 60+ expert personas that debate, disagree, and deliver actionable decisions.",
    "provider": {
      "@type": "Organization",
      "name": "Galavanteer",
      "url": "https://galavanteer.com"
    },
    "serviceType": "Executive Intelligence Platform",
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Founders, Executives, Private Equity Partners, Non-profit Leaders, Coaches, Consultants"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "The Roundtable Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Level 1: Identity - Brand Intelligence",
            "description": "Custom GPT trained on your brand voice, values, and communication style"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Level 2: Operations - The Roundtable",
            "description": "AI advisory board with 60+ expert personas for strategic decision-making"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Level 3: Mindset - Cognitive Replication",
            "description": "AI that thinks and reasons like you, capturing your unique decision-making patterns"
          }
        }
      ]
    },
    "brand": {
      "@type": "Brand",
      "name": "Galavanteer",
      "slogan": "AI won't replace you – it will amplify you"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "20",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

export default ServiceSchema;
