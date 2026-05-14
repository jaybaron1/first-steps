# Collapse `/portal` into `/partners`

## Why

`/partners` already has auth, layout, sidebar, and a sign-in page. Running a second auth surface at `/portal` for one user (Margarita) doubles the maintenance and confuses anyone who has to support either. One door, role-aware behind it.

## How it works after this change

**One login URL: `/partners/login**` — used by admins, SDRs, *and* external partners (Margarita and future white-labels).

After sign-in, `PartnersRoute` checks roles in this order and routes accordingly:

```text
admin   → full CRM (everything you have today)
sdr     → full CRM minus admin-only items
partner → restricted view: their own dashboard only
```

A user with the `partner` role lands on `/partners` and sees a stripped-down sidebar:

- **Dashboard** — clicks, clients, commission earned (their data only)
- **My Landing Page** — the editor (only if `is_white_label = true`)
- **My Referral Link** — link + QR + downloads
- *Sign out*

They cannot see: other partners, the directory, team users, add-referral, appointments, activity feed, or anyone else's commissions. RLS already enforces this server-side; the UI just hides the irrelevant nav.

## What gets deleted vs. moved

**Deleted:**

- `src/pages/portal/PortalLoginPage.tsx`
- `src/pages/portal/PortalDashboardPage.tsx`
- `src/components/portal/PortalRoute.tsx`
- `/portal/*` routes from `App.tsx`

**Moved into `/partners`:**

- The dashboard content (stats + clients + commission ledger + referral link + QR) → new `src/pages/partners/PartnersMyPage.tsx`, mounted at `/partners/me`
- The landing-page editor → new page at `/partners/landing` (white-label partners only)
- Existing `LandingPageEditor.tsx` component stays as-is (just imported from the new page)

**Keep:**

- `/r/:slug` (referral redirect + landing page) — unchanged
- The `partner-portal-invite` edge function — still creates auth users, just redirects to `/partners/login` instead of `/portal/login`

## Routing rules inside `/partners`

`PartnersRoute` extends to recognize three roles instead of two. Behavior:


| Role    | Default landing | Sidebar items                                         |
| ------- | --------------- | ----------------------------------------------------- |
| admin   | `/partners`     | All current items + Team users                        |
| sdr     | `/partners`     | All current items except Team users                   |
| partner | `/partners/me`  | Dashboard, My Landing Page (if white-label), Sign out |


If a `partner`-role user navigates to `/partners/clients`, `/partners/directory`, etc., they get redirected to `/partners/me`. This is belt-and-suspenders — RLS would already return empty data — but it keeps the experience clean.

## What the partner sees on `/partners/me`

Same content as the current `/portal` dashboard, just rendered inside the existing `PartnersLayout` sidebar:

- 4 stat cards (clicks 30d, clicks all, clients, commission)
- Their referral link + QR + copy button
- Downloadable branded assets
- Recent clients table (their data only)
- Commission ledger (their data only)
- "My Landing Page" link (white-label only) → `/partners/landing`

## Migration touchpoints

1. `**PartnersRoute.tsx**` — `resolveRole()` adds a third branch checking the `partner` role; context type widens to `"admin" | "sdr" | "partner"`; also resolves `partnerId / partnerSlug / isWhiteLabel` when role is `partner`.
2. `**PartnersLayout.tsx**` — nav items get a `partnerOnly` / `partnerHidden` flag; whole sidebar filters by role.
3. `**App.tsx**` — remove `/portal/*` routes and `import PortalRoute…`; add `/partners/me` and `/partners/landing` inside the existing `<PartnersRoute>` block.
4. `**partner-portal-invite/index.ts**` — change the magic-link redirect from `/portal` to `/partners/me`.
5. **Email copy** in the invite — point to `/partners/login`.
6. `**PortalRoute` consumers** — none outside `/portal`, so safe to delete.

## What stays the same for you

- Margarita's `/r/margarita` URL, QR code, and cookie attribution: unchanged
- Auto-create-client trigger, commission rules, RLS policies: unchanged
- Your day-to-day at `/partners`: visually identical (same sidebar, same pages)

## Out of scope

- Renaming "Partners CRM" in the sidebar header for partner-role users (low priority cosmetic)
- Custom subdomains
- Multi-user partner accounts (one auth user per partner row, as today)