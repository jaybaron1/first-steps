import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";

const PortalLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<"login" | "reset" | "reset-sent">("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/portal", { replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    toast({ title: "Welcome back" });
    navigate("/portal", { replace: true });
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/portal/login` },
    );
    setSubmitting(false);
    if (err) setError(err.message);
    else setView("reset-sent");
  };

  return (
    <>
      <Helmet>
        <title>Partner Portal | Galavanteer</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 mb-4">
              <span className="text-white font-serif text-lg">G</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Partner Portal</h1>
            <p className="text-sm text-slate-500 mt-1">Track your referrals & commissions</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            {view === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11 border-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label className="text-xs text-slate-600">Password</Label>
                    <button
                      type="button"
                      onClick={() => setView("reset")}
                      className="text-xs text-slate-500 hover:text-slate-900"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-11 border-slate-200"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>
            )}

            {view === "reset" && (
              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <h2 className="text-base font-medium text-slate-900">Reset password</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    We'll email you a link to set a new one.
                  </p>
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-slate-200"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setView("login")}
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
                <p className="text-sm text-slate-500">Sent to {email}.</p>
                <Button variant="outline" onClick={() => setView("login")} className="w-full h-11">
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

export default PortalLoginPage;
