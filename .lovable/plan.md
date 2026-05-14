# QR-to-CRM lead capture flow

Today the QR code on every flyer points to `/r/:slug`, which either renders the partner's white-label landing page or silently redirects home with a `?ref=` tag. There is no dedicated funnel for someone who scans a flyer in the wild and wants to be contacted, so referred prospects rarely make it into the partner's CRM list.

This plan adds a short, branded capture form that the QR opens directly, and wires submissions into `partner_clients` so the referring partner sees a new lead waiting for follow-up.

## What changes for the user

1. **New capture page** at `/r/:slug/connect` — a one-screen form: name, email, phone, optional note. Headline reads "Referred by {Partner Name}" with their photo/accent color. Single primary CTA: "Request an introduction".
2. **QR codes on all 3 flyer templates** now encode the `/r/:slug/connect` URL instead of `/r/:slug`. Existing partner landing pages still work via the old route.
3. **On submit** → success screen ("We'll be in touch — {Partner} has been notified") and the prospect lands in the partner's CRM as a new client with status `prospect` and referral source attached.
4. **Partner sees the lead** in `/partners/clients` (their existing CRM list) within seconds, tagged as `self_identified` referral, source = the capture form.

## Technical implementation

### Database (one migration)
- Attach the existing `auto_create_partner_client_from_lead()` function as an `AFTER INSERT` trigger on `public.leads`. The function already exists and de-dupes by email per partner — it is just not wired up.

### New page: `src/pages/PartnerReferralCapture.tsx`
- Route: `/r/:slug/connect` (added in `src/App.tsx`, public).
- Loads the partner via `trackingSupabase` (`name`, `landing_photo_url`, `landing_accent_color`, `landing_headline`).
- Calls `setReferralPartner(partner.id)` and logs a `partner_referral_clicks` row with `slug_used` so QR scans stay attributed.
- Form (zod-validated): `name` (required, ≤100), `email` (required, valid, ≤255), `phone` (optional, ≤40), `message` (optional, ≤1000).
- On submit → `INSERT` into `leads` with `referred_by_partner_id`, `referral_session_id`, `source = 'partner_qr'`, `name/email/phone/message`. RLS already permits anon inserts.
- The new trigger then creates the `partner_clients` row for the partner's owner (SDR) automatically.
- Show success state with partner name; no redirect.

### Flyer QR update
- In `src/lib/partnerFlyer.ts` add `buildReferralCaptureUrl(slug)` returning `${PARTNER_REFERRAL_BASE}/${slug}/connect`.
- Update the three flyer templates (`FlyerRoundtableIntro`, `FlyerFounderOffer`, `FlyerEventInvite`) and `PartnersMarketingPage` preview to call `buildReferralCaptureUrl` when generating the QR data URL. The visible printed URL on the flyer can stay as the short `/r/:slug` form (cleaner to read) while the QR encodes the `/connect` variant.

### Files
- **New**: `src/pages/PartnerReferralCapture.tsx`
- **Modified**: `src/App.tsx` (route), `src/lib/partnerFlyer.ts` (helper), `src/pages/partners/PartnersMarketingPage.tsx`, `src/components/partners/marketing/Flyer*.tsx` (QR source URL)
- **Migration**: attach `auto_create_partner_client_from_lead` trigger to `leads`

## Out of scope
- Email/SMS notification to the partner when a new lead drops in (can layer on after — Resend is already configured).
- Editing the capture form copy per partner (uses partner name + accent only for v1).
