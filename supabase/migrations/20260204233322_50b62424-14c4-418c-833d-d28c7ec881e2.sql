-- Deal stage history for velocity tracking
CREATE TABLE public.deal_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  from_stage deal_stage,
  to_stage deal_stage NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_hours NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on deal_stage_history
ALTER TABLE public.deal_stage_history ENABLE ROW LEVEL SECURITY;

-- RLS policy for deal_stage_history
CREATE POLICY "Admins can manage stage history" ON public.deal_stage_history
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger function to auto-log stage changes
CREATE OR REPLACE FUNCTION public.log_deal_stage_change()
RETURNS TRIGGER AS $$
DECLARE
  prev_change RECORD;
  prev_time TIMESTAMPTZ;
BEGIN
  IF OLD.stage IS DISTINCT FROM NEW.stage THEN
    -- Get the most recent stage change time
    SELECT changed_at INTO prev_time
    FROM public.deal_stage_history
    WHERE deal_id = NEW.id
    ORDER BY changed_at DESC LIMIT 1;
    
    -- If no previous change, use the deal's created_at
    IF prev_time IS NULL THEN
      prev_time := OLD.created_at;
    END IF;
    
    INSERT INTO public.deal_stage_history (deal_id, from_stage, to_stage, duration_hours)
    VALUES (
      NEW.id,
      OLD.stage,
      NEW.stage,
      EXTRACT(EPOCH FROM (now() - prev_time)) / 3600
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on deals table
CREATE TRIGGER deal_stage_change_trigger
AFTER UPDATE ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.log_deal_stage_change();

-- Customer cohorts for retention analysis
CREATE TABLE public.customer_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_month DATE NOT NULL,
  customer_id TEXT NOT NULL UNIQUE,
  first_revenue_date DATE NOT NULL,
  total_lifetime_value NUMERIC DEFAULT 0,
  last_activity_date DATE,
  is_churned BOOLEAN DEFAULT false,
  churned_at DATE,
  churn_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on customer_cohorts
ALTER TABLE public.customer_cohorts ENABLE ROW LEVEL SECURITY;

-- RLS policy for customer_cohorts
CREATE POLICY "Admins can manage cohorts" ON public.customer_cohorts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add actual_spend column to campaigns
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS actual_spend NUMERIC DEFAULT 0;

-- Create index for faster queries
CREATE INDEX idx_deal_stage_history_deal_id ON public.deal_stage_history(deal_id);
CREATE INDEX idx_deal_stage_history_changed_at ON public.deal_stage_history(changed_at);
CREATE INDEX idx_customer_cohorts_cohort_month ON public.customer_cohorts(cohort_month);
CREATE INDEX idx_customer_cohorts_is_churned ON public.customer_cohorts(is_churned);