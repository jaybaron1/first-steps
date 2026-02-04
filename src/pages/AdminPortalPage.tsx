import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuditLog } from "@/hooks/useAuditLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const RATE_LIMIT_KEY = "admin_login_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface LoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

export default function AdminPortalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [ipBlocked, setIpBlocked] = useState(false);
  const [currentIP, setCurrentIP] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { logAction } = useAuditLog();

  useEffect(() => {
    // Check IP whitelist first
    checkIPWhitelist();

    // Check rate limiting status
    checkRateLimit();

    // Check for password recovery token
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');

    if (type === 'recovery') {
      setShowPasswordReset(true);
      setCheckingAuth(false);
      return;
    }

    // Check if already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && !showPasswordReset) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkIPWhitelist = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-ip-whitelist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setCurrentIP(data.ip || "Unknown");

      if (!data.allowed && data.reason !== "whitelist_not_configured") {
        setIpBlocked(true);
        toast.error(data.message || "Your IP address is not authorized");
      }
    } catch (error) {
      console.error("Failed to check IP whitelist:", error);
    }
  };

  const checkRateLimit = () => {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) return;

    const attempt: LoginAttempt = JSON.parse(stored);
    
    if (attempt.lockedUntil && attempt.lockedUntil > Date.now()) {
      setIsLocked(true);
      setLockoutTime(attempt.lockedUntil);
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLockoutTime(null);
        localStorage.removeItem(RATE_LIMIT_KEY);
      }, attempt.lockedUntil - Date.now());
      
      return () => clearTimeout(timer);
    }
  };

  const recordFailedAttempt = () => {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    const attempt: LoginAttempt = stored 
      ? JSON.parse(stored) 
      : { count: 0, lastAttempt: Date.now() };

    attempt.count += 1;
    attempt.lastAttempt = Date.now();

    if (attempt.count >= MAX_ATTEMPTS) {
      attempt.lockedUntil = Date.now() + LOCKOUT_DURATION;
      setIsLocked(true);
      setLockoutTime(attempt.lockedUntil);
      toast.error(`Too many failed attempts. Account locked for 15 minutes.`);
    }

    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(attempt));
  };

  const resetAttempts = () => {
    localStorage.removeItem(RATE_LIMIT_KEY);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (!email.endsWith("@galavanteer.com")) {
      toast.error("Access restricted to @galavanteer.com email addresses");
      return false;
    }
    
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ipBlocked) {
      toast.error("Access denied from your IP address");
      return;
    }

    if (isLocked) {
      const remainingTime = lockoutTime ? Math.ceil((lockoutTime - Date.now()) / 60000) : 0;
      toast.error(`Account locked. Try again in ${remainingTime} minute(s).`);
      return;
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          recordFailedAttempt();
          
          // Log failed attempt to database
          await supabase.from("failed_login_attempts").insert({
            email,
            ip_address: currentIP,
            user_agent: navigator.userAgent,
            reason: error.message,
          });

          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else if (data.user) {
          // Check if user has 2FA enabled
          const { data: mfaData } = await supabase
            .from("mfa_secrets")
            .select("enabled")
            .eq("user_id", data.user.id)
            .eq("enabled", true)
            .single();

          if (mfaData) {
            // 2FA is enabled, prompt for code
            setRequires2FA(true);
            setUserId(data.user.id);
            toast.info("Please enter your 2FA code");
          } else {
            // No 2FA, proceed to dashboard
            resetAttempts();
            logAction({ action: "login", userEmail: email });
            toast.success("Signed in successfully");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
        } else {
          // Send notification email for new admin signup
          if (data.user && email.endsWith("@galavanteer.com")) {
            try {
              await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-admin-signup`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                  newAdminEmail: email,
                  signupTime: new Date().toISOString()
                }),
              });
            } catch (notifyError) {
              console.error("Failed to send notification:", notifyError);
              // Don't block signup if notification fails
            }
          }
          toast.success("Account created successfully");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const verify2FACode = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-2fa-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            token: twoFactorCode,
          }),
        }
      );

      const data = await response.json();

      if (!data.valid) {
        recordFailedAttempt();
        toast.error("Invalid 2FA code");
      } else {
        resetAttempts();
        logAction({ action: "login", details: { "2fa": true } });
        toast.success("2FA verified successfully");
        // The onAuthStateChange will handle navigation
      }
    } catch (error: any) {
      toast.error("Failed to verify 2FA code");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(resetEmail)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
        setShowForgotPassword(false);
        setResetEmail("");
      }
    } catch (error) {
      toast.error("Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully! You can now sign in.");
        setShowPasswordReset(false);
        setNewPassword("");
        setConfirmPassword("");
        // Clear the hash from URL
        window.location.hash = '';
      }
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = () => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      toast.success("Development bypass activated");
      navigate("/dashboard");
    } else {
      toast.error("Development bypass only available on localhost");
    }
  };

  if (ipBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              Your IP address is not authorized to access this admin portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm font-mono">{currentIP}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact the system administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {showPasswordReset
              ? "Set New Password"
              : showForgotPassword
                ? "Reset Password"
                : requires2FA
                  ? "Two-Factor Authentication"
                  : isLogin
                    ? "Admin Sign In"
                    : "Admin Sign Up"}
          </CardTitle>
          <CardDescription>
            {showPasswordReset
              ? "Enter your new password"
              : showForgotPassword
                ? "Enter your email to receive a password reset link"
                : requires2FA
                  ? "Enter the 6-digit code from your authenticator app"
                  : isLogin
                    ? "Sign in to access the dashboard"
                    : "Create an admin account with your @galavanteer.com email"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showPasswordReset ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <Button
                onClick={handlePasswordUpdate}
                className="w-full"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </div>
          ) : showForgotPassword ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@galavanteer.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleForgotPassword}
                className="w-full"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                }}
                disabled={loading}
              >
                Back to Sign In
              </Button>
            </div>
          ) : requires2FA ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="2fa-code">Authentication Code</Label>
                <Input
                  id="2fa-code"
                  placeholder="000000"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                  disabled={loading}
                  className="text-center text-2xl font-mono tracking-widest"
                  autoFocus
                />
                <p className="text-sm text-muted-foreground">
                  You can also use a backup code if you don't have access to your authenticator app.
                </p>
              </div>
              <Button 
                onClick={verify2FACode} 
                className="w-full" 
                disabled={loading || twoFactorCode.length !== 6 && twoFactorCode.length !== 8}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Code
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setRequires2FA(false);
                  setTwoFactorCode("");
                  setUserId(null);
                  supabase.auth.signOut();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@galavanteer.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
            {isLogin && (
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => {
                  setShowForgotPassword(true);
                  setResetEmail(email);
                }}
                disabled={loading}
              >
                Forgot Password?
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Button>
            {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
              <div className="pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleDevBypass}
                  disabled={loading}
                >
                  🔧 Dev Bypass (Localhost Only)
                </Button>
              </div>
            )}
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
