import React from 'react';
import StructuredData from './StructuredData';

interface AggregateRatingSchemaProps {
  itemName: string;
  itemType?: 'Service' | 'Product' | 'Organization' | 'LocalBusiness';
  ratingValue: string;
  reviewCount: string;
  bestRating?: string;
  worstRating?: string;
  description?: string;
  url?: string;
}

const AggregateRatingSchema = ({
  itemName,
  itemType = 'Service',
  ratingValue,
  reviewCount,
  bestRating = "5",
  worstRating = "1",
  description,
  url
}: AggregateRatingSchemaProps) => {
  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": itemType,
    "name": itemName,
    ...(description && { "description": description }),
    ...(url && { "url": url }),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount,
      "bestRating": bestRating,
      "worstRating": worstRating
    }
  };

  return <StructuredData data={ratingSchema} />;
};

export default AggregateRatingSchema;
