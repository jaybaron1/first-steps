import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Copy, Check, Loader2, ArrowLeft } from "lucide-react";
import QRCode from "react-qr-code";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function TwoFactorSetupPage() {
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verifyToken, setVerifyToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [hasExisting2FA, setHasExisting2FA] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkExisting2FA();
  }, []);

  const checkExisting2FA = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin-portal");
        return;
      }

      const { data, error } = await supabase
        .from("mfa_secrets")
        .select("enabled")
        .eq("user_id", session.user.id)
        .eq("enabled", true)
        .single();

      if (data) {
        setHasExisting2FA(true);
      }
    } catch (error) {
      console.error("Error checking 2FA:", error);
    }
  };

  const generate2FA = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/setup-2fa`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: "generate" }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate 2FA");
      }

      setQrCodeUrl(data.qrCodeUrl);
      // Secret is no longer exposed by the API for security
      setSecret("");
      setBackupCodes(data.backupCodes);
      toast.success("2FA setup initiated. Scan the QR code with your authenticator app.");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate 2FA");
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async () => {
    if (!verifyToken || verifyToken.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/setup-2fa`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: "verify", token: verifyToken }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.valid) {
        throw new Error(data.error || "Invalid code");
      }

      toast.success("2FA enabled successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const disable2FA = async () => {
    if (!confirm("Are you sure you want to disable 2FA? This will reduce your account security.")) {
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/setup-2fa`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: "disable" }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to disable 2FA");
      }

      toast.success("2FA disabled successfully");
      setHasExisting2FA(false);
      setQrCodeUrl("");
      setSecret("");
      setBackupCodes([]);
    } catch (error: any) {
      toast.error(error.message || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: "secret" | "codes") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "secret") {
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      } else {
        setCopiedCodes(true);
        setTimeout(() => setCopiedCodes(false), 2000);
      }
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <>
      <SEOHead 
        title="Two-Factor Authentication Setup - Brandon Carl Coaching"
        description="Set up two-factor authentication for enhanced account security"
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        <main className="flex-grow container py-8 max-w-4xl">
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Two-Factor Authentication</h1>
              <p className="text-muted-foreground">
                Add an extra layer of security to your admin account
              </p>
            </div>
          </div>

          {hasExisting2FA && !qrCodeUrl ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  2FA is Enabled
                </CardTitle>
                <CardDescription>
                  Your account is protected with two-factor authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Two-factor authentication adds an extra layer of security by requiring a code from your authenticator app when you sign in.
                  </AlertDescription>
                </Alert>
                <Button variant="destructive" onClick={disable2FA} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Disable 2FA
                </Button>
              </CardContent>
            </Card>
          ) : !qrCodeUrl ? (
            <Card>
              <CardHeader>
                <CardTitle>Enable Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Protect your admin account with TOTP-based 2FA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    You'll need an authenticator app like Google Authenticator, Authy, or 1Password to use 2FA.
                  </AlertDescription>
                </Alert>
                <Button onClick={generate2FA} disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Set Up 2FA
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Scan QR Code</CardTitle>
                  <CardDescription>
                    Use your authenticator app to scan this QR code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <QRCode value={qrCodeUrl} size={200} />
                  </div>
                  
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      If you can't scan the QR code, you can manually add it in your authenticator app by scanning the QR code above. The secret key is securely stored and cannot be retrieved for security reasons.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Save Backup Codes</CardTitle>
                  <CardDescription>
                    Store these codes in a safe place. Each can only be used once.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
                    {backupCodes.map((code, index) => (
                      <Badge key={index} variant="secondary" className="font-mono justify-center py-2">
                        {code}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(backupCodes.join("\n"), "codes")}
                    className="w-full"
                  >
                    {copiedCodes ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    Copy All Backup Codes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 3: Verify Setup</CardTitle>
                  <CardDescription>
                    Enter the 6-digit code from your authenticator app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verify-code">Verification Code</Label>
                    <Input
                      id="verify-code"
                      placeholder="000000"
                      maxLength={6}
                      value={verifyToken}
                      onChange={(e) => setVerifyToken(e.target.value.replace(/\D/g, ""))}
                      className="text-center text-2xl font-mono tracking-widest"
                    />
                  </div>
                  <Button 
                    onClick={verify2FA} 
                    disabled={isVerifying || verifyToken.length !== 6}
                    className="w-full"
                  >
                    {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify and Enable 2FA
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
