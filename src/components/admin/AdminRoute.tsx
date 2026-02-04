import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { Session, User } from '@supabase/supabase-js';
import { Shield, Loader2 } from 'lucide-react';

const ALLOWED_EMAIL_DOMAIN = '@galavanteer.com';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity

interface AdminRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'moderator' | 'user';
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, requireRole }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [hasRequiredRole, setHasRequiredRole] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Check session and validate user
  useEffect(() => {
    let mounted = true;

    const validateSession = async () => {
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (!currentSession?.user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Validate email domain
        const userEmail = currentSession.user.email || '';
        if (!userEmail.endsWith(ALLOWED_EMAIL_DOMAIN)) {
          // Sign out unauthorized user
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setSession(currentSession);
        setUser(currentSession.user);
        setIsAuthenticated(true);

        // Check role if required
        if (requireRole && currentSession.user.id) {
          const { data: hasRole } = await supabase.rpc('has_role', {
            _user_id: currentSession.user.id,
            _role: requireRole,
          });
          
          if (mounted) {
            setHasRequiredRole(!!hasRole);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Session validation error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    validateSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !newSession) {
        setIsAuthenticated(false);
        setSession(null);
        setUser(null);
      } else if (newSession?.user) {
        // Validate domain on auth change
        const email = newSession.user.email || '';
        if (email.endsWith(ALLOWED_EMAIL_DOMAIN)) {
          setSession(newSession);
          setUser(newSession.user);
          setIsAuthenticated(true);
        } else {
          // Sign out if domain not allowed
          setTimeout(() => {
            supabase.auth.signOut();
          }, 0);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [requireRole]);

  // Session timeout tracking
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const checkTimeout = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > SESSION_TIMEOUT) {
        supabase.auth.signOut();
      }
    }, 60000); // Check every minute

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      clearInterval(checkTimeout);
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [isAuthenticated, lastActivity]);

  // Loading state
  if (isLoading) {
    return (
      <div className="admin-theme min-h-screen bg-[hsl(var(--admin-bg))] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#B8956C]/10 border border-[hsl(var(--admin-border))] mb-4">
            <Shield className="w-8 h-8 text-[#B8956C]" />
          </div>
          <div className="flex items-center gap-2 text-[hsl(var(--admin-text-muted))]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying access...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin-portal" state={{ from: location }} replace />;
  }

  // Missing required role
  if (requireRole && !hasRequiredRole) {
    return (
      <div className="admin-theme min-h-screen bg-[hsl(var(--admin-bg))] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-medium text-[hsl(var(--admin-text))] mb-2">Access Denied</h1>
          <p className="text-[hsl(var(--admin-text-muted))] mb-6">
            You don't have the required permissions to access this area.
            Contact an administrator if you believe this is an error.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-6 py-2 text-sm text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text))] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
};

export default AdminRoute;
