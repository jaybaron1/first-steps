import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useAuditLog } from '@/hooks/useAuditLog';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Gauge, Eye, Zap, AlertCircle, Users, FileText, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface AuditData {
  id: string;
  created_at: string;
  url: string;
  performance_score: number;
  seo_score: number;
  accessibility_score: number;
  best_practices_score: number;
  pwa_score: number;
  largest_contentful_paint: number;
  first_input_delay: number;
  cumulative_layout_shift: number;
  first_contentful_paint: number;
  time_to_interactive: number;
  total_blocking_time: number;
  speed_index: number;
}

const DashboardPage = () => {
  const [audits, setAudits] = useState<AuditData[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestAudit, setLatestAudit] = useState<AuditData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();
  const { logAction } = useAuditLog();
  const { showWarning, timeRemaining } = useSessionTimeout();

  useEffect(() => {
    // Check authentication and admin role
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin-portal");
        return;
      }

      setUser(session.user);

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

      setIsAdmin(true);
      setAuthChecking(false);
      fetchAudits();
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin-portal");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchAudits = async () => {
    try {
      const { data, error } = await supabase
        .from('lighthouse_audits')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        setAudits(data as AuditData[]);
        setLatestAudit(data[data.length - 1] as AuditData);
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number | null): "default" | "secondary" | "destructive" | "outline" => {
    if (!score) return 'secondary';
    if (score >= 90) return 'default';
    if (score >= 50) return 'secondary';
    return 'destructive';
  };

  const chartData = audits.map(audit => ({
    date: new Date(audit.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    performance: audit.performance_score,
    seo: audit.seo_score,
    accessibility: audit.accessibility_score,
    bestPractices: audit.best_practices_score,
    lcp: audit.largest_contentful_paint ? (audit.largest_contentful_paint / 1000).toFixed(2) : null,
    cls: audit.cumulative_layout_shift,
    fcp: audit.first_contentful_paint ? (audit.first_contentful_paint / 1000).toFixed(2) : null,
    tti: audit.time_to_interactive ? (audit.time_to_interactive / 1000).toFixed(2) : null,
  }));

  const handleSignOut = async () => {
    await logAction({ action: "logout" });
    await supabase.auth.signOut();
    navigate("/admin-portal");
  };

  if (authChecking || loading) {
    return (
      <>
        <SEOHead 
          title="Performance Dashboard - Brandon Carl Coaching"
          description="View Lighthouse performance audit history and trends"
        />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container py-8">
            <div className="space-y-6">
              <Skeleton className="h-12 w-64" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-96" />
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!latestAudit || audits.length === 0) {
    return (
      <>
        <SEOHead 
          title="Performance Dashboard - Brandon Carl Coaching"
          description="View Lighthouse performance audit history and trends"
        />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container py-8">
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Audit Data Available</h2>
              <p className="text-muted-foreground">
                Lighthouse audits will appear here once they run. The first audit will run on the next scheduled time.
              </p>
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
        title="Performance Dashboard - Brandon Carl Coaching"
        description="View Lighthouse performance audit history and trends for Core Web Vitals, SEO scores, and accessibility metrics"
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
        <Header />
        <main className="flex-grow container py-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">Performance Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor your website's Lighthouse audit history and performance trends
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/security")}
                  className="gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Security
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/2fa-setup")}
                  className="gap-2"
                >
                  <Shield className="h-4 w-4" />
                  2FA
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/admin-users")}
                  className="gap-2"
                >
                  <Users className="h-4 w-4" />
                  Users
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/audit-logs")}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Logs
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Latest Scores Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(latestAudit.performance_score)}`}>
                    {latestAudit.performance_score?.toFixed(0) || 'N/A'}
                  </div>
                  <Badge variant={getScoreBadgeVariant(latestAudit.performance_score)} className="mt-2">
                    {latestAudit.performance_score >= 90 ? 'Good' : latestAudit.performance_score >= 50 ? 'Needs Improvement' : 'Poor'}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SEO</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(latestAudit.seo_score)}`}>
                    {latestAudit.seo_score?.toFixed(0) || 'N/A'}
                  </div>
                  <Badge variant={getScoreBadgeVariant(latestAudit.seo_score)} className="mt-2">
                    {latestAudit.seo_score >= 90 ? 'Good' : latestAudit.seo_score >= 50 ? 'Needs Improvement' : 'Poor'}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accessibility</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(latestAudit.accessibility_score)}`}>
                    {latestAudit.accessibility_score?.toFixed(0) || 'N/A'}
                  </div>
                  <Badge variant={getScoreBadgeVariant(latestAudit.accessibility_score)} className="mt-2">
                    {latestAudit.accessibility_score >= 90 ? 'Good' : latestAudit.accessibility_score >= 50 ? 'Needs Improvement' : 'Poor'}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Practices</CardTitle>
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(latestAudit.best_practices_score)}`}>
                    {latestAudit.best_practices_score?.toFixed(0) || 'N/A'}
                  </div>
                  <Badge variant={getScoreBadgeVariant(latestAudit.best_practices_score)} className="mt-2">
                    {latestAudit.best_practices_score >= 90 ? 'Good' : latestAudit.best_practices_score >= 50 ? 'Needs Improvement' : 'Poor'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="scores" className="space-y-4">
              <TabsList>
                <TabsTrigger value="scores">Lighthouse Scores</TabsTrigger>
                <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
              </TabsList>

              <TabsContent value="scores" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>
                      Track your Lighthouse scores over time (0-100 scale)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="performance" 
                          stroke="hsl(var(--primary))" 
                          name="Performance"
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="seo" 
                          stroke="hsl(142, 76%, 36%)" 
                          name="SEO"
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="accessibility" 
                          stroke="hsl(221, 83%, 53%)" 
                          name="Accessibility"
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="bestPractices" 
                          stroke="hsl(280, 80%, 50%)" 
                          name="Best Practices"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vitals" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Largest Contentful Paint (LCP)</CardTitle>
                      <CardDescription>
                        Measures loading performance (target: under 2.5s)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="lcp" 
                            stroke="hsl(var(--primary))" 
                            fill="hsl(var(--primary) / 0.2)"
                            name="LCP (seconds)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cumulative Layout Shift (CLS)</CardTitle>
                      <CardDescription>
                        Measures visual stability (target: under 0.1)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="cls" 
                            stroke="hsl(142, 76%, 36%)" 
                            fill="hsl(142, 76%, 36%, 0.2)"
                            name="CLS"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>First Contentful Paint (FCP)</CardTitle>
                      <CardDescription>
                        Time until first content appears (target: under 1.8s)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="fcp" 
                            stroke="hsl(221, 83%, 53%)" 
                            fill="hsl(221, 83%, 53%, 0.2)"
                            name="FCP (seconds)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Time to Interactive (TTI)</CardTitle>
                      <CardDescription>
                        Time until page is fully interactive (target: under 3.8s)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="tti" 
                            stroke="hsl(280, 80%, 50%)" 
                            fill="hsl(280, 80%, 50%, 0.2)"
                            name="TTI (seconds)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Latest Audit Info */}
            <Card>
              <CardHeader>
                <CardTitle>Latest Audit Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">URL Tested</dt>
                    <dd className="text-sm mt-1">{latestAudit.url}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Run</dt>
                    <dd className="text-sm mt-1">
                      {new Date(latestAudit.created_at).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Total Audits</dt>
                    <dd className="text-sm mt-1">{audits.length}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">PWA Score</dt>
                    <dd className="text-sm mt-1">{latestAudit.pwa_score?.toFixed(0) || 'N/A'}/100</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DashboardPage;