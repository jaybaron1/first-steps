import React, { useState } from 'react';
import { FileText, CheckCircle2, XCircle, TrendingUp, Clock, MapPin } from 'lucide-react';
import { useFormSubmissions } from '@/hooks/useFormSubmissions';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const FormSubmissionsPanel: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('7days');
  const { stats, loading, error } = useFormSubmissions(timeRange);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#F3EDE4] rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-[#F3EDE4] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#F9F6F0] rounded-xl p-4 border border-[#B8956C]/10">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-[#B8956C]" />
            <span className="text-xs text-[#8C857A]">Form Starts</span>
          </div>
          <p className="text-2xl font-semibold text-[#1A1915]">{stats.totalStarts}</p>
        </div>

        <div className="bg-[#F9F6F0] rounded-xl p-4 border border-[#B8956C]/10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-[#8C857A]">Submissions</span>
          </div>
          <p className="text-2xl font-semibold text-[#1A1915]">{stats.totalSubmits}</p>
        </div>

        <div className="bg-[#F9F6F0] rounded-xl p-4 border border-[#B8956C]/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#B8956C]" />
            <span className="text-xs text-[#8C857A]">Completion Rate</span>
          </div>
          <p className="text-2xl font-semibold text-[#1A1915]">{stats.completionRate}%</p>
        </div>
      </div>

      {/* Recent Submissions */}
      <div>
        <h4 className="text-sm font-medium text-[#1A1915] mb-3">Recent Submissions</h4>
        
        {stats.submissions.length === 0 ? (
          <div className="text-center py-8 text-[#8C857A] text-sm">
            No form submissions in this period
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9F6F0]">
                <TableHead className="text-[#4A4640]">Form</TableHead>
                <TableHead className="text-[#4A4640]">Location</TableHead>
                <TableHead className="text-[#4A4640]">Status</TableHead>
                <TableHead className="text-right text-[#4A4640]">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.submissions.slice(0, 10).map((submission) => (
                <TableRow key={submission.id} className="hover:bg-[#F9F6F0]">
                  <TableCell className="font-medium text-[#1A1915]">
                    {submission.form_name || 'Unknown Form'}
                  </TableCell>
                  <TableCell>
                    {submission.visitor_city || submission.visitor_country ? (
                      <span className="flex items-center gap-1 text-[#8C857A] text-sm">
                        <MapPin className="w-3 h-3" />
                        {[submission.visitor_city, submission.visitor_country].filter(Boolean).join(', ')}
                      </span>
                    ) : (
                      <span className="text-[#8C857A] text-sm">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {submission.converted_to_lead ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Lead
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[#8C857A]">
                        <XCircle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-[#8C857A]">
                    <span className="flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {submission.created_at
                        ? formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })
                        : 'Unknown'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default FormSubmissionsPanel;
