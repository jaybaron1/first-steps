
-- Add 'partner' role to enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'partner';

-- Extend partners table
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS is_white_label boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS portal_user_id uuid;

CREATE INDEX IF NOT EXISTS idx_partners_slug ON public.partners(lower(slug));
CREATE INDEX IF NOT EXISTS idx_partners_portal_user ON public.partners(portal_user_id);

-- Helper: is the current user a portal-partner who owns this partner row?
CREATE OR REPLACE FUNCTION public.is_portal_partner_for(_partner_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.partners
    WHERE id = _partner_id AND portal_user_id = auth.uid()
  )
$$;

-- Helper: get the partner_id for the currently logged-in portal user
CREATE OR REPLACE FUNCTION public.current_portal_partner_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.partners WHERE portal_user_id = auth.uid() LIMIT 1
$$;

-- Allow portal partners to SELECT their own partner row
CREATE POLICY "Portal partners view own partner row"
  ON public.partners FOR SELECT TO authenticated
  USING (portal_user_id = auth.uid());

-- ----- Click log -----
CREATE TABLE IF NOT EXISTS public.partner_referral_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  slug_used text NOT NULL,
  session_id text,
  landing_url text,
  referrer text,
  user_agent text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_clicks_partner ON public.partner_referral_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_clicks_session ON public.partner_referral_clicks(session_id);

ALTER TABLE public.partner_referral_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert clicks"
  ON public.partner_referral_clicks FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins view all clicks"
  ON public.partner_referral_clicks FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "SDRs view own partners' clicks"
  ON public.partner_referral_clicks FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'sdr'::app_role)
    AND EXISTS (SELECT 1 FROM public.partners p WHERE p.id = partner_id AND p.owner_id = auth.uid())
  );

CREATE POLICY "Portal partners view own clicks"
  ON public.partner_referral_clicks FOR SELECT TO authenticated
  USING (is_portal_partner_for(partner_id));

-- ----- Portal invite tracking -----
CREATE TABLE IF NOT EXISTS public.partner_portal_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  email text NOT NULL,
  invited_by uuid,
  invited_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);
ALTER TABLE public.partner_portal_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage invites"
  ON public.partner_portal_invites FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ----- Lead + partner_clients attribution columns -----
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS referred_by_partner_id uuid,
  ADD COLUMN IF NOT EXISTS referral_session_id text;

ALTER TABLE public.partner_clients
  ADD COLUMN IF NOT EXISTS referred_by_partner_id uuid,
  ADD COLUMN IF NOT EXISTS referral_session_id text,
  ADD COLUMN IF NOT EXISTS source_lead_id uuid;

CREATE INDEX IF NOT EXISTS idx_leads_referred_partner ON public.leads(referred_by_partner_id);

-- Allow portal partners to read their own commission events & clients (read-only)
CREATE POLICY "Portal partners view own clients"
  ON public.partner_clients FOR SELECT TO authenticated
  USING (is_portal_partner_for(partner_id));

CREATE POLICY "Portal partners view own commission events"
  ON public.commercial_events FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.partner_clients pc
      WHERE pc.id = commercial_events.client_id
      AND is_portal_partner_for(pc.partner_id)
    )
  );

-- ----- Auto-create partner_client when a lead arrives tagged to a partner -----
CREATE OR REPLACE FUNCTION public.auto_create_partner_client_from_lead()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_partner record;
  v_new_client_id uuid;
BEGIN
  IF NEW.referred_by_partner_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT id, owner_id INTO v_partner
  FROM public.partners WHERE id = NEW.referred_by_partner_id;

  IF v_partner.id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Avoid duplicates: skip if a client with same email already exists for this partner
  IF NEW.email IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.partner_clients
    WHERE partner_id = v_partner.id AND lower(email) = lower(NEW.email)
  ) THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.partner_clients (
    partner_id, owner_id, client_name, contact_name, email, phone,
    company, notes, referral_type, referred_by_partner_id, referral_session_id,
    source_lead_id, attribution_status, client_status
  ) VALUES (
    v_partner.id,
    v_partner.owner_id,
    COALESCE(NEW.name, NEW.company, NEW.email, 'Inbound lead'),
    NEW.name,
    NEW.email,
    NEW.phone,
    NEW.company,
    'Auto-created from inbound lead. ' || COALESCE(NEW.message, ''),
    'self_identified'::referral_type,
    NEW.referred_by_partner_id,
    NEW.referral_session_id,
    NEW.id,
    'pending'::attribution_status,
    'prospect'::client_lifecycle_status
  )
  RETURNING id INTO v_new_client_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_create_partner_client_from_lead ON public.leads;
CREATE TRIGGER trg_auto_create_partner_client_from_lead
  AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_partner_client_from_lead();

-- Touch updated_at on partners (already exists for table? add safe)
DROP TRIGGER IF EXISTS trg_partners_touch ON public.partners;
CREATE TRIGGER trg_partners_touch BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
