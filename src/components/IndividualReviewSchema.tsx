import React from 'react';
import StructuredData from './StructuredData';

interface IndividualReviewSchemaProps {
  reviewerName: string;
  reviewerTitle?: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  itemReviewedName?: string;
  itemReviewedType?: string;
}

const IndividualReviewSchema = ({
  reviewerName,
  reviewerTitle,
  rating,
  reviewBody,
  datePublished,
  itemReviewedName = "Galavanteer Custom AI Assistant Services",
  itemReviewedType = "Service"
}: IndividualReviewSchemaProps) => {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": itemReviewedType,
      "name": itemReviewedName
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": rating.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Person",
      "name": reviewerName,
      ...(reviewerTitle && { "jobTitle": reviewerTitle })
    },
    "reviewBody": reviewBody,
    "datePublished": datePublished,
    "publisher": {
      "@type": "Organization",
      "name": "Galavanteer Custom AI Solutions"
    }
  };

  return <StructuredData data={reviewSchema} />;
};

export default IndividualReviewSchema;
