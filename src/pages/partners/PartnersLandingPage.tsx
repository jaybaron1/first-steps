import React from "react";
import { Navigate } from "react-router-dom";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import LandingPageEditor from "@/components/portal/LandingPageEditor";

const PartnersLandingPage: React.FC = () => {
  const { partnerId, partnerSlug, isWhiteLabel } = usePartnersAuth();

  if (!partnerId || !isWhiteLabel) {
    return <Navigate to="/partners/me" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          My landing page
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize what people see when they visit your referral link.
        </p>
      </div>
      <LandingPageEditor partnerId={partnerId} partnerSlug={partnerSlug} />
    </div>
  );
};

export default PartnersLandingPage;
