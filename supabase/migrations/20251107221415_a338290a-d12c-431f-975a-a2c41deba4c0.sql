-- Create audit_logs table to track all admin actions
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index for efficient querying
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);

-- Create mfa_secrets table for TOTP 2FA
CREATE TABLE public.mfa_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  secret TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false NOT NULL,
  backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_secrets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit_logs (only admins can view)
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for mfa_secrets (users can only access their own)
CREATE POLICY "Users can view their own MFA secrets"
  ON public.mfa_secrets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MFA secrets"
  ON public.mfa_secrets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA secrets"
  ON public.mfa_secrets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MFA secrets"
  ON public.mfa_secrets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update mfa_secrets updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_mfa_secrets_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for mfa_secrets updated_at
CREATE TRIGGER update_mfa_secrets_updated_at
  BEFORE UPDATE ON public.mfa_secrets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mfa_secrets_updated_at();