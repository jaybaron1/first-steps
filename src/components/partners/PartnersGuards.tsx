import React from "react";
import { Navigate } from "react-router-dom";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";

/**
 * Restricts a route to admin/sdr users. Partners get redirected to /partners/me.
 */
export const RequireStaff: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isStaff } = usePartnersAuth();
  if (!isStaff) return <Navigate to="/partners/me" replace />;
  return <>{children}</>;
};

/**
 * Restricts a route to partner-role users. Staff get redirected to /partners.
 */
export const RequirePartner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isPartner } = usePartnersAuth();
  if (!isPartner) return <Navigate to="/partners" replace />;
  return <>{children}</>;
};
