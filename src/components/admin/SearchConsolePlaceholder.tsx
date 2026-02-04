import React from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchConsolePlaceholder: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B8956C]/10 mb-4">
        <Search className="w-8 h-8 text-[#B8956C]" />
      </div>
      <h3 className="text-lg font-semibold text-[#1A1915] mb-2">Google Search Console</h3>
      <p className="text-sm text-[#8C857A] mb-6 max-w-md mx-auto">
        Connect Google Search Console to view keyword rankings, search queries, click-through rates, and indexing
        status.
      </p>
      <Button variant="outline" className="gap-2" disabled>
        <ExternalLink className="w-4 h-4" />
        Connect Google Search Console
      </Button>
      <p className="text-xs text-[#8C857A] mt-4">Integration coming soon</p>
    </div>
  );
};

export default SearchConsolePlaceholder;
