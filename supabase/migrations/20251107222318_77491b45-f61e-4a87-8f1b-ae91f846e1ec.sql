-- Create active_sessions table to track admin sessions
CREATE TABLE public.active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index for efficient querying
CREATE INDEX idx_active_sessions_user_id ON public.active_sessions(user_id);
CREATE INDEX idx_active_sessions_expires_at ON public.active_sessions(expires_at);
CREATE INDEX idx_active_sessions_last_activity ON public.active_sessions(last_activity);

-- Create ip_whitelist table
CREATE TABLE public.ip_whitelist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  description TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Create index for IP lookups
CREATE INDEX idx_ip_whitelist_ip_address ON public.ip_whitelist(ip_address);
CREATE INDEX idx_ip_whitelist_is_active ON public.ip_whitelist(is_active);

-- Create failed_login_attempts table
CREATE TABLE public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  reason TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index for failed attempts
CREATE INDEX idx_failed_login_attempts_email ON public.failed_login_attempts(email);
CREATE INDEX idx_failed_login_attempts_ip ON public.failed_login_attempts(ip_address);
CREATE INDEX idx_failed_login_attempts_attempted_at ON public.failed_login_attempts(attempted_at DESC);

-- Enable RLS
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for active_sessions (admins can view all)
CREATE POLICY "Admins can view all active sessions"
  ON public.active_sessions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage sessions"
  ON public.active_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ip_whitelist (admins can view and manage)
CREATE POLICY "Admins can view IP whitelist"
  ON public.ip_whitelist
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert to IP whitelist"
  ON public.ip_whitelist
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update IP whitelist"
  ON public.ip_whitelist
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete from IP whitelist"
  ON public.ip_whitelist
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for failed_login_attempts (admins can view)
CREATE POLICY "Admins can view failed login attempts"
  ON public.failed_login_attempts
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can insert failed attempts"
  ON public.failed_login_attempts
  FOR INSERT
  WITH CHECK (true);

-- Function to check if IP is whitelisted
CREATE OR REPLACE FUNCTION public.is_ip_whitelisted(_ip_address TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ip_whitelist
    WHERE ip_address = _ip_address
      AND is_active = true
  )
$$;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.active_sessions
  WHERE expires_at < now()
    OR last_activity < (now() - interval '30 minutes');
END;
$$;