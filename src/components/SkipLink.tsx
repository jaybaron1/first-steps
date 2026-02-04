import React from 'react';

const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[10001] bg-white border border-gray-200 rounded px-3 py-2 shadow"
  >
    Skip to content
  </a>
);

export default SkipLink;
