-- Allow anonymous inserts to leads table (for chatbot lead capture)
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Also add policy for visitor_sessions to allow insert of new fields
DROP POLICY IF EXISTS "Anyone can insert visitor sessions" ON public.visitor_sessions;
CREATE POLICY "Anyone can insert visitor sessions"
ON public.visitor_sessions
FOR INSERT
WITH CHECK (true);