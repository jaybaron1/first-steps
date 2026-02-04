import React from 'react';
import { Link2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BacklinksPlaceholder: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B8956C]/10 mb-4">
        <Link2 className="w-8 h-8 text-[#B8956C]" />
      </div>
      <h3 className="text-lg font-semibold text-[#1A1915] mb-2">Backlink Monitoring</h3>
      <p className="text-sm text-[#8C857A] mb-6 max-w-md mx-auto">
        Connect an SEO API like Ahrefs or Moz to monitor your backlink profile, track new and lost links, and analyze
        referring domains.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" className="gap-2" disabled>
          <ExternalLink className="w-4 h-4" />
          Connect Ahrefs
        </Button>
        <Button variant="outline" className="gap-2" disabled>
          <ExternalLink className="w-4 h-4" />
          Connect Moz
        </Button>
      </div>
      <p className="text-xs text-[#8C857A] mt-4">Integration coming soon</p>
    </div>
  );
};

export default BacklinksPlaceholder;
