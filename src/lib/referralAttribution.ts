/**
 * Referral attribution helpers.
 * - gv_ref cookie (first-party, "forever until overwritten") stores partner_id
 * - localStorage fallback in case cookies are stripped
 */
const COOKIE = "gv_ref";
const LS_KEY = "gv_ref";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export const setReferralPartner = (partnerId: string) => {
  try {
    const host = window.location.hostname;
    // Set on apex domain so it survives subdomain hops
    const domainAttr =
      host.endsWith("galavanteer.com") ? "; domain=.galavanteer.com" : "";
    document.cookie = `${COOKIE}=${partnerId}; path=/; max-age=${TEN_YEARS}; SameSite=Lax${domainAttr}`;
    localStorage.setItem(LS_KEY, partnerId);
  } catch {
    /* no-op */
  }
};

export const getReferralPartner = (): string | null => {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
    if (m) return decodeURIComponent(m[1]);
    return localStorage.getItem(LS_KEY);
  } catch {
    return null;
  }
};

export const clearReferralPartner = () => {
  try {
    document.cookie = `${COOKIE}=; path=/; max-age=0`;
    localStorage.removeItem(LS_KEY);
  } catch {
    /* no-op */
  }
};
