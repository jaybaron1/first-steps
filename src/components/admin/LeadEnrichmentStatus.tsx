import React, { useState, useEffect } from 'react';
import { Sparkles, Building, Users, Briefcase, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { adminSupabase } from '@/lib/adminBackend';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface EnrichmentStats {
  totalLeads: number;
  enrichedLeads: number;
  enrichmentRate: number;
  byIndustry: { industry: string; count: number }[];
  bySize: { size: string; count: number }[];
}

const LeadEnrichmentStatus: React.FC = () => {
  const [stats, setStats] = useState<EnrichmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetchEnrichmentStats();
  }, []);

  const fetchEnrichmentStats = async () => {
    try {
      // Get all leads with session data
      const { data: leads, error } = await adminSupabase
        .from('leads')
        .select('id, session_id');

      if (error) throw error;

      // Get session enrichment data
      const sessionIds = (leads || []).map(l => l.session_id).filter(Boolean);
      
      let enrichedCount = 0;
      const industryMap = new Map<string, number>();
      const sizeMap = new Map<string, number>();

      if (sessionIds.length > 0) {
        const { data: sessions } = await adminSupabase
          .from('visitor_sessions')
          .select('session_id, company_name, company_industry, company_size')
          .in('session_id', sessionIds);

        (sessions || []).forEach(session => {
          if (session.company_name || session.company_industry || session.company_size) {
            enrichedCount++;
          }
          if (session.company_industry) {
            industryMap.set(session.company_industry, (industryMap.get(session.company_industry) || 0) + 1);
          }
          if (session.company_size) {
            sizeMap.set(session.company_size, (sizeMap.get(session.company_size) || 0) + 1);
          }
        });
      }

      const totalLeads = leads?.length || 0;

      setStats({
        totalLeads,
        enrichedLeads: enrichedCount,
        enrichmentRate: totalLeads > 0 ? Math.round((enrichedCount / totalLeads) * 100) : 0,
        byIndustry: Array.from(industryMap.entries())
          .map(([industry, count]) => ({ industry, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        bySize: Array.from(sizeMap.entries())
          .map(([size, count]) => ({ size, count }))
          .sort((a, b) => b.count - a.count),
      });

      // Check if API is configured (we can't directly check secrets, so we infer from enriched data)
      setApiConfigured(enrichedCount > 0);
    } catch (err) {
      console.error('Error fetching enrichment stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-[#F3EDE4] rounded-lg" />
        <div className="h-32 bg-[#F3EDE4] rounded-lg" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-red-500 text-sm">Failed to load enrichment data</div>;
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`rounded-xl p-4 border ${
        apiConfigured 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-start gap-3">
          {apiConfigured ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${apiConfigured ? 'text-emerald-700' : 'text-amber-700'}`}>
              {apiConfigured ? 'Enrichment Active' : 'Enrichment Inactive'}
            </p>
            <p className={`text-sm ${apiConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
              {apiConfigured 
                ? 'Lead data is being enriched with company information'
                : 'Configure CLEARBIT_API_KEY secret to enable lead enrichment'}
            </p>
          </div>
        </div>
      </div>

      {/* Enrichment Rate */}
      <div className="bg-[#F9F6F0] rounded-xl p-4 border border-[#B8956C]/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B8956C]" />
            <span className="text-sm font-medium text-[#1A1915]">Enrichment Rate</span>
          </div>
          <span className="text-lg font-semibold text-[#B8956C]">{stats.enrichmentRate}%</span>
        </div>
        <Progress value={stats.enrichmentRate} className="h-2" />
        <p className="text-xs text-[#8C857A] mt-2">
          {stats.enrichedLeads} of {stats.totalLeads} leads enriched with company data
        </p>
      </div>

      {/* Breakdown by Industry */}
      {stats.byIndustry.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-[#B8956C]" />
            <span className="text-sm font-medium text-[#1A1915]">Top Industries</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.byIndustry.map(({ industry, count }) => (
              <Badge key={industry} variant="outline" className="text-[#4A4640]">
                {industry}
                <span className="ml-1 text-[#8C857A]">({count})</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown by Company Size */}
      {stats.bySize.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#B8956C]" />
            <span className="text-sm font-medium text-[#1A1915]">Company Sizes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.bySize.map(({ size, count }) => (
              <Badge key={size} className="bg-[#B8956C]/10 text-[#B8956C] border-0">
                {size}
                <span className="ml-1 opacity-70">({count})</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* No enriched data message */}
      {stats.byIndustry.length === 0 && stats.bySize.length === 0 && (
        <div className="text-center py-4 text-[#8C857A] text-sm">
          <Building className="w-6 h-6 mx-auto mb-2 opacity-50" />
          No enriched company data yet
        </div>
      )}
    </div>
  );
};

export default LeadEnrichmentStatus;
