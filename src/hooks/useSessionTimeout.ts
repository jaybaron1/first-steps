import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const WARNING_DURATION = 5 * 60 * 1000; // 5 minutes before timeout
const CHECK_INTERVAL = 60 * 1000; // Check every minute

export const useSessionTimeout = () => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const lastActivityRef = useRef(Date.now());
  const warningToastId = useRef<string | number>();
  const navigate = useNavigate();

  // Update last activity on user interaction
  const updateActivity = async () => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);

    if (warningToastId.current) {
      toast.dismiss(warningToastId.current);
      warningToastId.current = undefined;
    }

    // Update session in database
    if (sessionToken) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-session`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ 
                action: "update", 
                sessionToken 
              }),
            }
          );
        }
      } catch (error) {
        console.error("Failed to update session:", error);
      }
    }
  };

  // Create session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-session`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ action: "create" }),
            }
          );

          const data = await response.json();
          if (data.sessionToken) {
            setSessionToken(data.sessionToken);
            localStorage.setItem("admin_session_token", data.sessionToken);
          }
        }
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    };

    const storedToken = localStorage.getItem("admin_session_token");
    if (storedToken) {
      setSessionToken(storedToken);
    } else {
      createSession();
    }

    // Listen for user activity
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // Check session timeout
  useEffect(() => {
    const checkTimeout = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivityRef.current;
      const remaining = TIMEOUT_DURATION - timeSinceActivity;

      setTimeRemaining(Math.max(0, Math.floor(remaining / 1000)));

      // Show warning 5 minutes before timeout
      if (remaining > 0 && remaining <= WARNING_DURATION && !showWarning) {
        setShowWarning(true);
        const minutes = Math.ceil(remaining / 60000);
        warningToastId.current = toast.warning(
          `Your session will expire in ${minutes} minute(s) due to inactivity. Click anywhere to stay signed in.`,
          {
            duration: Infinity,
            action: {
              label: "Stay Signed In",
              onClick: updateActivity,
            },
          }
        );
      }

      // Timeout expired
      if (remaining <= 0) {
        handleTimeout();
      }
    };

    const interval = setInterval(checkTimeout, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [showWarning, sessionToken]);

  const handleTimeout = async () => {
    if (warningToastId.current) {
      toast.dismiss(warningToastId.current);
    }

    // Terminate session
    if (sessionToken) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-session`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ 
                action: "terminate", 
                sessionToken 
              }),
            }
          );
        }
      } catch (error) {
        console.error("Failed to terminate session:", error);
      }
    }

    localStorage.removeItem("admin_session_token");
    await supabase.auth.signOut();
    toast.error("Session expired due to inactivity");
    navigate("/admin-portal");
  };

  const extendSession = () => {
    updateActivity();
  };

  return {
    showWarning,
    timeRemaining,
    extendSession,
  };
};
