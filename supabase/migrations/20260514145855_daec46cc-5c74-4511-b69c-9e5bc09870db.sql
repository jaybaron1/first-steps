
-- 1. Tighten admin_sessions: require admin role for INSERT/UPDATE
DROP POLICY IF EXISTS "Authenticated users can insert own sessions" ON public.admin_sessions;
CREATE POLICY "Admins can insert own sessions" ON public.admin_sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can update own sessions" ON public.admin_sessions;
CREATE POLICY "Admins can update own sessions" ON public.admin_sessions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users view own sessions" ON public.admin_sessions;
CREATE POLICY "Admins view own sessions" ON public.admin_sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix mutable search_path on update_deal_timestamp
ALTER FUNCTION public.update_deal_timestamp() SET search_path = public;

-- 3. Server-side enforcement: only @galavanteer.com users may hold the admin role
CREATE OR REPLACE FUNCTION public.enforce_admin_email_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
BEGIN
  IF NEW.role = 'admin'::app_role THEN
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
    IF user_email IS NULL OR user_email NOT ILIKE '%@galavanteer.com' THEN
      RAISE EXCEPTION 'Admin role can only be granted to @galavanteer.com email addresses';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_admin_email_domain_trg ON public.user_roles;
CREATE TRIGGER enforce_admin_email_domain_trg
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_email_domain();
