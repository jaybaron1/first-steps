import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';

export type AttributionModel = 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';

export interface ChannelAttribution {
  channel: string;
  revenue: number;
  deals: number;
  touchpoints: number;
  percentage: number;
}

export interface CampaignROI {
  campaign: string;
  source: string;
  medium: string;
  spend: number;
  revenue: number;
  roi: number;
  conversions: number;
}

export interface TouchpointAnalysis {
  touchpoint_type: string;
  count: number;
  avg_position: number;
  conversion_rate: number;
}

export interface AttributionData {
  byChannel: ChannelAttribution[];
  byCampaign: CampaignROI[];
  byTouchpointType: TouchpointAnalysis[];
  totalRevenue: number;
  totalDeals: number;
}

export function useAttribution(model: AttributionModel = 'linear') {
  const [data, setData] = useState<AttributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttribution = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch closed won deals with touchpoints and revenue
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select(`
          id,
          value,
          attribution_touchpoints(
            id,
            channel,
            source,
            medium,
            campaign,
            touchpoint_type,
            touchpoint_time
          ),
          revenue_events(amount)
        `)
        .eq('stage', 'closed_won');

      if (dealsError) throw dealsError;

      // Fetch campaigns for spend data
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*');

      if (campaignsError) throw campaignsError;

      const campaignSpendMap = new Map<string, number>();
      (campaigns || []).forEach((c: any) => {
        if (c.utm_campaign) {
          campaignSpendMap.set(c.utm_campaign, c.budget || 0);
        }
      });

      // Calculate attribution by channel
      const channelMap = new Map<string, { revenue: number; deals: Set<string>; touchpoints: number }>();
      const campaignMap = new Map<string, { revenue: number; conversions: number; source: string; medium: string }>();
      const touchpointTypeMap = new Map<string, { count: number; positions: number[]; conversions: number }>();

      let totalRevenue = 0;
      const dealIds = new Set<string>();

      (deals || []).forEach((deal: any) => {
        const dealRevenue = deal.value || 0;
        totalRevenue += dealRevenue;
        dealIds.add(deal.id);

        const touchpoints = deal.attribution_touchpoints || [];
        const touchpointCount = touchpoints.length;

        if (touchpointCount === 0) return;

        // Sort touchpoints by time
        const sortedTouchpoints = [...touchpoints].sort(
          (a: any, b: any) => new Date(a.touchpoint_time).getTime() - new Date(b.touchpoint_time).getTime()
        );

        // Calculate credit per touchpoint based on model
        sortedTouchpoints.forEach((tp: any, index: number) => {
          let credit = 0;

          switch (model) {
            case 'first_touch':
              credit = index === 0 ? 1 : 0;
              break;
            case 'last_touch':
              credit = index === touchpointCount - 1 ? 1 : 0;
              break;
            case 'linear':
              credit = 1 / touchpointCount;
              break;
            case 'position_based':
              if (touchpointCount === 1) {
                credit = 1;
              } else if (index === 0) {
                credit = 0.4;
              } else if (index === touchpointCount - 1) {
                credit = 0.4;
              } else {
                credit = 0.2 / (touchpointCount - 2);
              }
              break;
            case 'time_decay':
              const decayFactor = Math.pow(0.7, touchpointCount - 1 - index);
              const totalWeight = Array.from({ length: touchpointCount }, (_, i) => 
                Math.pow(0.7, touchpointCount - 1 - i)
              ).reduce((a, b) => a + b, 0);
              credit = decayFactor / totalWeight;
              break;
          }

          const attributedRevenue = dealRevenue * credit;
          const channel = tp.channel || 'direct';
          const campaign = tp.campaign || 'none';
          const tpType = tp.touchpoint_type || 'unknown';

          // Update channel map
          if (!channelMap.has(channel)) {
            channelMap.set(channel, { revenue: 0, deals: new Set(), touchpoints: 0 });
          }
          const channelData = channelMap.get(channel)!;
          channelData.revenue += attributedRevenue;
          channelData.deals.add(deal.id);
          channelData.touchpoints++;

          // Update campaign map
          if (campaign !== 'none') {
            if (!campaignMap.has(campaign)) {
              campaignMap.set(campaign, { 
                revenue: 0, 
                conversions: 0, 
                source: tp.source || '', 
                medium: tp.medium || '' 
              });
            }
            const campaignData = campaignMap.get(campaign)!;
            campaignData.revenue += attributedRevenue;
            if (index === touchpointCount - 1) {
              campaignData.conversions++;
            }
          }

          // Update touchpoint type map
          if (!touchpointTypeMap.has(tpType)) {
            touchpointTypeMap.set(tpType, { count: 0, positions: [], conversions: 0 });
          }
          const tpData = touchpointTypeMap.get(tpType)!;
          tpData.count++;
          tpData.positions.push(index / Math.max(touchpointCount - 1, 1));
          if (index === touchpointCount - 1) {
            tpData.conversions++;
          }
        });
      });

      // Format results
      const byChannel: ChannelAttribution[] = Array.from(channelMap.entries())
        .map(([channel, data]) => ({
          channel,
          revenue: data.revenue,
          deals: data.deals.size,
          touchpoints: data.touchpoints,
          percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue);

      const byCampaign: CampaignROI[] = Array.from(campaignMap.entries())
        .map(([campaign, data]) => {
          const spend = campaignSpendMap.get(campaign) || 0;
          return {
            campaign,
            source: data.source,
            medium: data.medium,
            spend,
            revenue: data.revenue,
            roi: spend > 0 ? ((data.revenue - spend) / spend) * 100 : 0,
            conversions: data.conversions,
          };
        })
        .sort((a, b) => b.revenue - a.revenue);

      const byTouchpointType: TouchpointAnalysis[] = Array.from(touchpointTypeMap.entries())
        .map(([touchpoint_type, data]) => ({
          touchpoint_type,
          count: data.count,
          avg_position: data.positions.length > 0 
            ? data.positions.reduce((a, b) => a + b, 0) / data.positions.length 
            : 0,
          conversion_rate: data.count > 0 ? (data.conversions / data.count) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);

      setData({
        byChannel,
        byCampaign,
        byTouchpointType,
        totalRevenue,
        totalDeals: dealIds.size,
      });

      setError(null);
    } catch (err) {
      console.error('[useAttribution] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attribution data');
    } finally {
      setLoading(false);
    }
  }, [model]);

  useEffect(() => {
    fetchAttribution();
  }, [fetchAttribution]);

  return { data, loading, error, refetch: fetchAttribution };
}
