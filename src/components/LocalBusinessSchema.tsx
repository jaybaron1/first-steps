import React from 'react';
import StructuredData from './StructuredData';

const LocalBusinessSchema = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Galavanteer Custom AI Solutions",
    "alternateName": "Galavanteer",
    "description": "Custom AI systems and GPT development for business automation and productivity. Voice-trained AI assistants that amplify your unique capabilities.",
    "url": "https://galavanteer.com",
    "logo": "https://galavanteer.com/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png",
    "image": "https://galavanteer.com/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png",
    "telephone": "+1-XXX-XXX-XXXX",
    "email": "jason@galavanteer.com",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": "Remote-first, serving worldwide"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "39.8283",
      "longitude": "-98.5795"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "United States"
      },
      {
        "@type": "Country",
        "name": "Canada"
      },
      {
        "@type": "Country",
        "name": "United Kingdom"
      },
      {
        "@type": "Country",
        "name": "Australia"
      },
      {
        "@type": "GeoShape",
        "name": "Global - English-speaking markets"
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00",
        "timeZone": "America/New_York"
      }
    ],
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
    "sameAs": [
      "https://www.instagram.com/galavanteer_ai",
      "https://www.linkedin.com/in/jasondbaron"
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
            "description": "Personalized AI assistants built in your voice and style",
            "provider": {
              "@type": "Organization",
              "name": "Galavanteer Custom AI Solutions"
            }
          },
          "price": "999",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Advisory Team",
            "description": "Virtual board of advisors for strategic business decisions",
            "provider": {
              "@type": "Organization",
              "name": "Galavanteer Custom AI Solutions"
            }
          },
          "price": "3499",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "1:1 Clarity Sessions",
            "description": "Personalized AI strategy and consultation",
            "provider": {
              "@type": "Organization",
              "name": "Galavanteer Custom AI Solutions"
            }
          },
          "price": "100",
          "priceCurrency": "USD"
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "20",
      "bestRating": "5",
      "worstRating": "1"
    },
    "knowsAbout": [
      "Artificial Intelligence",
      "Custom GPT Development",
      "Business Automation",
      "Workflow Optimization",
      "AI Assistant Development",
      "Voice-trained AI",
      "ChatGPT Customization"
    ],
    "slogan": "AI won't replace you – it will amplify you"
  };

  return <StructuredData data={localBusinessSchema} />;
};

export default LocalBusinessSchema;
