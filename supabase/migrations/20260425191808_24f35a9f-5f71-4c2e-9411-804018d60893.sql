-- Enums
CREATE TYPE public.partner_status AS ENUM ('active', 'inactive', 'expired', 'terminated');
CREATE TYPE public.referral_type AS ENUM ('direct_introduction', 'self_identified');
CREATE TYPE public.attribution_status AS ENUM ('pending', 'approved', 'disputed', 'rejected');
CREATE TYPE public.client_lifecycle_status AS ENUM ('prospect', 'active', 'inactive', 'reactivated', 'churned');
CREATE TYPE public.product_level AS ENUM ('level_1_base_boardroom', 'level_2_integrated_company_knowledge', 'level_3_present_persona', 'level_4_future_persona');
CREATE TYPE public.client_configuration AS ENUM ('standard', 'co_branded');
CREATE TYPE public.commercial_event_type AS ENUM ('build_fee', 'upgrade', 'persona_addition', 'light_reactivation', 'refresh', 'rebuild');
CREATE TYPE public.payment_status AS ENUM ('not_due', 'due', 'paid', 'disputed');

-- Helper
CREATE OR REPLACE FUNCTION public.is_partners_user(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin'::app_role, 'sdr'::app_role)
  )
$$;

-- partners
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  status public.partner_status NOT NULL DEFAULT 'active',
  agreement_date date,
  last_promotional_activity_date date,
  notes text,
  owner_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_partners_owner ON public.partners(owner_id);
CREATE INDEX idx_partners_status ON public.partners(status);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all partners" ON public.partners FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "SDRs view own partners" ON public.partners FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());
CREATE POLICY "SDRs insert own partners" ON public.partners FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());
CREATE POLICY "SDRs update own partners" ON public.partners FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid())
  WITH CHECK (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());
CREATE POLICY "SDRs delete own partners" ON public.partners FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());

-- partner_clients
CREATE TABLE public.partner_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE RESTRICT,
  client_name text NOT NULL,
  company text,
  contact_name text,
  email text,
  phone text,
  referral_type public.referral_type NOT NULL DEFAULT 'direct_introduction',
  attribution_status public.attribution_status NOT NULL DEFAULT 'pending',
  date_logged date NOT NULL DEFAULT CURRENT_DATE,
  first_paid_engagement_date date,
  client_status public.client_lifecycle_status NOT NULL DEFAULT 'prospect',
  product_level public.product_level,
  configuration public.client_configuration NOT NULL DEFAULT 'standard',
  partner_persona_included boolean NOT NULL DEFAULT false,
  notes text,
  owner_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_partner_clients_partner ON public.partner_clients(partner_id);
CREATE INDEX idx_partner_clients_owner ON public.partner_clients(owner_id);
CREATE INDEX idx_partner_clients_attribution ON public.partner_clients(attribution_status);
CREATE INDEX idx_partner_clients_status ON public.partner_clients(client_status);
ALTER TABLE public.partner_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all clients" ON public.partner_clients FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "SDRs view own clients" ON public.partner_clients FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());
CREATE POLICY "SDRs insert own clients" ON public.partner_clients FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());
CREATE POLICY "SDRs update own clients" ON public.partner_clients FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid())
  WITH CHECK (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());
CREATE POLICY "SDRs delete own clients" ON public.partner_clients FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'sdr'::app_role) AND owner_id = auth.uid());

-- commercial_events
CREATE TABLE public.commercial_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.partner_clients(id) ON DELETE CASCADE,
  event_type public.commercial_event_type NOT NULL,
  event_date date NOT NULL DEFAULT CURRENT_DATE,
  amount_charged numeric(12,2) NOT NULL DEFAULT 0,
  processing_fee numeric(12,2) NOT NULL DEFAULT 0,
  net_revenue numeric(12,2) NOT NULL DEFAULT 0,
  commission_rate numeric(5,4) NOT NULL DEFAULT 0,
  commission_amount numeric(12,2) NOT NULL DEFAULT 0,
  payment_status public.payment_status NOT NULL DEFAULT 'not_due',
  payment_due_date date,
  payment_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_commercial_events_client ON public.commercial_events(client_id);
