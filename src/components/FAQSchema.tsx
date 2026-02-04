import React from 'react';
import StructuredData from './StructuredData';

const FAQSchema = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a custom GPT and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A custom GPT is a personalized AI assistant trained on your specific voice, style, and knowledge base. It works by learning your communication patterns, preferences, and expertise to provide responses that sound authentically like you."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to build a custom GPT?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The development process typically takes 2-4 weeks depending on complexity. We start with a strategy session, then build and refine your GPT through iterative testing and feedback."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between Personal and Professional GPT builds?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Personal GPTs ($500) are designed for individual use with basic customization. Professional GPTs ($1500) include advanced features like team collaboration, business integrations, and ongoing optimization."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need technical knowledge to use a custom GPT?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No technical knowledge required. We design custom GPTs to be user-friendly and provide complete training on how to use and maintain your AI system."
        }
      },
      {
        "@type": "Question",
        "name": "What kind of support do you provide after the GPT is built?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer Basic Support ($50/month) for updates and maintenance, or Pro Support ($150/month) for optimization, new features, and priority assistance."
        }
      }
    ]
  };

  return <StructuredData data={faqSchema} />;
};

export default FAQSchema;