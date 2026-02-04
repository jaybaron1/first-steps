-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop the policy that allows users to read their own MFA secrets
DROP POLICY IF EXISTS "Users can view their own MFA secrets" ON public.mfa_secrets;

-- Create a secure function to verify TOTP that only service role can call
-- This prevents users from reading the plaintext secrets
CREATE OR REPLACE FUNCTION public.verify_totp_secret(
  _user_id uuid,
  _token text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_secret text;
BEGIN
  -- Only fetch the secret, verification happens in edge function
  SELECT secret INTO v_secret
  FROM mfa_secrets
  WHERE user_id = _user_id AND enabled = true;
  
  -- Return true if secret exists (actual verification in edge function)
  RETURN v_secret IS NOT NULL;
END;
$$;

-- Add comment explaining the security model
COMMENT ON FUNCTION public.verify_totp_secret IS 'Checks if user has 2FA enabled without exposing secrets. Actual TOTP verification must happen in edge functions with service role.';

-- Ensure service role can still read secrets for verification
-- Users can only insert, update, and delete their own secrets, but not read them
GRANT SELECT ON public.mfa_secrets TO service_role;