import React from "react";
import { useNavigate } from "react-router-dom";
import { usePartners } from "@/hooks/usePartnersCRM";
import { setGhostPartnerId } from "@/lib/partnerGhost";
import { Eye } from "lucide-react";

/**
 * Admin-only quick picker shown in the partners sidebar so an admin can
 * ghost into any partner from anywhere in the CRM without first navigating
 * to the directory.
 */
const GhostPartnerPicker: React.FC = () => {
  const { data: partners = [] } = usePartners();
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    setGhostPartnerId(id);
    navigate("/partners/me");
  };

  return (
    <div className="px-3 pb-3">
      <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 mb-1 px-1">
        <Eye className="w-3 h-3" />
        View as partner
      </label>
      <select
        value=""
        onChange={onChange}
        className="w-full h-8 text-xs px-2 border border-slate-200 rounded-md bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400"
      >
        <option value="">Select partner…</option>
        {partners.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GhostPartnerPicker;
