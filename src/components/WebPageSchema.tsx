import React from "react";

const WebPageSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://galavanteer.com/#webpage",
    "url": "https://galavanteer.com/",
    "name": "Stop Explaining the Same Thing Over and Over",
    "description":
      "Homepage for Galavanteer — custom AI systems that think and write exactly like you.",
    "inLanguage": "en-US",
    "isPartOf": {
      "@id": "https://galavanteer.com/#website",
    },
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

export default WebPageSchema;
