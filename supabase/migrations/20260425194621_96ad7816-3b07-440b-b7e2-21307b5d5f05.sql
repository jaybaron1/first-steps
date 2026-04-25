-- 1. Subscriptions table for recurring MRR (your direct business + partner clients)
CREATE TABLE public.client_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.partner_clients(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  monthly_amount numeric NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  status text NOT NULL DEFAULT 'active', -- active, paused, churned
  is_partner_sourced boolean NOT NULL DEFAULT false,
  partner_id uuid REFERENCES public.partners(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_subscriptions_status ON public.client_subscriptions(status);
CREATE INDEX idx_client_subscriptions_client ON public.client_subscriptions(client_id);

ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage subscriptions" ON public.client_subscriptions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_client_subscriptions_updated
  BEFORE UPDATE ON public.client_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 2. Add source tracking to revenue_events so admin dashboard can split partner vs direct
ALTER TABLE public.revenue_events
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'direct', -- direct, partner, subscription
  ADD COLUMN IF NOT EXISTS partner_id uuid REFERENCES public.partners(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS commercial_event_id uuid REFERENCES public.commercial_events(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS subscription_id uuid REFERENCES public.client_subscriptions(id) ON DELETE CASCADE;

-- Make deal_id nullable since partner/subscription revenue may not have a deal
ALTER TABLE public.revenue_events ALTER COLUMN deal_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_revenue_events_source ON public.revenue_events(source);
CREATE INDEX IF NOT EXISTS idx_revenue_events_partner ON public.revenue_events(partner_id);

-- 3. Trigger: auto-create revenue_event when a commercial_event is inserted
CREATE OR REPLACE FUNCTION public.sync_commercial_to_revenue()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner_id uuid;
  v_client_name text;
BEGIN
  SELECT partner_id, client_name INTO v_partner_id, v_client_name
  FROM public.partner_clients WHERE id = NEW.client_id;

  -- Only roll up positive paid revenue
  IF NEW.amount_charged > 0 THEN
    INSERT INTO public.revenue_events (
      amount, event_type, event_date, description,
      source, partner_id, commercial_event_id, currency
    ) VALUES (
      NEW.amount_charged,
      'partner_' || NEW.event_type::text,
      NEW.event_date,
      v_client_name || ' — ' || NEW.event_type::text,
      'partner',
      v_partner_id,
      NEW.id,
      'USD'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_commercial_to_revenue
  AFTER INSERT ON public.commercial_events
  FOR EACH ROW EXECUTE FUNCTION public.sync_commercial_to_revenue();

-- 4. Trigger: keep revenue_event in sync when commercial_event updates
CREATE OR REPLACE FUNCTION public.sync_commercial_update_to_revenue()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.revenue_events
  SET amount = NEW.amount_charged,
      event_date = NEW.event_date,
      event_type = 'partner_' || NEW.event_type::text
  WHERE commercial_event_id = NEW.id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_commercial_update_to_revenue
  AFTER UPDATE ON public.commercial_events
  FOR EACH ROW
  WHEN (OLD.amount_charged IS DISTINCT FROM NEW.amount_charged
     OR OLD.event_date IS DISTINCT FROM NEW.event_date
     OR OLD.event_type IS DISTINCT FROM NEW.event_type)
  EXECUTE FUNCTION public.sync_commercial_update_to_revenue();

-- 5. Backfill: roll up existing commercial_events into revenue_events
INSERT INTO public.revenue_events (amount, event_type, event_date, description, source, partner_id, commercial_event_id, currency)
SELECT
  ce.amount_charged,
  'partner_' || ce.event_type::text,
  ce.event_date,
  pc.client_name || ' — ' || ce.event_type::text,
  'partner',
  pc.partner_id,
  ce.id,
  'USD'
FROM public.commercial_events ce
JOIN public.partner_clients pc ON pc.id = ce.client_id
WHERE ce.amount_charged > 0
  AND NOT EXISTS (SELECT 1 FROM public.revenue_events re WHERE re.commercial_event_id = ce.id);

-- 6. Function: generate monthly revenue events from active subscriptions (idempotent per month)
CREATE OR REPLACE FUNCTION public.generate_subscription_revenue(p_month date DEFAULT date_trunc('month', CURRENT_DATE)::date)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer := 0;
  v_sub RECORD;
BEGIN
  FOR v_sub IN
    SELECT * FROM public.client_subscriptions
    WHERE status = 'active'
      AND start_date <= (p_month + interval '1 month - 1 day')::date
      AND (end_date IS NULL OR end_date >= p_month)
  LOOP
    -- Skip if already generated for this month
    IF NOT EXISTS (
      SELECT 1 FROM public.revenue_events
      WHERE subscription_id = v_sub.id
        AND date_trunc('month', event_date) = date_trunc('month', p_month::timestamptz)
    ) THEN
      INSERT INTO public.revenue_events (
        amount, event_type, event_date, description,
        source, partner_id, subscription_id, currency
      ) VALUES (
        v_sub.monthly_amount,
        'subscription',
        p_month,
        v_sub.client_name || ' — monthly subscription',
        CASE WHEN v_sub.is_partner_sourced THEN 'partner' ELSE 'subscription' END,
        v_sub.partner_id,
        v_sub.id,
        'USD'
      );
      v_count := v_count + 1;
    END IF;
  END LOOP;
  RETURN v_count;
END;
$$;