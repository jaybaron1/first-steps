import React, { useEffect, useState } from 'react';
import { adminSupabase as supabase, adminBackendIsPlaceholder } from '@/lib/adminBackend';
import { Session, User } from '@supabase/supabase-js';
import { Shield, Loader2, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, UserPlus, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ALLOWED_EMAIL_DOMAIN = '@galavanteer.com';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface AdminRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'moderator' | 'user';
}

interface LoginAttempts {
  count: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, requireRole }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [hasRequiredRole, setHasRequiredRole] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'login' | 'signup' | 'reset' | 'reset-sent'>('login');
  
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempts>(() => {
    const stored = sessionStorage.getItem('admin_login_attempts');
    if (stored) return JSON.parse(stored);
    return { count: 0, lastAttempt: 0, lockedUntil: null };
  });
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Check session and validate user
  useEffect(() => {
    let mounted = true;

    const validateSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (!currentSession?.user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const userEmail = currentSession.user.email || '';
        if (!userEmail.endsWith(ALLOWED_EMAIL_DOMAIN)) {
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setSession(currentSession);
        setUser(currentSession.user);
        setIsAuthenticated(true);

        if (requireRole && currentSession.user.id) {
          const { data: hasRole } = await supabase.rpc('has_role', {
            _user_id: currentSession.user.id,
            _role: requireRole,
          });
          if (mounted) setHasRequiredRole(!!hasRole);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Session validation error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    validateSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !newSession) {
        setIsAuthenticated(false);
        setSession(null);
        setUser(null);
      } else if (newSession?.user) {
        const email = newSession.user.email || '';
        if (email.endsWith(ALLOWED_EMAIL_DOMAIN)) {
          setSession(newSession);
          setUser(newSession.user);
          setIsAuthenticated(true);
        } else {
          setTimeout(() => supabase.auth.signOut(), 0);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [requireRole]);

  // Session timeout tracking
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => setLastActivity(Date.now());

    const checkTimeout = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        supabase.auth.signOut();
      }
    }, 60000);

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, updateActivity, { passive: true }));

    return () => {
      clearInterval(checkTimeout);
      events.forEach(event => window.removeEventListener(event, updateActivity));
    };
  }, [isAuthenticated, lastActivity]);

  // Lockout timer
  useEffect(() => {
    if (loginAttempts.lockedUntil) {
      const interval = setInterval(() => {
        const remaining = loginAttempts.lockedUntil! - Date.now();
        if (remaining <= 0) {
          const reset = { count: 0, lastAttempt: 0, lockedUntil: null };
          setLoginAttempts(reset);
          sessionStorage.setItem('admin_login_attempts', JSON.stringify(reset));
          setLockoutRemaining(0);
        } else {
          setLockoutRemaining(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loginAttempts.lockedUntil]);

  useEffect(() => {
    sessionStorage.setItem('admin_login_attempts', JSON.stringify(loginAttempts));
  }, [loginAttempts]);

  const isLockedOut = loginAttempts.lockedUntil && Date.now() < loginAttempts.lockedUntil;

  const validateEmail = (email: string): boolean => {
    if (!email.endsWith(ALLOWED_EMAIL_DOMAIN)) {
      setError(`Access restricted to ${ALLOWED_EMAIL_DOMAIN} addresses only`);
      return false;
    }
    return true;
  };

  const recordFailedAttempt = () => {
    const newCount = loginAttempts.count + 1;
    const now = Date.now();
    
    if (newCount >= MAX_ATTEMPTS) {
      setLoginAttempts({ count: newCount, lastAttempt: now, lockedUntil: now + LOCKOUT_DURATION });
      setError('Too many failed attempts. Account locked for 15 minutes.');
    } else {
      setLoginAttempts({ count: newCount, lastAttempt: now, lockedUntil: null });
      setError(`Invalid credentials. ${MAX_ATTEMPTS - newCount} attempts remaining.`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (adminBackendIsPlaceholder) {
      setError('Backend configuration not loaded. Please refresh.');
      return;
    }
    if (isLockedOut) {
      setError('Account is temporarily locked.');
      return;
    }
    if (!validateEmail(email)) return;

    setIsSubmitting(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        recordFailedAttempt();
        return;
      }

      if (data.user) {
        const reset = { count: 0, lastAttempt: 0, lockedUntil: null };
        setLoginAttempts(reset);
        sessionStorage.setItem('admin_login_attempts', JSON.stringify(reset));
        toast({ title: 'Welcome back', description: 'Successfully signed in' });
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (adminBackendIsPlaceholder) {
      setError('Backend configuration not loaded. Please refresh.');
      return;
    }
    if (!validateEmail(email)) return;
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });

      if (signupError) {
        setError(signupError.message.includes('already registered') 
          ? 'This email is already registered. Please sign in.' 
          : signupError.message);
        return;
      }

      if (data.user) {
        toast({ title: 'Account created', description: 'Check your email to verify your account.' });
        setView('login');
        setPassword('');
        setConfirmPassword('');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (adminBackendIsPlaceholder) {
      setError('Backend configuration not loaded. Please refresh.');
      return;
    }
    if (!validateEmail(email)) return;

    setIsSubmitting(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/admin` }
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setView('reset-sent');
      toast({ title: 'Check your email', description: 'Password reset instructions sent.' });
    } catch {
      setError('Failed to send reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="admin-theme min-h-screen bg-[hsl(var(--admin-bg))] flex items-center justify-center">
        <Helmet>
          <title>Admin | Galavanteer</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#B8956C]/10 border border-[hsl(var(--admin-border))] mb-4">
            <Shield className="w-8 h-8 text-[#B8956C]" />
          </div>
          <div className="flex items-center gap-2 text-[hsl(var(--admin-text-muted))]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying access...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show login form
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Admin | Galavanteer</title>
          <meta name="robots" content="noindex, nofollow, noarchive" />
        </Helmet>

        <div className="admin-theme min-h-screen bg-[hsl(var(--admin-bg))] flex items-center justify-center p-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--admin-accent)/0.08)] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--admin-accent)/0.05)] rounded-full blur-3xl" />
          </div>

          <div className="relative w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[hsl(var(--admin-accent)/0.1)] border border-[hsl(var(--admin-border))] mb-4">
                <Shield className="w-8 h-8 text-[#B8956C]" />
              </div>
              <h1 className="text-2xl font-semibold text-[hsl(var(--admin-text))] mb-1">Admin Portal</h1>
              <p className="text-sm text-[hsl(var(--admin-text-subtle))]">Galavanteer Command Center</p>
            </div>

            <div className="bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-2xl p-8 shadow-xl">
              {view === 'login' && (
                <form onSubmit={handleLogin} className="space-y-6">
                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  {isLockedOut && (
                    <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-sm text-amber-400 font-medium">Account Temporarily Locked</p>
                        <p className="text-xs text-amber-400/70">Try again in {formatTime(lockoutRemaining)}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-[hsl(var(--admin-text-muted))]">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--admin-text-subtle))]" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@galavanteer.com"
                        disabled={isSubmitting || !!isLockedOut}
                        className="pl-11 h-12 bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] placeholder:text-[hsl(var(--admin-text-subtle))] focus:border-[#B8956C]/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm text-[hsl(var(--admin-text-muted))]">Password</Label>
                      <button type="button" onClick={() => setView('reset')} className="text-xs text-[#B8956C] hover:text-[#B8956C]/80">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--admin-text-subtle))]" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isSubmitting || !!isLockedOut}
                        className="pl-11 pr-11 h-12 bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] placeholder:text-[hsl(var(--admin-text-subtle))] focus:border-[#B8956C]/50"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--admin-text-subtle))] hover:text-[hsl(var(--admin-text-muted))]">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting || !!isLockedOut} className="w-full h-12 bg-[#B8956C] hover:bg-[#B8956C]/90 text-white font-medium">
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-[hsl(var(--admin-text-subtle))]">
                      Don't have an account?{' '}
                      <button type="button" onClick={() => { setView('signup'); setError(null); }} className="text-[#B8956C] hover:text-[#B8956C]/80">
                        Request access
                      </button>
                    </p>
                  </div>

                  <p className="text-center text-xs text-[hsl(var(--admin-text-subtle))]">
                    Access restricted to authorized personnel only.<br />All login attempts are logged.
                  </p>
                </form>
              )}

              {view === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="text-center mb-2">
                    <h2 className="text-lg font-medium text-[hsl(var(--admin-text))]">Create Account</h2>
                    <p className="text-sm text-[hsl(var(--admin-text-subtle))] mt-1">Only @galavanteer.com emails allowed</p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm text-[hsl(var(--admin-text-muted))]">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--admin-text-subtle))]" />
                      <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@galavanteer.com" disabled={isSubmitting} className="pl-11 h-12 bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm text-[hsl(var(--admin-text-muted))]">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--admin-text-subtle))]" />
                      <Input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" disabled={isSubmitting} className="pl-11 pr-11 h-12 bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--admin-text-subtle))]">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm text-[hsl(var(--admin-text-muted))]">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--admin-text-subtle))]" />
                      <Input id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" disabled={isSubmitting} className="pl-11 h-12 bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]" required />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-[#B8956C] hover:bg-[#B8956C]/90 text-white font-medium">
                    {isSubmitting ? (
                      <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span>Creating account...</span></div>
                    ) : (
                      <div className="flex items-center gap-2"><UserPlus className="w-4 h-4" /><span>Create Account</span></div>
                    )}
                  </Button>

                  <div className="text-center">
                    <button type="button" onClick={() => { setView('login'); setError(null); }} className="text-sm text-[#B8956C] hover:text-[#B8956C]/80 flex items-center gap-1 mx-auto">
                      <ArrowLeft className="w-4 h-4" /> Back to login
                    </button>
                  </div>
                </form>
              )}

              {view === 'reset' && (
                <form onSubmit={handlePasswordReset} className="space-y-6">
                  <div className="text-center mb-2">
                    <h2 className="text-lg font-medium text-[hsl(var(--admin-text))]">Reset Password</h2>
                    <p className="text-sm text-[hsl(var(--admin-text-subtle))] mt-1">Enter your email to receive reset instructions</p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-sm text-[hsl(var(--admin-text-muted))]">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--admin-text-subtle))]" />
                      <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@galavanteer.com" disabled={isSubmitting} className="pl-11 h-12 bg-[hsl(var(--admin-bg))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))]" required />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-[#B8956C] hover:bg-[#B8956C]/90 text-white font-medium">
                    {isSubmitting ? (
                      <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span>Sending...</span></div>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </Button>

                  <div className="text-center">
                    <button type="button" onClick={() => { setView('login'); setError(null); }} className="text-sm text-[#B8956C] hover:text-[#B8956C]/80 flex items-center gap-1 mx-auto">
                      <ArrowLeft className="w-4 h-4" /> Back to login
                    </button>
                  </div>
                </form>
              )}

              {view === 'reset-sent' && (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 mb-4">
                    <Mail className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-medium text-[hsl(var(--admin-text))] mb-2">Check Your Email</h2>
                  <p className="text-sm text-[hsl(var(--admin-text-subtle))] mb-6">
                    We've sent password reset instructions to <strong className="text-[hsl(var(--admin-text))]">{email}</strong>
                  </p>
                  <button type="button" onClick={() => { setView('login'); setError(null); }} className="text-sm text-[#B8956C] hover:text-[#B8956C]/80 flex items-center gap-1 mx-auto">
                    <ArrowLeft className="w-4 h-4" /> Back to login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Missing required role
  if (requireRole && !hasRequiredRole) {
    return (
      <div className="admin-theme min-h-screen bg-[hsl(var(--admin-bg))] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-medium text-[hsl(var(--admin-text))] mb-2">Access Denied</h1>
          <p className="text-[hsl(var(--admin-text-muted))] mb-6">
            You don't have the required permissions. Contact an administrator.
          </p>
          <button onClick={() => supabase.auth.signOut()} className="px-6 py-2 text-sm text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text))]">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
};

export default AdminRoute;
