// Display + formatting helpers for the Partners CRM

export const productLevelLabels: Record<string, string> = {
  level_1_base_boardroom: "L1 · Base Boardroom",
  level_2_integrated_company_knowledge: "L2 · Integrated Company Knowledge",
  level_3_present_persona: "L3 · Present Persona",
  level_4_future_persona: "L4 · Future Persona",
};

export const referralTypeLabels: Record<string, string> = {
  direct_introduction: "Direct Introduction",
  self_identified: "Self-Identified Referral",
};

export const attributionStatusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  disputed: "Disputed",
  rejected: "Rejected",
};

export const clientLifecycleLabels: Record<string, string> = {
  prospect: "Prospect",
  active: "Active",
  inactive: "Inactive",
  reactivated: "Reactivated",
  churned: "Churned",
};

export const configurationLabels: Record<string, string> = {
  standard: "Standard",
  co_branded: "Co-Branded",
};

export const partnerStatusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  expired: "Expired",
  terminated: "Terminated",
};

export const eventTypeLabels: Record<string, string> = {
  build_fee: "Build Fee",
  upgrade: "Upgrade",
  persona_addition: "Persona Addition",
  light_reactivation: "Light Reactivation",
  refresh: "Refresh",
  rebuild: "Rebuild",
};

export const paymentStatusLabels: Record<string, string> = {
  not_due: "Not Due",
  due: "Due",
  paid: "Paid",
  disputed: "Disputed",
};

export const formatCurrency = (n: number | null | undefined) => {
  if (n == null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n));
};

export const formatDate = (d: string | null | undefined) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const downloadCSV = (filename: string, rows: Record<string, unknown>[]) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v == null) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
