-- Create funnel_steps table for conversion funnel tracking
CREATE TABLE public.funnel_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url_pattern text NOT NULL,
  step_order integer NOT NULL,
  funnel_name text DEFAULT 'default',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.funnel_steps ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admins can manage funnel steps"
ON public.funnel_steps
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default funnel steps
INSERT INTO public.funnel_steps (name, url_pattern, step_order, funnel_name) VALUES
  ('Homepage', '/', 1, 'default'),
  ('About', '/about%', 2, 'default'),
  ('Examples', '/examples%', 3, 'default'),
  ('Pricing', '/pricing%', 4, 'default'),
  ('Contact/Book', '/contact%', 5, 'default');

-- Create A/B experiments table
CREATE TABLE public.ab_experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  element_selector text NOT NULL,
  variants jsonb NOT NULL DEFAULT '[]',
  traffic_percent integer DEFAULT 100,
  status text DEFAULT 'draft',
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ab_experiments ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admins can manage experiments"
ON public.ab_experiments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create A/B assignments table (which variant each visitor saw)
CREATE TABLE public.ab_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  variant_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ab_assignments ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (for tracking), admins can view
CREATE POLICY "Anyone can insert assignments"
ON public.ab_assignments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view assignments"
ON public.ab_assignments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create A/B conversions table
CREATE TABLE public.ab_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  variant_id text NOT NULL,
  conversion_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ab_conversions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (for tracking), admins can view
CREATE POLICY "Anyone can insert conversions"
ON public.ab_conversions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view conversions"
ON public.ab_conversions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add sheets_synced_at column to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS sheets_synced_at timestamptz;

-- Create indexes for performance
CREATE INDEX idx_funnel_steps_order ON public.funnel_steps(funnel_name, step_order);
CREATE INDEX idx_ab_assignments_experiment ON public.ab_assignments(experiment_id, session_id);
CREATE INDEX idx_ab_conversions_experiment ON public.ab_conversions(experiment_id, variant_id);
CREATE INDEX idx_leads_sheets_sync ON public.leads(sheets_synced_at) WHERE sheets_synced_at IS NULL;