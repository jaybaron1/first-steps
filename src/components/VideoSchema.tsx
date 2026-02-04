import React from 'react';
import StructuredData from './StructuredData';

interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  width?: string;
  height?: string;
}

const VideoSchema: React.FC<VideoSchemaProps> = ({ 
  name, 
  description, 
  thumbnailUrl = "https://galavanteer.com/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png",
  uploadDate = "2025-10-23",
  duration = "PT45S",
  contentUrl,
  embedUrl,
  width = "1280",
  height = "720"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": [thumbnailUrl],
    "uploadDate": uploadDate,
    "duration": duration,
    ...(contentUrl && { "contentUrl": contentUrl }),
    ...(embedUrl && { "embedUrl": embedUrl }),
    "width": width,
    "height": height,
    "author": {
      "@type": "Organization",
      "name": "Galavanteer Custom AI Solutions",
      "url": "https://galavanteer.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Galavanteer Custom AI Solutions",
      "logo": {
        "@type": "ImageObject",
        "url": "https://galavanteer.com/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png"
      }
    }
  };

  return <StructuredData data={schema} />;
};

export default VideoSchema;
