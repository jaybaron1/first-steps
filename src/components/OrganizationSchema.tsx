import React from 'react';
import { Helmet } from 'react-helmet-async';

const OrganizationSchema: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Galavanteer",
    "alternateName": "Galavanteer Custom AI Solutions",
    "url": "https://galavanteer.com",
    "logo": "https://galavanteer.com/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png",
    "description": "Galavanteer creates custom GPT systems and AI tools for business automation, personal productivity, and creative workflows. We design AI that thinks with you, not for you.",
    "foundingDate": "2023",
    "founder": {
      "@type": "Person",
      "name": "Jason Baron",
      "jobTitle": "Founder & AI Systems Developer",
      "url": "https://galavanteer.com/about",
      "sameAs": [
        "https://www.linkedin.com/in/jasondbaron"
      ]
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "jason@galavanteer.com",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://www.instagram.com/galavanteer_ai",
      "https://www.linkedin.com/in/jasondbaron"
    ],
    "areaServed": "Worldwide",
    "serviceType": [
      "Custom GPT Development",
      "AI Systems Development",
      "Business Automation",
      "AI Consulting"
    ],
    "slogan": "AI won't replace you – it will amplify you",
    "knowsAbout": [
      "Custom GPT Development",
      "AI Systems",
      "Business Automation",
      "Voice-Trained AI",
      "Personal AI Assistants"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;
