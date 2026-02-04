import React from 'react';
import { Helmet } from 'react-helmet-async';

const PersonSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Jason Baron",
    "jobTitle": "Founder & AI Systems Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Galavanteer Custom AI Solutions"
    },
    "url": "https://galavanteer.com",
    "sameAs": [
      "https://www.linkedin.com/in/jasondbaron",
      "https://www.instagram.com/galavanteer_ai"
    ],
    "email": "jason@galavanteer.com",
    "knowsAbout": [
      "Custom GPT Development",
      "AI Systems",
      "Business Automation",
      "Artificial Intelligence Consulting",
      "Voice-trained AI Assistants"
    ],
    "description": "Founder of Galavanteer, specializing in custom AI assistants and GPT systems that amplify human capabilities. Expert in voice-trained AI development and business automation."
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default PersonSchema;
