## Goal

For `/r/:slug` white-label landing pages:
1. Show `?ref=<slug>` in the address bar so the URL is visible and shareable
2. Propagate `?ref=<slug>` on every internal CTA so attribution survives cookie blockers

## Changes

### 1. `src/pages/ReferralRedirect.tsx`
In the white-label branch, before `setLanding(partner)`, update the URL in place:

```ts
if (partner.is_white_label && partner.landing_published) {
  const refSlug = partner.slug || slug;
  window.history.replaceState(null, "", `${window.location.pathname}?ref=${encodeURIComponent(refSlug)}`);
  setLanding(partner);
  return;
}
```

No navigation, no remount — just a visible URL update.

### 2. `src/pages/PartnerLandingPage.tsx`
Propagate `?ref=<slug>` on all internal CTAs:

- Accept the slug (already on `partner.slug`) and build `refQuery = "?ref=" + encodeURIComponent(partner.slug)`.
- Update `openChat()` — currently just clicks the floating chat button. Add a fallback that, if no chat button is found, navigates to `/${refQuery}` instead of just scrolling. The chat button itself stays in place; the cookie + the URL param both carry attribution forward when ChatDiscovery submits.
- Any anchor that points to a Galavanteer page (e.g. footer "Powered by Galavanteer" link to `https://galavanteer.com`) gets the `?ref=` appended.
- Partner's external `website` link is left alone (it's their own site, not ours).

### What stays unchanged

- `setReferralPartner` cookie write — still the primary attribution mechanism.
- `partner_referral_clicks` insert — still fires on every `/r/:slug` hit.
- `ChatDiscovery` — already reads the cookie via `getReferralPartner()`, so leads continue to be attributed correctly even without the URL param.
- No DB / RLS / routing config changes.

## Files touched

- `src/pages/ReferralRedirect.tsx`
- `src/pages/PartnerLandingPage.tsx`