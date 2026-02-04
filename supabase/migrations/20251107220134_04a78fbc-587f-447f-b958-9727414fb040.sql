-- Create table for storing Lighthouse audit results
CREATE TABLE IF NOT EXISTS public.lighthouse_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  url TEXT NOT NULL,
  performance_score DECIMAL(5,2),
  seo_score DECIMAL(5,2),
  accessibility_score DECIMAL(5,2),
  best_practices_score DECIMAL(5,2),
  pwa_score DECIMAL(5,2),
  largest_contentful_paint DECIMAL(10,2),
  first_input_delay DECIMAL(10,2),
  cumulative_layout_shift DECIMAL(10,4),
  first_contentful_paint DECIMAL(10,2),
  time_to_interactive DECIMAL(10,2),
  total_blocking_time DECIMAL(10,2),
  speed_index DECIMAL(10,2),
  audit_data JSONB,
  status TEXT DEFAULT 'completed',
  error_message TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_lighthouse_audits_created_at ON public.lighthouse_audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lighthouse_audits_url ON public.lighthouse_audits(url);

-- Enable RLS
ALTER TABLE public.lighthouse_audits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access to audits" ON public.lighthouse_audits;
  DROP POLICY IF EXISTS "Allow service role to insert audits" ON public.lighthouse_audits;
END $$;

-- Create policy to allow public read access (for viewing audit history)
CREATE POLICY "Allow public read access to audits"
  ON public.lighthouse_audits
  FOR SELECT
  USING (true);

-- Create policy to allow service role to insert (edge functions will use service role)
CREATE POLICY "Allow service role to insert audits"
  ON public.lighthouse_audits
  FOR INSERT
  WITH CHECK (true);