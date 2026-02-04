import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, AlertTriangle, Activity, Globe, Trash2, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";

interface ActiveSession {
  id: string;
  user_email: string;
  ip_address: string;
  user_agent: string;
  last_activity: string;
  created_at: string;
}

interface FailedAttempt {
  id: string;
  email: string;
  ip_address: string;
  reason: string;
  attempted_at: string;
}

interface WhitelistEntry {
  id: string;
  ip_address: string;
  description: string;
  created_at: string;
  is_active: boolean;
}

export default function SecurityDashboardPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [failedAttempts, setFailedAttempts] = useState<FailedAttempt[]>([]);
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [newIP, setNewIP] = useState("");
  const [newIPDescription, setNewIPDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin-portal");
        return;
      }

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
      fetchSecurityData();
    };

    checkAuthAndFetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin-portal");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchSecurityData = async () => {
    try {
      // Fetch active sessions
      const { data: sessionsData } = await supabase
        .from("active_sessions")
        .select("*")
        .order("last_activity", { ascending: false });

      // Fetch failed login attempts (last 100)
      const { data: failedData } = await supabase
        .from("failed_login_attempts")
        .select("*")
        .order("attempted_at", { ascending: false })
        .limit(100);

      // Fetch IP whitelist
      const { data: whitelistData } = await supabase
        .from("ip_whitelist")
        .select("*")
        .order("created_at", { ascending: false });

      setSessions(sessionsData || []);
      setFailedAttempts(failedData || []);
      setWhitelist(whitelistData || []);
    } catch (error) {
      console.error("Error fetching security data:", error);
      toast.error("Failed to load security data");
    } finally {
      setLoading(false);
    }
  };

  const addIPToWhitelist = async () => {
    if (!newIP.trim()) {
      toast.error("Please enter an IP address");
      return;
    }

    // Validate IP address format
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    
    const trimmedIP = newIP.trim();
    let isValid = false;

    if (ipv4Regex.test(trimmedIP)) {
      // Validate IPv4 octets are 0-255
      const octets = trimmedIP.split('.');
      isValid = octets.every(octet => {
        const num = parseInt(octet, 10);
        return num >= 0 && num <= 255;
      });
    } else if (ipv6Regex.test(trimmedIP)) {
      isValid = true;
    }

    if (!isValid) {
      toast.error("Invalid IP address format. Please enter a valid IPv4 or IPv6 address.");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const { error } = await supabase
        .from("ip_whitelist")
        .insert({
          ip_address: trimmedIP,
          description: newIPDescription || null,
          added_by: session.user.id,
        });

      if (error) throw error;

      toast.success("IP address added to whitelist");
      setNewIP("");
      setNewIPDescription("");
      fetchSecurityData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add IP to whitelist");
    }
  };

  const removeFromWhitelist = async (id: string) => {
    if (!confirm("Are you sure you want to remove this IP from the whitelist?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("ip_whitelist")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("IP address removed from whitelist");
      fetchSecurityData();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove IP from whitelist");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (authChecking || loading) {
    return (
      <>
        <SEOHead 
          title="Security Dashboard - Brandon Carl Coaching"
          description="Monitor security events and manage access control"
        />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container py-8">
            <Skeleton className="h-96" />
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Security Dashboard - Brandon Carl Coaching"
        description="Monitor failed login attempts, active sessions, and manage IP whitelist"
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
                <h1 className="text-4xl font-bold mb-2">Security Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor security events and manage access control
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                  <p className="text-xs text-muted-foreground">Currently signed in</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed Attempts (24h)</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {failedAttempts.filter(a => 
                      new Date(a.attempted_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Whitelisted IPs</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {whitelist.filter(w => w.is_active).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Authorized addresses</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="sessions" className="space-y-4">
              <TabsList>
                <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
                <TabsTrigger value="failed">Failed Attempts</TabsTrigger>
                <TabsTrigger value="whitelist">IP Whitelist</TabsTrigger>
              </TabsList>

              <TabsContent value="sessions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <CardTitle>Active Admin Sessions</CardTitle>
                    </div>
                    <CardDescription>
                      Currently active administrator sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sessions.length === 0 ? (
                      <div className="text-center py-12">
                        <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No active sessions</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>IP Address</TableHead>
                              <TableHead>Last Activity</TableHead>
                              <TableHead>Session Started</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sessions.map((session) => (
                              <TableRow key={session.id}>
                                <TableCell className="font-medium">
                                  {session.user_email}
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                  {session.ip_address}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">
                                    {formatRelativeTime(session.last_activity)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(session.created_at)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="failed" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <CardTitle>Failed Login Attempts</CardTitle>
                    </div>
                    <CardDescription>
                      Recent unauthorized access attempts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {failedAttempts.length === 0 ? (
                      <div className="text-center py-12">
                        <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No failed attempts recorded</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Email</TableHead>
                              <TableHead>IP Address</TableHead>
                              <TableHead>Reason</TableHead>
                              <TableHead>Time</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {failedAttempts.slice(0, 20).map((attempt) => (
                              <TableRow key={attempt.id}>
                                <TableCell className="font-medium">
                                  {attempt.email}
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                  {attempt.ip_address}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="destructive">
                                    {attempt.reason || "Invalid credentials"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(attempt.attempted_at)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="whitelist" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <CardTitle>IP Whitelist Management</CardTitle>
                    </div>
                    <CardDescription>
                      Control which IP addresses can access the admin portal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-ip">IP Address</Label>
                        <Input
                          id="new-ip"
                          placeholder="192.168.1.1"
                          value={newIP}
                          onChange={(e) => setNewIP(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ip-description">Description (Optional)</Label>
                        <Input
                          id="ip-description"
                          placeholder="Home office, etc."
                          value={newIPDescription}
                          onChange={(e) => setNewIPDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={addIPToWhitelist} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add IP to Whitelist
                    </Button>

                    {whitelist.length === 0 ? (
                      <div className="text-center py-12">
                        <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">No IP addresses whitelisted</p>
                        <p className="text-sm text-muted-foreground">
                          When the whitelist is empty, all IPs are allowed
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>IP Address</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Added</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {whitelist.map((entry) => (
                              <TableRow key={entry.id}>
                                <TableCell className="font-mono font-medium">
                                  {entry.ip_address}
                                </TableCell>
                                <TableCell>
                                  {entry.description || "-"}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(entry.created_at)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromWhitelist(entry.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
