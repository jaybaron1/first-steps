import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";

interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  details: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin-portal");
        return;
      }

      // Check if user has admin role
      const { data: hasAdminRole } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });

      if (!hasAdminRole) {
        toast.error("Access denied: Admin privileges required");
        navigate("/");
        return;
      }

      setAuthChecking(false);
      fetchLogs();
    };

    checkAuthAndFetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin-portal");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      setLogs(data as AuditLog[]);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionBadge = (action: string) => {
    const actionMap: Record<string, { variant: any; label: string }> = {
      login: { variant: "default", label: "Login" },
      logout: { variant: "secondary", label: "Logout" },
      role_grant: { variant: "default", label: "Role Granted" },
      role_revoke: { variant: "destructive", label: "Role Revoked" },
      "2fa_enabled": { variant: "default", label: "2FA Enabled" },
      "2fa_disabled": { variant: "destructive", label: "2FA Disabled" },
      admin_created: { variant: "default", label: "Admin Created" },
    };

    const config = actionMap[action] || { variant: "secondary", label: action };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (authChecking || loading) {
    return (
      <>
        <SEOHead 
          title="Audit Logs - Brandon Carl Coaching"
          description="View admin activity audit logs"
        />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container py-8">
            <div className="space-y-6">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-96" />
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Audit Logs - Brandon Carl Coaching"
        description="View and monitor all admin activity and security events"
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        <main className="flex-grow container py-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-grow">
                <h1 className="text-4xl font-bold mb-2">Audit Logs</h1>
                <p className="text-muted-foreground">
                  Monitor all admin actions and security events
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Activity History</CardTitle>
                </div>
                <CardDescription>
                  Complete record of admin actions with timestamps and details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No audit logs found</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>IP Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm">
                              {formatDate(log.created_at)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {log.user_email}
                            </TableCell>
                            <TableCell>
                              {getActionBadge(log.action)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-md">
                              {log.details ? (
                                <pre className="text-xs overflow-x-auto">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {log.ip_address || "Unknown"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    About Audit Logs
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All admin actions are automatically logged</li>
                    <li>• Logs include timestamps, user info, and IP addresses</li>
                    <li>• Showing the most recent 100 events</li>
                    <li>• Logs are retained for security and compliance purposes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
