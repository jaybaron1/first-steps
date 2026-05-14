## Marketing assets for partners

A new page in the partners sidebar where partners (and admins ghosting in) can pick from 3 flyer templates, personalize them with their name, photo/logo, headline, tagline, accent color, and personal referral link/QR code, then download a print-ready PDF one-pager.

### What gets built

**1. New route + sidebar entry**
- Route: `/partners/marketing` (component: `PartnersMarketingPage.tsx`)
- Add "Marketing assets" item to `PartnersLayout` sidebar with a `FileDown` icon, visible to both `partner` and `admin` effective roles.
- Works in admin ghost mode automatically (uses the same `usePartnersAuth` context).

**2. Three flyer templates**
Each template is a React component that renders an A4 one-pager (210 × 297 mm) in a hidden div, then exported to PDF. Templates share the same brandable fields but differ visually:

```text
┌─ Roundtable Intro ────┐  ┌─ Founder Offer ───────┐  ┌─ Event Invite ────────┐
│  Editorial / serif    │  │  Bold / dark hero     │  │  Minimal / lots of    │
│  Photo top-right      │  │  Big stat callout     │  │  whitespace, QR-led   │
│  3 bullets + quote    │  │  Single CTA + bullets │  │  Date placeholder     │
│  QR + URL bottom      │  │  QR right-aligned     │  │  QR centered hero     │
└───────────────────────┘  └───────────────────────┘  └───────────────────────┘
```

**3. Personalization panel (left side of page)**
Form bound to local state, pre-filled from the partner's `partners` row:
- Name (from `partners.name`)
- Photo/logo (uses `landing_photo_url` or `landing_logo_url`; partner can override with a fresh upload to a new `partner-marketing` storage bucket)
- Headline (default: "An invitation to The Roundtable")
- Tagline / sub-copy (default per template)
- Accent color (color picker, default `#B8956C` Roundtable gold or partner's `landing_accent_color`)
- Referral URL is auto-built from `partners.slug` → `https://galavanteer.lovable.app/r/{slug}`. QR code generated from this URL.

**4. Live preview (right side of page)**
- Tabs to switch between the 3 templates.
- Renders the selected template at scaled-down size (e.g. 60%) with the current personalization applied in real time.
- "Download PDF" button on each template.

**5. PDF generation**
- Client-side using `html2canvas` + `jsPDF` (no server cost, no edge function needed).
- QR code generated with `qrcode` library.
- Filename: `roundtable-{template}-{partner-slug}.pdf`.

### Technical details

**Files to create**
- `src/pages/partners/PartnersMarketingPage.tsx` — page shell, form, preview tabs, download trigger
- `src/components/partners/marketing/FlyerRoundtableIntro.tsx`
- `src/components/partners/marketing/FlyerFounderOffer.tsx`
- `src/components/partners/marketing/FlyerEventInvite.tsx`
- `src/components/partners/marketing/FlyerFrame.tsx` — shared A4 wrapper with print-safe sizing
- `src/lib/partnerFlyer.ts` — `exportFlyerToPdf(elementId, filename)` helper using html2canvas + jsPDF

**Files to edit**
- `src/App.tsx` — register `/partners/marketing` route inside the `PartnersRoute` guard
- `src/components/partners/PartnersLayout.tsx` — add sidebar nav item
- A new memory file `mem://features/partners-marketing` summarizing this feature

**Dependencies to add**
- `html2canvas`
- `jspdf`
- `qrcode` (+ `@types/qrcode`)

**Storage (optional, for custom uploads)**
- New public `partner-marketing` bucket with RLS:
  - Partners can upload to their own folder (`{partner_id}/...`)
  - Public read so the image can be embedded in the PDF render
- If we want to ship faster, v1 can skip uploads and only use the existing `landing_photo_url` / `landing_logo_url`. Recommended: ship v1 without uploads, add later.

**No new tables.** All personalization is ephemeral (per-download). Defaults come from `partners` row. If we later want to remember tweaked headlines, we can add a `partner_marketing_overrides` table.

### Out of scope (for now)
- Saving custom headline/tagline back to the partner profile
- PNG/social-image variants
- Email-template downloads, decks, etc. (sidebar section is named generically so we can add later)
- White-label mode (no Roundtable branding) — can be added by checking `partners.is_white_label`