import { supabase } from "@/integrations/supabase/client";

interface AuditLogParams {
  action: string;
  details?: Record<string, any>;
  userEmail?: string;
}

export const useAuditLog = () => {
  const logAction = async ({ action, details, userEmail }: AuditLogParams) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No session for audit logging");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/audit-log`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action, details, userEmail }),
        }
      );

      if (!response.ok) {
        console.error("Failed to log audit action:", await response.text());
      }
    } catch (error) {
      console.error("Error logging audit action:", error);
    }
  };

  return { logAction };
};
