ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS landing_headline text,
  ADD COLUMN IF NOT EXISTS landing_subheadline text,
  ADD COLUMN IF NOT EXISTS landing_bio text,
  ADD COLUMN IF NOT EXISTS landing_bullets jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS landing_photo_url text,
  ADD COLUMN IF NOT EXISTS landing_logo_url text,
  ADD COLUMN IF NOT EXISTS landing_testimonial text,
  ADD COLUMN IF NOT EXISTS landing_accent_color text,
  ADD COLUMN IF NOT EXISTS landing_published boolean NOT NULL DEFAULT false;

-- Allow public (anon) to read landing-page fields for white-label partners via slug.
-- The existing partners table already has RLS; we add a permissive SELECT for published landing pages.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'partners'
      AND policyname = 'Public can read published white-label landing pages'
  ) THEN
    CREATE POLICY "Public can read published white-label landing pages"
      ON public.partners FOR SELECT
      TO anon, authenticated
      USING (is_white_label = true AND landing_published = true AND slug IS NOT NULL);
  END IF;
END $$;