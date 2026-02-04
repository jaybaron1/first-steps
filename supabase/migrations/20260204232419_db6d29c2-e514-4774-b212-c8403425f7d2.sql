-- Revenue Attribution System Tables

-- Deal stages enum
CREATE TYPE public.deal_stage AS ENUM ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost');

-- Attribution model enum
CREATE TYPE public.attribution_model AS ENUM ('first_touch', 'last_touch', 'linear', 'time_decay', 'position_based');

-- Deals/Opportunities table
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  company TEXT,
  value NUMERIC(12,2) NOT NULL DEFAULT 0,
  stage deal_stage NOT NULL DEFAULT 'lead',
  probability INTEGER DEFAULT 10 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  owner_email TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Revenue events (conversions, payments, etc.)
CREATE TABLE public.revenue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'conversion', 'payment', 'upsell', 'renewal', 'refund'
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Attribution touchpoints (tracks all marketing touches for a deal)
CREATE TABLE public.attribution_touchpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT,
  touchpoint_type TEXT NOT NULL, -- 'page_view', 'cta_click', 'form_submit', 'email_open', 'ad_click'
  channel TEXT, -- 'organic', 'paid', 'social', 'email', 'referral', 'direct'
  source TEXT, -- 'google', 'facebook', 'linkedin', 'email_campaign', etc.
  medium TEXT, -- 'cpc', 'organic', 'social', 'email'
  campaign TEXT,
  content TEXT,
  page_url TEXT,
  touchpoint_time TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_converting_touch BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Attribution credits (calculated attribution per touchpoint)
CREATE TABLE public.attribution_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  touchpoint_id UUID REFERENCES public.attribution_touchpoints(id) ON DELETE CASCADE NOT NULL,
  model attribution_model NOT NULL,
  credit_percent NUMERIC(5,2) NOT NULL CHECK (credit_percent >= 0 AND credit_percent <= 100),
  attributed_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribution_touchpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribution_credits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deals
CREATE POLICY "Admins can manage deals" ON public.deals
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for revenue_events
CREATE POLICY "Admins can manage revenue events" ON public.revenue_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for attribution_touchpoints
CREATE POLICY "Admins can view touchpoints" ON public.attribution_touchpoints
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert touchpoints" ON public.attribution_touchpoints
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for attribution_credits
CREATE POLICY "Admins can manage credits" ON public.attribution_credits
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_deals_stage ON public.deals(stage);
CREATE INDEX idx_deals_created_at ON public.deals(created_at DESC);
CREATE INDEX idx_deals_lead_id ON public.deals(lead_id);
CREATE INDEX idx_revenue_events_deal_id ON public.revenue_events(deal_id);
CREATE INDEX idx_revenue_events_event_date ON public.revenue_events(event_date DESC);
CREATE INDEX idx_attribution_touchpoints_deal_id ON public.attribution_touchpoints(deal_id);
CREATE INDEX idx_attribution_touchpoints_channel ON public.attribution_touchpoints(channel);
CREATE INDEX idx_attribution_credits_model ON public.attribution_credits(model);

-- Function to update deal updated_at
CREATE OR REPLACE FUNCTION public.update_deal_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for deal updates
CREATE TRIGGER update_deals_timestamp
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_deal_timestamp();

-- Function to calculate attribution credits
CREATE OR REPLACE FUNCTION public.calculate_attribution(
  p_deal_id UUID,
  p_model attribution_model
)
RETURNS TABLE(touchpoint_id UUID, credit_percent NUMERIC, attributed_revenue NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deal_value NUMERIC;
  touch_count INTEGER;
  first_touch_id UUID;
  last_touch_id UUID;
  i INTEGER := 0;
BEGIN
  -- Get deal value
  SELECT value INTO deal_value FROM deals WHERE id = p_deal_id;
  
  -- Get touchpoint count
  SELECT COUNT(*) INTO touch_count 
  FROM attribution_touchpoints WHERE deal_id = p_deal_id;
  
  IF touch_count = 0 THEN
    RETURN;
  END IF;
  
  -- Get first and last touch IDs
  SELECT id INTO first_touch_id 
  FROM attribution_touchpoints 
  WHERE deal_id = p_deal_id 
  ORDER BY touchpoint_time ASC LIMIT 1;
  
  SELECT id INTO last_touch_id 
  FROM attribution_touchpoints 
  WHERE deal_id = p_deal_id 
  ORDER BY touchpoint_time DESC LIMIT 1;
  
  -- Calculate based on model
  IF p_model = 'first_touch' THEN
    RETURN QUERY
    SELECT 
      at.id,
      CASE WHEN at.id = first_touch_id THEN 100.00 ELSE 0.00 END::NUMERIC,
      CASE WHEN at.id = first_touch_id THEN deal_value ELSE 0.00 END::NUMERIC
    FROM attribution_touchpoints at WHERE at.deal_id = p_deal_id;
    
  ELSIF p_model = 'last_touch' THEN
    RETURN QUERY
    SELECT 
      at.id,
      CASE WHEN at.id = last_touch_id THEN 100.00 ELSE 0.00 END::NUMERIC,
      CASE WHEN at.id = last_touch_id THEN deal_value ELSE 0.00 END::NUMERIC
    FROM attribution_touchpoints at WHERE at.deal_id = p_deal_id;
    
  ELSIF p_model = 'linear' THEN
    RETURN QUERY
    SELECT 
      at.id,
      (100.00 / touch_count)::NUMERIC,
      (deal_value / touch_count)::NUMERIC
    FROM attribution_touchpoints at WHERE at.deal_id = p_deal_id;
    
  ELSIF p_model = 'position_based' THEN
    -- 40% first, 40% last, 20% distributed among middle
    RETURN QUERY
    SELECT 
      at.id,
      CASE 
        WHEN at.id = first_touch_id AND at.id = last_touch_id THEN 100.00
        WHEN at.id = first_touch_id THEN 40.00
        WHEN at.id = last_touch_id THEN 40.00
        ELSE CASE WHEN touch_count > 2 THEN (20.00 / (touch_count - 2)) ELSE 0.00 END
      END::NUMERIC,
      CASE 
        WHEN at.id = first_touch_id AND at.id = last_touch_id THEN deal_value
        WHEN at.id = first_touch_id THEN deal_value * 0.40
        WHEN at.id = last_touch_id THEN deal_value * 0.40
        ELSE CASE WHEN touch_count > 2 THEN (deal_value * 0.20) / (touch_count - 2) ELSE 0.00 END
      END::NUMERIC
    FROM attribution_touchpoints at WHERE at.deal_id = p_deal_id;
    
  ELSE -- time_decay (default)
    -- More recent touches get more credit (exponential decay)
    RETURN QUERY
    WITH ranked AS (
      SELECT 
        at.id,
        ROW_NUMBER() OVER (ORDER BY at.touchpoint_time DESC) as recency_rank
      FROM attribution_touchpoints at WHERE at.deal_id = p_deal_id
    ),
    weights AS (
      SELECT 
        id,
        POWER(0.7, recency_rank - 1) as weight
      FROM ranked
    ),
    total_weight AS (
      SELECT SUM(weight) as total FROM weights
    )
    SELECT 
      w.id,
      ((w.weight / tw.total) * 100)::NUMERIC,
      ((w.weight / tw.total) * deal_value)::NUMERIC
    FROM weights w, total_weight tw;
  END IF;
END;
$$;