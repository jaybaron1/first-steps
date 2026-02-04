import React from 'react';
import StructuredData from './StructuredData';

const FAQSchema = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is The Roundtable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Roundtable is cognitive infrastructure for founders and executives. It's an AI-powered strategic advisory system featuring 60+ expert personas that debate, disagree, and deliver actionable decisions. Unlike generic chatbots, The Roundtable provides structured decision-making outcomes tailored to your specific business challenges."
        }
      },
      {
        "@type": "Question",
        "name": "How is The Roundtable different from ChatGPT?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ChatGPT generates text. The Roundtable generates judgment. While ChatGPT provides generic responses, The Roundtable delivers structured decision-making with multiple expert perspectives debating your real business challenges. It's the difference between asking a question and convening a board of advisors who understand your context."
        }
      },
      {
        "@type": "Question",
        "name": "Who is The Roundtable for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Roundtable serves founders, executives, private equity partners, non-profit leaders, coaches, and consultants who need to make high-stakes decisions. It's designed for leaders who want their judgment scaled—not replaced—by AI that thinks the way they do."
        }
      },
      {
        "@type": "Question",
        "name": "What are the three service levels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Level 1 (Identity) focuses on Brand Intelligence—understanding and articulating who you are. Level 2 (Operations) is The Roundtable itself—60+ expert personas providing strategic advisory. Level 3 (Mindset) is Cognitive Replication—AI that reasons and decides exactly like you, allowing your team to access your judgment when you're unavailable."
        }
      },
      {
        "@type": "Question",
        "name": "How do I get started with The Roundtable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Start with a Clarity Call—a focused conversation to understand your decision-making challenges and determine which service level fits your needs. Book directly through our website to schedule your session with founder Jason Baron."
        }
      }
    ]
  };

  return <StructuredData data={faqSchema} />;
};

export default FAQSchema;