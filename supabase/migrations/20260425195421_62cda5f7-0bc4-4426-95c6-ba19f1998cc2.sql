
-- ============ APPOINTMENTS ============
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.partner_clients(id) ON DELETE CASCADE,
  partner_id uuid REFERENCES public.partners(id) ON DELETE SET NULL,
  owner_id uuid NOT NULL,
  title text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  location text,
  meeting_link text,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  ics_uid text NOT NULL DEFAULT (gen_random_uuid()::text || '@galavanteer.com'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointments_owner ON public.appointments(owner_id);
CREATE INDEX idx_appointments_scheduled ON public.appointments(scheduled_at);
CREATE INDEX idx_appointments_client ON public.appointments(client_id);

CREATE TRIGGER appointments_touch
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all appointments"
ON public.appointments FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "SDRs view own appointments"
ON public.appointments FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());

CREATE POLICY "SDRs insert own appointments"
ON public.appointments FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());

CREATE POLICY "SDRs update own appointments"
ON public.appointments FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid())
WITH CHECK (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());

CREATE POLICY "SDRs delete own appointments"
ON public.appointments FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());

-- ============ SDR COMMISSION RATES ============
CREATE TABLE public.sdr_commission_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  user_email text,
  rate_build numeric NOT NULL DEFAULT 0.20,
  rate_upgrade numeric NOT NULL DEFAULT 0.20,
  rate_persona_addition numeric NOT NULL DEFAULT 0.20,
  rate_rebuild numeric NOT NULL DEFAULT 0.20,
  rate_light_reactivation numeric NOT NULL DEFAULT 0.10,
  rate_refresh numeric NOT NULL DEFAULT 0.15,
  mrr_commissionable boolean NOT NULL DEFAULT false,
  rate_mrr numeric NOT NULL DEFAULT 0.00,
  pricing_floor numeric NOT NULL DEFAULT 1000.00,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER sdr_rates_touch
BEFORE UPDATE ON public.sdr_commission_rates
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.sdr_commission_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage rates"
ON public.sdr_commission_rates FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "SDRs view own rates"
ON public.sdr_commission_rates FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- ============ ICS FEED TOKENS ============
CREATE TABLE public.ics_feed_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now(),
  rotated_at timestamptz
);

ALTER TABLE public.ics_feed_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all tokens"
ON public.ics_feed_tokens FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users manage own token"
ON public.ics_feed_tokens FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============ UPDATE COMMISSION CALC ============
-- Override default trigger to look up per-SDR rates
CREATE OR REPLACE FUNCTION public.calculate_commercial_event()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_owner_id uuid;
  v_rates RECORD;
BEGIN
  -- Look up the SDR who owns this client
  SELECT pc.owner_id INTO v_owner_id
  FROM public.partner_clients pc WHERE pc.id = NEW.client_id;

  -- Pull per-SDR overrides (may be NULL)
  SELECT * INTO v_rates FROM public.sdr_commission_rates
  WHERE user_id = v_owner_id;

  NEW.net_revenue := COALESCE(NEW.amount_charged, 0) - COALESCE(NEW.processing_fee, 0);

  NEW.commission_rate := CASE NEW.event_type
    WHEN 'light_reactivation' THEN COALESCE(v_rates.rate_light_reactivation, 0.10)
    WHEN 'refresh' THEN COALESCE(v_rates.rate_refresh, 0.15)
    WHEN 'build_fee' THEN COALESCE(v_rates.rate_build, 0.20)
    WHEN 'upgrade' THEN COALESCE(v_rates.rate_upgrade, 0.20)
    WHEN 'persona_addition' THEN COALESCE(v_rates.rate_persona_addition, 0.20)
    WHEN 'rebuild' THEN COALESCE(v_rates.rate_rebuild, 0.20)
    ELSE 0
  END;

  IF COALESCE(NEW.amount_charged, 0) < COALESCE(v_rates.pricing_floor, 1000) THEN
    NEW.commission_amount := 0;
  ELSE
    NEW.commission_amount := ROUND(NEW.net_revenue * NEW.commission_rate, 2);
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
