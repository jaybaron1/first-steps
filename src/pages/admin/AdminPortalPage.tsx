import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Shield, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Rate limiting configuration
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const ALLOWED_EMAIL_DOMAIN = '@galavanteer.com';

interface LoginAttempts {
  count: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

const AdminPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // View state
  const [view, setView] = useState<'login' | 'signup' | 'reset' | 'reset-sent'>('login');
  
  // Rate limiting state
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempts>(() => {
    const stored = sessionStorage.getItem('admin_login_attempts');
    if (stored) {
      return JSON.parse(stored);
    }
    return { count: 0, lastAttempt: 0, lockedUntil: null };
  });
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Verify email domain
        if (session.user.email?.endsWith(ALLOWED_EMAIL_DOMAIN)) {
          navigate('/admin');
        } else {
          // Sign out if not allowed domain
          await supabase.auth.signOut();
        }
      }
    };
    checkSession();
  }, [navigate]);

  // Update lockout timer
  useEffect(() => {
    if (loginAttempts.lockedUntil) {
      const interval = setInterval(() => {
        const remaining = loginAttempts.lockedUntil! - Date.now();
        if (remaining <= 0) {
          // Reset attempts after lockout
          const resetAttempts = { count: 0, lastAttempt: 0, lockedUntil: null };
          setLoginAttempts(resetAttempts);
          sessionStorage.setItem('admin_login_attempts', JSON.stringify(resetAttempts));
          setLockoutRemaining(0);
        } else {
          setLockoutRemaining(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loginAttempts.lockedUntil]);

  // Persist login attempts to session storage
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
      const lockedUntil = now + LOCKOUT_DURATION;
      setLoginAttempts({
        count: newCount,
        lastAttempt: now,
        lockedUntil,
      });
      setError(`Too many failed attempts. Account locked for 15 minutes.`);
    } else {
      setLoginAttempts({
        count: newCount,
        lastAttempt: now,
        lockedUntil: null,
      });
      setError(`Invalid credentials. ${MAX_ATTEMPTS - newCount} attempts remaining.`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLockedOut) {
      setError('Account is temporarily locked. Please try again later.');
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

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
        // Reset login attempts on success
        const resetAttempts = { count: 0, lastAttempt: 0, lockedUntil: null };
        setLoginAttempts(resetAttempts);
        sessionStorage.setItem('admin_login_attempts', JSON.stringify(resetAttempts));
        
        toast({
          title: 'Welcome back',
          description: 'Successfully signed in to Admin Portal',
        });
        
        navigate('/admin');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin-portal`,
        },
      });

      if (signupError) {
        if (signupError.message.includes('already registered')) {
          setError('This email is already registered. Please sign in.');
        } else {
          setError(signupError.message);
        }
        return;
      }

      if (data.user) {
        toast({
          title: 'Account created',
          description: 'Please check your email to verify your account.',
        });
        setView('login');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/admin-portal`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setView('reset-sent');
      toast({
        title: 'Check your email',
        description: 'Password reset instructions have been sent.',
      });
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Helmet>
        <title>Admin Portal | Galavanteer</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="bingbot" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-admin-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-admin-accent/3 rounded-full blur-3xl" />
        </div>

        {/* Login Card */}
        <div className="relative w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-admin-accent/10 border border-admin-border mb-4">
              <Shield className="w-8 h-8 text-admin-accent" />
            </div>
            <h1 className="text-2xl font-semibold text-admin-text mb-1">Admin Portal</h1>
            <p className="text-sm text-admin-text-subtle">Galavanteer Command Center</p>
          </div>

          {/* Card */}
          <div className="bg-admin-bg-elevated border border-admin-border-subtle rounded-2xl p-8 shadow-2xl">
            {view === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-admin-danger/10 border border-admin-danger/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-admin-danger shrink-0 mt-0.5" />
                    <p className="text-sm text-admin-danger">{error}</p>
                  </div>
                )}

                {/* Lockout Warning */}
                {isLockedOut && (
                  <div className="flex items-center gap-3 p-4 bg-admin-warning/10 border border-admin-warning/20 rounded-lg">
                    <Lock className="w-5 h-5 text-admin-warning shrink-0" />
                    <div>
                      <p className="text-sm text-admin-warning font-medium">Account Temporarily Locked</p>
                      <p className="text-xs text-admin-warning/70">
                        Try again in {formatTime(lockoutRemaining)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-admin-text-muted">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-subtle" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@galavanteer.com"
                      disabled={isLoading || isLockedOut}
                      className="pl-11 h-12 bg-admin-bg border-admin-border text-admin-text placeholder:text-admin-text-subtle focus:border-admin-accent/50 focus:ring-admin-accent/20"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm text-admin-text-muted">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setView('reset')}
                      className="text-xs text-admin-accent hover:text-admin-accent/80 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-subtle" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading || isLockedOut}
                      className="pl-11 pr-11 h-12 bg-admin-bg border-admin-border text-admin-text placeholder:text-admin-text-subtle focus:border-admin-accent/50 focus:ring-admin-accent/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-text-subtle hover:text-admin-text-muted"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || isLockedOut}
                  className="w-full h-12 bg-admin-accent hover:bg-admin-accent/90 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                {/* Signup Link */}
                <div className="text-center">
                  <p className="text-sm text-admin-text-subtle">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setView('signup');
                        setError(null);
                      }}
                      className="text-admin-accent hover:text-admin-accent/80 transition-colors"
                    >
                      Request access
                    </button>
                  </p>
                </div>

                {/* Security Notice */}
                <p className="text-center text-xs text-admin-text-subtle">
                  Access restricted to authorized personnel only.
                  <br />
                  All login attempts are logged.
                </p>
              </form>
            )}

            {view === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="text-center mb-2">
                  <h2 className="text-lg font-medium text-admin-text">Create Account</h2>
                  <p className="text-sm text-admin-text-subtle mt-1">
                    Only @galavanteer.com emails are allowed
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-admin-danger/10 border border-admin-danger/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-admin-danger shrink-0 mt-0.5" />
                    <p className="text-sm text-admin-danger">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm text-admin-text-muted">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-subtle" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@galavanteer.com"
                      disabled={isLoading}
                      className="pl-11 h-12 bg-admin-bg border-admin-border text-admin-text placeholder:text-admin-text-subtle focus:border-admin-accent/50 focus:ring-admin-accent/20"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm text-admin-text-muted">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-subtle" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      disabled={isLoading}
                      className="pl-11 pr-11 h-12 bg-admin-bg border-admin-border text-admin-text placeholder:text-admin-text-subtle focus:border-admin-accent/50 focus:ring-admin-accent/20"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-text-subtle hover:text-admin-text-muted"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm text-admin-text-muted">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-subtle" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                      className="pl-11 h-12 bg-admin-bg border-admin-border text-admin-text placeholder:text-admin-text-subtle focus:border-admin-accent/50 focus:ring-admin-accent/20"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gold hover:bg-gold-dark text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
                    </div>
                  )}
                </Button>

                {/* Back to Login */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setView('login');
                    setError(null);
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="w-full h-12 text-admin-text-muted hover:text-admin-text hover:bg-admin-bg-card"
                >
                  Back to Sign In
                </Button>
              </form>
            )}

            {view === 'reset' && (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div className="text-center mb-2">
                  <h2 className="text-lg font-medium text-admin-text">Reset Password</h2>
                  <p className="text-sm text-admin-text-subtle mt-1">
                    Enter your email to receive reset instructions
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-admin-danger/10 border border-admin-danger/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-admin-danger shrink-0 mt-0.5" />
                    <p className="text-sm text-admin-danger">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm text-admin-text-muted">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-text-subtle" />
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@galavanteer.com"
                      disabled={isLoading}
                      className="pl-11 h-12 bg-admin-bg border-admin-border text-admin-text placeholder:text-admin-text-subtle focus:border-admin-accent/50 focus:ring-admin-accent/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-admin-accent hover:bg-admin-accent/90 text-white font-medium rounded-lg"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setView('login');
                      setError(null);
                    }}
                    className="w-full h-12 text-admin-text-muted hover:text-admin-text hover:bg-admin-bg-card"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </form>
            )}

            {view === 'reset-sent' && (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-admin-accent/10 border border-admin-accent/20">
                  <Mail className="w-8 h-8 text-admin-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-admin-text">Check Your Email</h2>
                  <p className="text-sm text-admin-text-subtle mt-2">
                    We've sent password reset instructions to{' '}
                    <span className="text-admin-text-muted">{email}</span>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setView('login');
                    setError(null);
                    setEmail('');
                  }}
                  className="w-full h-12 text-admin-text-muted hover:text-admin-text hover:bg-admin-bg-card"
                >
                  Back to Sign In
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-admin-text-subtle mt-6">
            © {new Date().getFullYear()} Galavanteer. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminPortalPage;
