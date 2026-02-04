import React from 'react';
import { Flame, ExternalLink, Mail, Phone, Building2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLeads } from '@/hooks/useLeads';
import LeadTemperatureBadge from './LeadTemperatureBadge';
import { formatDistanceToNow } from 'date-fns';

const HotLeadsPanel: React.FC = () => {
  const { leads, loading } = useLeads({
    page: 1,
    pageSize: 10,
    sortBy: 'lead_score',
    sortOrder: 'desc',
  });

  // Filter to hot leads (score >= 60)
  const hotLeads = leads.filter((lead) => (lead.lead_score || 0) >= 60);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-[#F9F6F0] rounded-lg">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (hotLeads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
          <Flame className="w-6 h-6 text-amber-500" />
        </div>
        <p className="text-sm font-medium text-[#1A1915] mb-1">No hot leads yet</p>
        <p className="text-xs text-[#8C857A]">
          Leads with score ≥60 will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {hotLeads.map((lead) => (
        <div
          key={lead.id}
          className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Header with name and score */}
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-semibold text-[#1A1915] truncate">
                  {lead.name || lead.email || 'Anonymous Lead'}
                </h4>
                <LeadTemperatureBadge score={lead.lead_score || 0} size="sm" />
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C857A] mb-2">
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-1 hover:text-[#B8956C] transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{lead.email}</span>
                  </a>
                )}
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-1 hover:text-[#B8956C] transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{lead.phone}</span>
                  </a>
                )}
                {lead.company && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{lead.company}</span>
                  </span>
                )}
              </div>

              {/* Time and Source */}
              <div className="flex items-center gap-3 text-xs text-[#8C857A]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lead.created_at
                    ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })
                    : 'Unknown'}
                </span>
                {lead.source && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {lead.source}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 h-8 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View
            </Button>
          </div>

          {/* Message Preview */}
          {lead.message && (
            <div className="mt-3 pt-3 border-t border-amber-200/50">
              <p className="text-xs text-[#8C857A] line-clamp-2">
                "{lead.message}"
              </p>
            </div>
          )}
        </div>
      ))}

      {/* View All Link */}
      <div className="pt-2 text-center">
        <a
          href="/admin/leads"
          className="text-xs text-[#B8956C] hover:underline font-medium"
        >
          View all leads →
        </a>
      </div>
    </div>
  );
};

export default HotLeadsPanel;
