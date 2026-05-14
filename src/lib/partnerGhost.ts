// Admin "ghost into partner" helper. Stored per-tab in sessionStorage so
// admins can view the portal as a specific partner without affecting their
// real session or other tabs.

const KEY = "partners_ghost_partner_id";

export const getGhostPartnerId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const setGhostPartnerId = (id: string) => {
  try {
    window.sessionStorage.setItem(KEY, id);
    window.dispatchEvent(new Event("partners-ghost-change"));
  } catch {
    /* ignore */
  }
};

export const clearGhostPartnerId = () => {
  try {
    window.sessionStorage.removeItem(KEY);
    window.dispatchEvent(new Event("partners-ghost-change"));
  } catch {
    /* ignore */
  }
};
