import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [keepAliveLogs, setKeepAliveLogs] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }
      
      const { data } = await supabase
        .from('keep_alive_logs')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(10);
      
      if (data) setKeepAliveLogs(data);
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Dashboard | Galavanteer</title>
      </Helmet>
      <Header />
      <main id="main-content" className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-8 text-ink">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Keep-Alive Pings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{keepAliveLogs.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Keep-Alive Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {keepAliveLogs.length > 0 ? (
              <div className="space-y-2">
                {keepAliveLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className={`font-medium ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {log.status}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.executed_at).toLocaleString()}
                    </span>
                    {log.response_time_ms && (
                      <span className="text-sm text-muted-foreground">{log.response_time_ms}ms</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No logs yet. The cron job runs every 5 minutes.</p>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;