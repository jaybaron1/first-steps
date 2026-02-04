import React, { useState } from 'react';
import { Link2, TrendingUp } from 'lucide-react';
import { useUTMStats } from '@/hooks/useUTMStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const UTMTrackingDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('7days');
  const { stats, loading, error, totalTagged } = useUTMStats(timeRange);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-[#F3EDE4] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  const hasData = stats.sources.length > 0 || stats.mediums.length > 0 || 
                  stats.campaigns.length > 0 || stats.terms.length > 0 || 
                  stats.contents.length > 0;

  if (!hasData) {
    return (
      <div className="text-center py-8">
        <Link2 className="w-8 h-8 text-[#8C857A] mx-auto mb-3" />
        <p className="text-[#8C857A] text-sm">No UTM-tagged traffic yet</p>
        <p className="text-xs text-[#8C857A]/70 mt-1">
          Add ?utm_source=... to your URLs to track campaigns
        </p>
      </div>
    );
  }

  const UTMTable = ({ data, label }: { data: typeof stats.sources; label: string }) => (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F9F6F0]">
          <TableHead className="text-[#4A4640]">{label}</TableHead>
          <TableHead className="text-right text-[#4A4640]">Visitors</TableHead>
          <TableHead className="text-right text-[#4A4640]">Conv.</TableHead>
          <TableHead className="text-right text-[#4A4640]">Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-[#8C857A] py-4">
              No data
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, idx) => (
            <TableRow key={item.value} className="hover:bg-[#F9F6F0]">
              <TableCell className="font-medium text-[#1A1915]">
                <div className="flex items-center gap-2">
                  {idx === 0 && <Badge className="bg-[#B8956C] text-white text-[10px]">Top</Badge>}
                  <span className="truncate max-w-[150px]">{item.value}</span>
                </div>
              </TableCell>
              <TableCell className="text-right text-[#4A4640]">
                {item.count}
                <span className="text-[#8C857A] text-xs ml-1">({item.percentage}%)</span>
              </TableCell>
              <TableCell className="text-right text-[#4A4640]">{item.conversions}</TableCell>
              <TableCell className="text-right">
                {item.conversionRate > 0 ? (
                  <Badge variant="outline" className="border-emerald-300 text-emerald-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {item.conversionRate}%
                  </Badge>
                ) : (
                  <span className="text-[#8C857A]">-</span>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-4">
      {/* Time Range & Summary */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['today', '7days', '30days'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                timeRange === range
                  ? 'bg-[#B8956C] text-white'
                  : 'bg-[#F3EDE4] text-[#8C857A] hover:bg-[#E8E0D5]'
              }`}
            >
              {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#8C857A]">{totalTagged} tagged visits</span>
      </div>

      {/* Tabs for different UTM parameters */}
      <Tabs defaultValue="source" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-[#F3EDE4]">
          <TabsTrigger value="source" className="text-xs data-[state=active]:bg-white">Source</TabsTrigger>
          <TabsTrigger value="medium" className="text-xs data-[state=active]:bg-white">Medium</TabsTrigger>
          <TabsTrigger value="campaign" className="text-xs data-[state=active]:bg-white">Campaign</TabsTrigger>
          <TabsTrigger value="term" className="text-xs data-[state=active]:bg-white">Term</TabsTrigger>
          <TabsTrigger value="content" className="text-xs data-[state=active]:bg-white">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="source" className="mt-4">
          <UTMTable data={stats.sources} label="Source" />
        </TabsContent>

        <TabsContent value="medium" className="mt-4">
          <UTMTable data={stats.mediums} label="Medium" />
        </TabsContent>

        <TabsContent value="campaign" className="mt-4">
          <UTMTable data={stats.campaigns} label="Campaign" />
        </TabsContent>

        <TabsContent value="term" className="mt-4">
          <UTMTable data={stats.terms} label="Term" />
        </TabsContent>

        <TabsContent value="content" className="mt-4">
          <UTMTable data={stats.contents} label="Content" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UTMTrackingDashboard;
