-- Create conversion_goals table for goal definitions
CREATE TABLE public.conversion_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('url_visit', 'event', 'time_on_site', 'scroll_depth', 'page_count', 'form_submit')),
  goal_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  value NUMERIC,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goal_completions table for tracking completions
CREATE TABLE public.goal_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.conversion_goals(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX idx_goal_completions_goal_id ON public.goal_completions(goal_id);
CREATE INDEX idx_goal_completions_session_id ON public.goal_completions(session_id);
CREATE INDEX idx_goal_completions_completed_at ON public.goal_completions(completed_at);
CREATE INDEX idx_conversion_goals_status ON public.conversion_goals(status);

-- Enable RLS on both tables
ALTER TABLE public.conversion_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_completions ENABLE ROW LEVEL SECURITY;

-- Policies for conversion_goals (admin only for management)
CREATE POLICY "Admins can manage goals" 
ON public.conversion_goals 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can read active goals (for frontend tracking)
CREATE POLICY "Anyone can read active goals" 
ON public.conversion_goals 
FOR SELECT 
USING (status = 'active');

-- Policies for goal_completions
CREATE POLICY "Admins can view completions" 
ON public.goal_completions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert completions" 
ON public.goal_completions 
FOR INSERT 
WITH CHECK (true);