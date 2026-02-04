import { useState, useEffect } from 'react';
import { adminSupabase } from '@/lib/adminBackend';

export interface FormSubmission {
  id: string;
  session_id: string;
  event_type: string;
  form_name: string | null;
  created_at: string;
  visitor_country: string | null;
  visitor_city: string | null;
  converted_to_lead: boolean;
}

export interface FormStats {
  totalStarts: number;
  totalSubmits: number;
  completionRate: number;
  submissions: FormSubmission[];
}

type TimeRange = 'today' | '7days' | '30days' | 'all';

export function useFormSubmissions(timeRange: TimeRange = '7days') {
  const [stats, setStats] = useState<FormStats>({
    totalStarts: 0,
    totalSubmits: 0,
    completionRate: 0,
    submissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build time filter
        const now = new Date();
        let startDate: string | null = null;
        
        if (timeRange === 'today') {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        } else if (timeRange === '7days') {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        } else if (timeRange === '30days') {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        }

        // Fetch form events
        let eventsQuery = adminSupabase
          .from('visitor_events')
          .select('id, session_id, event_type, event_data, created_at')
          .in('event_type', ['form_start', 'form_submit', 'lead_captured']);

        if (startDate) {
          eventsQuery = eventsQuery.gte('created_at', startDate);
        }

        const { data: events, error: eventsError } = await eventsQuery.order('created_at', { ascending: false });

        if (eventsError) throw eventsError;

        // Get leads to check conversions
        const { data: leads } = await adminSupabase
          .from('leads')
          .select('session_id');

        const leadSessionIds = new Set((leads || []).map(l => l.session_id));

        // Get visitor info for sessions
        const sessionIds = [...new Set((events || []).map(e => e.session_id).filter(Boolean))];
        
        let visitorMap = new Map<string, { country: string | null; city: string | null }>();
        
        if (sessionIds.length > 0) {
          const { data: visitors } = await adminSupabase
            .from('visitor_sessions')
            .select('session_id, country, city')
            .in('session_id', sessionIds);

          (visitors || []).forEach(v => {
            visitorMap.set(v.session_id, { country: v.country, city: v.city });
          });
        }

        // Calculate stats
        const formStarts = (events || []).filter(e => e.event_type === 'form_start').length;
        const formSubmits = (events || []).filter(e => 
          e.event_type === 'form_submit' || e.event_type === 'lead_captured'
        ).length;

        const submissions: FormSubmission[] = (events || [])
          .filter(e => e.event_type === 'form_submit' || e.event_type === 'lead_captured')
          .map(e => {
            const visitor = visitorMap.get(e.session_id || '') || { country: null, city: null };
            const eventData = e.event_data as Record<string, any> | null;
            
            return {
              id: e.id,
              session_id: e.session_id || '',
              event_type: e.event_type,
              form_name: eventData?.form_name || eventData?.source || 'Unknown Form',
              created_at: e.created_at || '',
              visitor_country: visitor.country,
              visitor_city: visitor.city,
              converted_to_lead: leadSessionIds.has(e.session_id || ''),
            };
          });

        setStats({
          totalStarts: formStarts,
          totalSubmits: formSubmits,
          completionRate: formStarts > 0 ? Math.round((formSubmits / formStarts) * 100) : 0,
          submissions,
        });
      } catch (err) {
        console.error('Error fetching form submissions:', err);
        setError('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  return { stats, loading, error };
}
