import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, FileText, Settings } from 'lucide-react';

const AdminPortalPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const adminLinks = [
    { title: 'Dashboard', href: '/dashboard', icon: Settings, description: 'View system overview' },
    { title: 'Security', href: '/security', icon: Shield, description: 'Security settings & 2FA' },
    { title: 'Users', href: '/admin-users', icon: Users, description: 'Manage user accounts' },
    { title: 'Audit Logs', href: '/audit-logs', icon: FileText, description: 'View activity logs' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin Portal | Galavanteer</title>
      </Helmet>
      <Header />
      <main id="main-content" className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-8 text-ink">Admin Portal</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminLinks.map((link) => (
            <Card key={link.href} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(link.href)}>
              <CardHeader className="flex flex-row items-center gap-3">
                <link.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">{link.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{link.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPortalPage;