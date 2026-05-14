ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS flyer_setup_price integer NOT NULL DEFAULT 6000,
  ADD COLUMN IF NOT EXISTS flyer_tier_prices jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS flyer_show_margarita boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS flyer_margarita_note text,
  ADD COLUMN IF NOT EXISTS flyer_tagline text;