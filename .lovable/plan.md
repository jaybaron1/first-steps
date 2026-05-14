# Partner Referral Links, QR Codes & Partner Portal

Give Margarita (and every future partner) a clean URL like `galavanteer.com/r/margarita`, a downloadable QR code, sticky attribution that survives across sessions, and a private dashboard where she can see her own clicks → leads → clients.

---

## 1. Database changes (one migration)

**Extend `partners` table:**
- `slug` (text, unique, lowercase, url-safe) — e.g. `margarita`
- `qr_logo_url` (text, nullable) — optional logo to embed in QR center
- `portal_user_id` (uuid, nullable) — links to an auth.users row when partner has login
- `website` (text, nullable) — e.g. `https://margaritaxistris.com`
- `is_white_label` (bool) — true for Margarita; flags her as a "personality in her own boardroom"

**New table `partner_referral_clicks`:**
- `partner_id`, `slug_used`, `session_id`, `landing_url`, `referrer`, `ip_hash`, `user_agent`, `created_at`
- RLS: admins all; partners can SELECT only `WHERE partner_id = (SELECT id FROM partners WHERE portal_user_id = auth.uid())`

**New `app_role` enum value: `'partner'`** (read-only role, separate from `sdr`)

**New table `pending_referrals`** (optional review queue not used here since you chose auto-create, but kept as a `referral_source` column on `leads` and `partner_clients`):
- Add `referred_by_partner_id` (uuid) and `referral_session_id` (text) to: `leads`, `partner_clients`

**Trigger `auto_create_partner_client_from_lead`:** when a row is inserted into `leads` with `referred_by_partner_id IS NOT NULL`, automatically insert a matching `partner_clients` row (`attribution_status = 'pending'`, `owner_id = partner.owner_id`) and pgnotify for the email function.

---

## 2. Routing & attribution capture

**New route `/r/:slug`** (`src/pages/ReferralRedirect.tsx`):
1. Look up partner by slug.
2. Insert a row into `partner_referral_clicks`.
3. Write **first-party cookie** `gv_ref={partner_id}` with `max-age=10 years` (your "forever until overwritten" choice — a new `/r/:slug` click overwrites it).
4. Also stash in `localStorage` as a belt-and-suspenders backup.
5. Append `?ref=<slug>` and redirect to `/` (or to `?to=/pricing` if a destination param is passed — useful for campaign links).

**Global attribution hook** (extend `src/lib/visitorTracking.ts`):
- On every page load, read `gv_ref` cookie → attach `referred_by_partner_id` to the current visitor session.
- When `ChatDiscovery`, lead form, free trial, or Calendly submission fires, include that partner_id in the payload.

**Edge function changes:**
- `notify-lead`: if `referred_by_partner_id` present, also email the partner (template: "A new lead came in from your link — we'll keep you posted.").
- `notify-lead`: BCC you on the partner email so you have a record.

---

## 3. QR codes

- Add `qrcode` npm package.
- Admin → Partners → click partner → **"Shareables" tab** with:
  - Full URL (copy button)
  - QR preview (PNG)
  - Download as PNG (1024px) and SVG (vector for print)
  - "Email these to partner" button (Resend, uses your existing `notify-*` pattern)

QR encodes the canonical published URL (`https://galavanteer.com/r/<slug>`), not the preview.

---

## 4. Partner login portal

**New role:** `partner` (added to `app_role` enum). Partners can log in with email + Google but only see `/portal/*`.

**New routes (`src/pages/portal/`):**
- `/portal/login` — same auth pattern as `/partners/login`, but redirects to `/portal`
- `/portal` — dashboard:
  - Headline: clicks (last 30 / all-time), leads, clients won, MRR they're attributed to
  - Their referral link + QR (downloadable)
  - Recent activity feed (anonymized: "New lead — Acme Corp · 2 days ago", no contact details)
  - Commission summary (uses existing `commercial_events`, filtered by their partner_id)

**Privacy guardrails:**
- Partners never see lead email/phone, only company + first name.
- RLS: every portal query is scoped to `partners.portal_user_id = auth.uid()`.

**Margarita's "white-label personality" flag:**
- `is_white_label = true` shows an extra panel: "Your Boardroom Persona" — placeholder for now, with a note that you'll wire it up when her persona is built. This keeps the data model ready without scope creep.

---

## 5. Admin additions

- Partners list gets a **slug column** + "Generate slug" button (auto-slugifies the name).
- Each partner card gets: live click count, conversion rate, "Send portal invite" button (creates auth user, assigns `partner` role, links `portal_user_id`, emails magic link via Resend).
- New `/admin/partners/:id/shareables` page (link, QR PNG/SVG, embed snippet for partner's own site: `<a href="https://galavanteer.com/r/margarita">Book with Galavanteer</a>`).

---

## 6. For Margarita specifically (one-time setup after build)

1. Open Partners → Margarita Xistris → set slug `margarita`, website `https://margaritaxistris.com`, toggle `is_white_label`.
2. Click **Send portal invite** → she gets a magic-link email.
3. Click **Email shareables** → she gets her link + QR (PNG for digital, SVG for print).
4. She can drop the link on her site, in her email signature, in printed materials.

---

## Technical notes

- Cookie is first-party (`Domain=.galavanteer.com`, `SameSite=Lax`) so it survives subdomain hops and form posts. Not a third-party tracker — no consent banner change needed.
- "Forever until overwritten" = last-touch attribution at the click level. If a visitor clicks Margarita's link in 2026 then John's link in 2027, John gets credit going forward. This matches your existing `detect_attribution_dispute` trigger on manual referrals.
- Partner role is read-only by RLS, not by UI guard — even if they hit the API directly, they can't see other partners' data.
- All new tables get the standard `touch_updated_at` trigger and admin RLS.

---

## Files to create / modify

**New:**
- `src/pages/ReferralRedirect.tsx`
- `src/pages/portal/PortalLayout.tsx`, `PortalLoginPage.tsx`, `PortalDashboardPage.tsx`
- `src/components/admin/PartnerShareables.tsx`
- `src/hooks/usePartnerPortal.ts`
- `supabase/functions/send-partner-invite/index.ts`
- `supabase/functions/email-shareables/index.ts`
- One migration

**Modified:**
- `src/App.tsx` (new routes)
- `src/lib/visitorTracking.ts` (read `gv_ref` cookie)
- `src/components/ChatDiscovery.tsx`, `SessionRequestForm.tsx`, `FreeTrialModal.tsx` (attach partner_id)
- `supabase/functions/notify-lead/index.ts` (email partner too)
- `src/pages/partners/PartnersDirectoryPage.tsx` (slug column, shareables button)

Approve and I'll build it in one pass.
