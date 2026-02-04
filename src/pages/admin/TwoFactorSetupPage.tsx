import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key } from 'lucide-react';

const TwoFactorSetupPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verifying code:', code);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>2FA Setup | Galavanteer</title>
      </Helmet>
      <Header />
      <main id="main-content" className="flex-1 container py-12 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Setup Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Two-factor authentication adds an extra layer of security to your account.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-2">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full">
                Verify & Enable 2FA
              </Button>
            </form>
            
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate('/security')}
            >
              Back to Security
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TwoFactorSetupPage;