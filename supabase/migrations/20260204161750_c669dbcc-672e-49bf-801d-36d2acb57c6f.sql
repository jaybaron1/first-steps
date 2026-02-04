-- Enable RLS on tracking tables
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Visitor Sessions: Anyone can insert, admins can read
CREATE POLICY "Anyone can insert visitor sessions"
ON public.visitor_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view visitor sessions"
ON public.visitor_sessions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update visitor sessions"
ON public.visitor_sessions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Page Views: Anyone can insert, admins can read
CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view page views"
ON public.page_views
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update page views"
ON public.page_views
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Visitor Events: Anyone can insert, admins can read
CREATE POLICY "Anyone can insert visitor events"
ON public.visitor_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view visitor events"
ON public.visitor_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Leads: Admins only
CREATE POLICY "Admins can manage leads"
ON public.leads
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Campaigns: Admins only
CREATE POLICY "Admins can manage campaigns"
ON public.campaigns
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON public.visitor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_created_at ON public.visitor_sessions(first_seen DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_events_session_id ON public.visitor_events(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_events_created_at ON public.visitor_events(created_at DESC);