CREATE INDEX idx_commercial_events_payment_status ON public.commercial_events(payment_status);
ALTER TABLE public.commercial_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all events" ON public.commercial_events FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "SDRs view events on own clients" ON public.commercial_events FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'sdr'::app_role) AND
    EXISTS (SELECT 1 FROM public.partner_clients pc WHERE pc.id = client_id AND pc.owner_id = auth.uid()));
CREATE POLICY "SDRs insert events on own clients" ON public.commercial_events FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'sdr'::app_role) AND
    EXISTS (SELECT 1 FROM public.partner_clients pc WHERE pc.id = client_id AND pc.owner_id = auth.uid()));
CREATE POLICY "SDRs update events on own clients" ON public.commercial_events FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'sdr'::app_role) AND
    EXISTS (SELECT 1 FROM public.partner_clients pc WHERE pc.id = client_id AND pc.owner_id = auth.uid()));
CREATE POLICY "SDRs delete events on own clients" ON public.commercial_events FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'sdr'::app_role) AND
    EXISTS (SELECT 1 FROM public.partner_clients pc WHERE pc.id = client_id AND pc.owner_id = auth.uid()));

-- client_notes
CREATE TABLE public.client_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.partner_clients(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  author_email text,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_client_notes_client ON public.client_notes(client_id, created_at DESC);
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all notes" ON public.client_notes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "SDRs view notes on own clients" ON public.client_notes FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'sdr'::app_role) AND
    EXISTS (SELECT 1 FROM public.partner_clients pc WHERE pc.id = client_id AND pc.owner_id = auth.uid()));
CREATE POLICY "SDRs insert notes on own clients" ON public.client_notes FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'sdr'::app_role) AND author_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.partner_clients pc WHERE pc.id = client_id AND pc.owner_id = auth.uid()));

-- Auto-calc commission
CREATE OR REPLACE FUNCTION public.calculate_commercial_event()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.net_revenue := COALESCE(NEW.amount_charged, 0) - COALESCE(NEW.processing_fee, 0);
  NEW.commission_rate := CASE NEW.event_type
    WHEN 'light_reactivation' THEN 0.10
    WHEN 'refresh' THEN 0.15
    WHEN 'build_fee' THEN 0.20
    WHEN 'upgrade' THEN 0.20
    WHEN 'persona_addition' THEN 0.20
    WHEN 'rebuild' THEN 0.20
    ELSE 0
  END;
  IF COALESCE(NEW.amount_charged, 0) < 1000 THEN
    NEW.commission_amount := 0;
  ELSE
    NEW.commission_amount := ROUND(NEW.net_revenue * NEW.commission_rate, 2);
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_calc_commercial_event
  BEFORE INSERT OR UPDATE ON public.commercial_events
  FOR EACH ROW EXECUTE FUNCTION public.calculate_commercial_event();

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_partners_updated_at BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_partner_clients_updated_at BEFORE UPDATE ON public.partner_clients
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Attribution dispute detection
CREATE OR REPLACE FUNCTION public.detect_attribution_dispute()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE conflict_count integer;
BEGIN
  IF NEW.email IS NULL AND NEW.company IS NULL THEN RETURN NEW; END IF;
  SELECT COUNT(*) INTO conflict_count FROM public.partner_clients
  WHERE id <> NEW.id AND partner_id <> NEW.partner_id
    AND ((NEW.email IS NOT NULL AND lower(email) = lower(NEW.email))
      OR (NEW.company IS NOT NULL AND lower(company) = lower(NEW.company)));
  IF conflict_count > 0 THEN
    NEW.attribution_status := 'disputed';
    UPDATE public.partner_clients SET attribution_status = 'disputed'
     WHERE id <> NEW.id AND partner_id <> NEW.partner_id
       AND ((NEW.email IS NOT NULL AND lower(email) = lower(NEW.email))
         OR (NEW.company IS NOT NULL AND lower(company) = lower(NEW.company)));
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_detect_attribution_dispute
  BEFORE INSERT OR UPDATE OF email, company, partner_id ON public.partner_clients
  FOR EACH ROW EXECUTE FUNCTION public.detect_attribution_dispute();