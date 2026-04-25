import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

const PartnersLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<"login" | "reset" | "reset-sent">("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already signed in, bounce to dashboard
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session) {
        const dest = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
        navigate(dest && dest.startsWith("/partners") ? dest : "/partners", { replace: true });
      }
    });
    return () => {
      mounted = false;
    };
  }, [location.state, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) {
        setError(signInError.message || "Invalid credentials");
        return;
      }
      toast({ title: "Welcome back", description: "Signed in successfully." });
      navigate("/partners", { replace: true });
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/partners/login` },
      );
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setView("reset-sent");
    } catch {
      setError("Failed to send reset email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Partners CRM | Galavanteer</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>

      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 mb-4">
              <span className="text-white font-serif text-lg tracking-tight">G</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Galavanteer Partners
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Internal referral & commission tracking
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            {view === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-slate-600">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      disabled={submitting}
                      required
                      className="pl-10 h-11 border-slate-200 focus-visible:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-slate-600">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        setView("reset");
                        setError(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-900"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={submitting}
                      required
                      className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <p className="text-center text-[11px] text-slate-400 pt-2">
                  Authorized personnel only · Activity is logged
                </p>
              </form>
            )}

            {view === "reset" && (
              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <h2 className="text-base font-medium text-slate-900">Reset password</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your email and we'll send reset instructions.
                  </p>
                </div>
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="reset-email" className="text-xs font-medium text-slate-600">
                    Email
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitting}
                    className="h-11 border-slate-200 focus-visible:ring-slate-900"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setView("login");
                      setError(null);
                    }}
                    className="flex-1 h-11"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-11 bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
                  </Button>
                </div>
              </form>
            )}

            {view === "reset-sent" && (
              <div className="text-center space-y-4">
                <h2 className="text-base font-medium text-slate-900">Check your inbox</h2>
                <p className="text-sm text-slate-500">
                  We sent reset instructions to <strong className="text-slate-900">{email}</strong>.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setView("login")}
                  className="w-full h-11"
                >
                  Back to sign in
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnersLoginPage;
