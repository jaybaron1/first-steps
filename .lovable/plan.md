## Sales Sheet — Visual redesign + Letter sizing + Margarita inclusion

A focused redesign of the Sales Sheet flyer only. The other three flyers (Intro, Founder, Event) and the on-page reference section are out of scope for this pass.

### 1. Page size — switch to US Letter (8.5 × 11)

Today the flyer frame is A4 (794 × 1123 px). The Sales Sheet will render in a **Letter-sized variant** (816 × 1056 px @ 96 DPI) so it prints cleanly on standard US paper and matches the user's request.

Approach: introduce an optional `size="letter" | "a4"` prop on `FlyerFrame` and pass `letter` from `FlyerSalesSheet`. The PDF exporter (`exportFlyerToPdf`) will key off the same dimensions so the output PDF is true 8.5 × 11. Other flyers stay A4.

### 2. Add Margarita as an included persona

New element on the Sales Sheet: a small "**Included in your boardroom**" callout introducing **Margarita** as a named, included persona that ships with every workspace — positioned as a signature inclusion (the partner gets her access for their client by default). Treated as a featured chip/card with her name, one-line role, and a short value line. Placement: directly under "What you actually get", above the level ladder, so it visually anchors the offer.

Copy direction (will refine in build):
- Label: "Included in your boardroom"
- Name: **Margarita**
- Role line: e.g. "Editorial conscience & narrative strategist" (will confirm exact role line during build from existing Roundtable copy)
- Value line: one sentence on what she brings to a session

### 3. Visual redesign — premium $6K feel

The current sheet reads like a one-color document. The redesign will lift it to feel commensurate with a $6,000 product without becoming flashy. Direction:

- **Editorial masthead** — top band in deep ink (`#0F172A`) with the Roundtable wordmark in Playfair Display, partner attribution in fine letter-spaced caps, accent hairline underneath. Brand image floats on the right.
- **Typographic hierarchy** — Playfair Display for headings (already loaded), Inter for body. Larger headline, generous leading, classic editorial column rhythm.
- **Two-column body** — left column carries the narrative ("What it is", "What you actually get" pillars); right column carries the structured offer (Margarita callout, level ladder, investment box). Better information density without feeling cramped.
- **Margarita callout** — bordered card with a small monogram mark "M" in accent color, her name in Playfair, role line, value line. Distinct enough to feel like a perk, restrained enough to feel premium.
- **Level ladder refinement** — keep the 1→4 ladder but redesign as a vertical rail with numbered medallions (circle, accent border, Playfair numeral), tier name + body, price right-aligned. Level 1 marked **Included** in a small pill. Subtle hairline rail connecting the medallions.
- **Investment block** — split into two clear rows: "Workspace build · $6,000" hero number on the left, "Not included" line items in a refined table on the right. Hairline borders, no heavy fill.
- **Footer** — keep referral URL + QR, but in a quieter, more editorial layout. Add a small "Galavanteer · The Roundtable" mark on the opposite side.
- **Color discipline** — ink (`#0F172A`), paper (`#FFFFFF`), warm gold accent (partner-controlled, default `#B8956C`), neutral slate text. No grey-on-grey blocks.

Final layout sketch:

```text
┌──────────────────────────────────────────────────────────┐
│  [INK MASTHEAD]                                          │
│  PRESENTED BY {partner}      THE ROUNDTABLE     [photo]  │
│  ───── accent hairline ─────                              │
├──────────────────────────────────────────────────────────┤
│  WHAT IT IS                                              │
│  {large editorial tagline, two-line max}                 │
├──────────────────────────────────────────────────────────┤
│  WHAT YOU ACTUALLY GET     │  INCLUDED IN YOUR BOARDROOM │
│  • pillar 1                │  ┌──────────────────────┐  │
│  • pillar 2                │  │  M    Margarita       │  │
│  • pillar 3                │  │       {role}          │  │
│  • pillar 4                │  │       {value line}    │  │
│                            │  └──────────────────────┘  │
│                            │                             │
│                            │  HOW DEEP YOU GO            │
│                            │  ① Roundtable    Included   │
│                            │  ② Company Ctx   $— / req   │
│                            │  ③ You in Room   $— / req   │
│                            │  ④ Future You    $— / req   │
├──────────────────────────────────────────────────────────┤
│  INVESTMENT · WORKSPACE BUILD                            │
│  $6,000        Not included — billed separately          │
│                ChatGPT Teams       $50/mo                │
│                Each add'l user     $100/mo               │
│                Maintenance         $200/mo               │
├──────────────────────────────────────────────────────────┤
│  REQUEST ACCESS                                  [QR]    │
│  galavanteer.com/r/{slug}                                │
│  Galavanteer · The Roundtable                            │
└──────────────────────────────────────────────────────────┘
```

### Files affected

- `src/components/partners/marketing/FlyerFrame.tsx` — add optional `size` prop (Letter vs A4).
- `src/components/partners/marketing/FlyerSalesSheet.tsx` — full redesign per above; render at Letter; add Margarita callout.
- `src/lib/partnerFlyer.ts` — make PDF export honor the rendered element's actual size (so Letter exports as Letter); no hard-coded A4 if currently present.
- `src/pages/partners/PartnersMarketingPage.tsx` — adjust the preview frame dimensions when the Sales Sheet template is selected (so the scaled preview matches Letter).

### Out of scope

- Other three flyers (Intro, Founder, Event) keep their current A4 design.
- The on-page `SalesMaterialReference` reference block is unchanged in this pass.
- No DB / schema / pricing-logic changes. Margarita is a static included persona on the asset, not a data model.

### One open detail

I'll write the Margarita role + value lines in build using existing Roundtable persona copy as the source of truth. If you have a preferred one-liner for her role/value, share it and I'll use it verbatim — otherwise I'll draft to match the existing voice and you can tweak.