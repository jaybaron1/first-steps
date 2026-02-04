import React from 'react';
import { Helmet } from 'react-helmet-async';

const ReviewSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Galavanteer Custom AI Solutions",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "20",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Celeste Moore"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Honestly, I did not know what a personalized chatbot was until Jason created one for me. I am truly blown away not only by Jason but also by the capacity of this chatbot. Everyone needs his chatbot in any type of business!",
        "itemReviewed": {
          "@type": "Service",
          "name": "Custom GPT Build"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "David Wood"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Jason created a custom AI tool that changed everything: it helped me master PowerBI, understand Microsoft Dynamics, and build error-free data maps. This wasn't a corporate solution—it was Jason stepping up to equip me with clarity, precision, and self-sufficiency.",
        "itemReviewed": {
          "@type": "Service",
          "name": "Custom AI Assistant"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Miriam Daniela"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Jason didn't just build a chatbot — he created a logic framework that mirrors how I think, lead, and coach. It's already saving hours each week and scaling the human side of leadership — something tech rarely gets right.",
        "itemReviewed": {
          "@type": "Service",
          "name": "Custom GPT System"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Brandon Gaydorus"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Working with Jason Baron has been a complete game-changer. He helped me truly understand how to use and optimize ChatGPT—not just as a tool, but as a powerful business asset. His guidance saved me hours of trial and error.",
        "itemReviewed": {
          "@type": "Service",
          "name": "AI Consulting"
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default ReviewSchema;
