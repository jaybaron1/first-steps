import React, { useState, useRef } from 'react';
import StructuredData from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { RotateCcw, Loader2 } from 'lucide-react';

const InstagramEmbed: React.FC = () => {
  const [showReplay, setShowReplay] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const originalSrc = "https://www.instagram.com/reel/DMQ5zvEuKSx/embed";

  const handleReplay = () => {
    if (iframeRef.current) {
      setIsRefreshing(true);
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = originalSrc;
          setIsRefreshing(false);
          setShowReplay(false);
        }
      }, 100);
    }
  };

  const handleIframeLoad = () => {
    // Show replay button after iframe loads (indicating video interaction)
    setTimeout(() => setShowReplay(true), 3000);
  };

  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Galavanteer Explainer Reel',
    description: '45-second explainer: how a personal GPT works in your voice',
    uploadDate: '2025-01-01',
    contentUrl: 'https://www.instagram.com/reel/DMQ5zvEuKSx/?igsh=aXR5Ym5sNzF6dHZk',
    embedUrl: 'https://www.instagram.com/reel/DMQ5zvEuKSx/embed',
    publisher: {
      '@type': 'Organization',
      name: 'Galavanteer'
    }
  };

  return (
    <section id="demo" className="py-8 bg-white">
      <StructuredData data={videoSchema} />
      <div className="container">
        <div className="max-w-sm md:max-w-md lg:max-w-lg mx-auto">
          <div className="relative w-full overflow-hidden rounded-lg border border-gray-100 shadow-sm" style={{ paddingTop: '177.78%' }}>
          <iframe
            ref={iframeRef}
            src={originalSrc}
            title="Instagram explainer reel"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            allowFullScreen
            loading="lazy"
            onLoad={handleIframeLoad}
            style={{ border: '0', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
          {isRefreshing && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          </div>
          {showReplay && !isRefreshing && (
            <div className="flex justify-center mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReplay}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Replay Video
              </Button>
            </div>
          )}
          <p className="text-sm text-galavanteer-gray/70 text-center mt-2">Watch the 45s explainer: how a personal GPT works in your voice</p>
        </div>
      </div>
    </section>
  );
};

export default InstagramEmbed;
