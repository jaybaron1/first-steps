import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Shield, Users, UserMinus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
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
      fetchAdmins();
    };

    checkAuthAndFetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin-portal");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchAdmins = async () => {
    try {
      // Get all users with admin role
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (rolesError) throw rolesError;

      if (!adminRoles || adminRoles.length === 0) {
        setAdmins([]);
        setLoading(false);
        return;
      }

      const adminUserIds = adminRoles.map(r => r.user_id);

      // Get profiles for admin users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", adminUserIds)
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Map to AdminUser interface
      const adminUsers: AdminUser[] = profiles.map(profile => ({
        id: profile.user_id,
        email: profile.email,
        created_at: profile.created_at,
        last_sign_in_at: null, // We'll need to get this from auth metadata if needed
      }));

      setAdmins(adminUsers);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const revokeAdminAccess = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke admin access for ${email}?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-user-role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            targetUserId: userId,
            targetUserEmail: email,
            action: "revoke",
            role: "admin",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to revoke admin access");
      }

      toast.success(`Admin access revoked for ${email}`);
      fetchAdmins(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke admin access");
    } finally {
      setActionLoading(null);
    }
  };

  if (authChecking || loading) {
    return (
      <>
        <SEOHead 
          title="Admin Users Management - Brandon Carl Coaching"
          description="Manage admin users and access"
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
        title="Admin Users Management - Brandon Carl Coaching"
        description="View and manage admin users with access to the dashboard"
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
                <h1 className="text-4xl font-bold mb-2">Admin Users</h1>
                <p className="text-muted-foreground">
                  View all administrators with access to the dashboard
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Registered Administrators</CardTitle>
                </div>
                <CardDescription>
                  Users with @galavanteer.com email addresses automatically receive admin privileges
                </CardDescription>
              </CardHeader>
              <CardContent>
                {admins.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No admin users found</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Account Created</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {admins.map((admin) => (
                          <TableRow key={admin.id}>
                            <TableCell className="font-medium">
                              {admin.email}
                            </TableCell>
                            <TableCell>
                              {formatDate(admin.created_at)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => revokeAdminAccess(admin.id, admin.email)}
                                disabled={actionLoading === admin.id}
                                className="text-destructive hover:text-destructive"
                              >
                                <UserMinus className="h-4 w-4 mr-1" />
                                Revoke Access
                              </Button>
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
                    Security Information
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Only @galavanteer.com email addresses can create admin accounts</li>
                    <li>• Admin status is automatically assigned upon signup</li>
                    <li>• Email notifications are sent when new admins register</li>
                    <li>• Login attempts are rate-limited (5 attempts per 15 minutes)</li>
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
