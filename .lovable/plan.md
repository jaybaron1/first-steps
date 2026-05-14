&nbsp;

&nbsp;

# White-Label Partner Landing Pages

## The problem you spotted

Today `/r/margarita` sets the attribution cookie, then **redirects to your homepage**. Margarita's referrals land on a page that's 100% your offer, with zero signal that she's the reason they're there — or that she's part of what they get.

## The fix

Stop redirecting white-label partners. Instead, `/r/margarita` **renders a co-branded landing page** that frames the offer as *hers*, with you as the engine behind it. Attribution still gets set silently in the background.

Non-white-label partners (regular SDRs / affiliates) keep the silent redirect behavior — they're just earning commission, not selling their persona.

## What Margarita's page looks like

```text
┌─────────────────────────────────────────────┐
│  [Margarita's logo / photo]                 │
│                                             │
│  Work with Margarita Xistris               │
│  + your own private boardroom of advisors   │
│                                             │
│  [Her positioning copy — editable]          │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  What you get when you work with me: │   │
│  │  • A seat at my table                │   │
│  │  • Your own AI Roundtable, built     │   │
│  │    on the Galavanteer engine         │   │
│  │  • [her custom bullets]              │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  [Start a conversation] ──► ChatDiscovery   │
│                              (pre-tagged)   │
│                                             │
│  Powered by Galavanteer  ·  small footer    │
└─────────────────────────────────────────────┘
```

Key points:

- **Her name, her face, her copy** above the fold
- **One CTA** → opens ChatDiscovery (the lead is auto-tagged to her)
- **"Powered by Galavanteer"** — small, honest, doesn't compete with her brand
- **No top nav** to your other pages — this is *her* funnel, not a tour of your site

## How the toggle works

In the admin Partners directory, each partner has `is_white_label`:

- `**is_white_label = true**` (Margarita): `/r/:slug` renders the landing page
- `**is_white_label = false**` (SDRs like John): `/r/:slug` does the silent redirect → homepage, just like today

## What Margarita can edit herself

In her **partner portal** (`/portal`), add a "My Landing Page" tab where she controls:

- Headline + subheadline
- Her photo / logo URL
- Her bio paragraph
- Her custom bullet list ("what working with me means")
- Optional testimonial quote
- Optional accent color

You see a live preview + can override anything from `/admin/partners/:id`.

## Technical changes

**Database (one migration):**

- Add to `partners`: `landing_headline`, `landing_subheadline`, `landing_bio`, `landing_bullets jsonb`, `landing_photo_url`, `landing_logo_url`, `landing_testimonial`, `landing_accent_color`, `landing_published bool default false`

**Routing:**

- Modify `src/pages/ReferralRedirect.tsx`: after looking up the partner, branch on `is_white_label && landing_published`:
  - `true` → render new `<PartnerLandingPage partner={partner} />` (still sets cookie + logs click)
  - `false` → existing redirect behavior

**New components:**

- `src/pages/PartnerLandingPage.tsx` — the co-branded page
- `src/components/portal/LandingPageEditor.tsx` — Margarita's editor in `/portal`
- `src/components/admin/PartnerLandingEditor.tsx` — admin override view

**Modified:**

- `src/pages/ReferralRedirect.tsx` — branch logic
- `src/pages/portal/PortalDashboardPage.tsx` — add "My Landing Page" tab
- `src/components/ChatDiscovery.tsx` — when opened from a partner landing page, prepend "Hi, I was referred by {partner.name}" to give the lead context

**No changes** to attribution, cookie logic, click logging, auto-create-client trigger, or commission flow — all of that already works.

## What this gives you

- Margarita can sell her site as **her** site, not "a referral link to Doug"
- Her conversion rate goes up because the page matches what she pitched
- You stay in control: the editor is bounded (no arbitrary HTML), the engine + checkout + chatbot are all yours
- One toggle (`is_white_label`) cleanly separates "personality partners" from "commission-only SDRs"

## Out of scope (ask if you want them)

- Custom subdomain (`margarita.galavanteer.com`) — still works as `/r/margarita` for now
- Multiple landing-page templates per partner
- A/B testing partner landing pages

Extra:

Add a “Send portal invite” button in the partner directory so I can emailc Margarita and other partners their portal login link.