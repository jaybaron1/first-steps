## Partner Flyers v2 — Editorial system inspired by Margarita's deck

A full visual rebuild of all four partner flyers using the design language of Margarita's partner deck: cream paper, navy serif headlines, gold accent, italic body, letter-spaced caps, hairline rules, generous whitespace. Plus an optional "your partner sits in your room" toggle, refined investment block, and the new $500/persona add-on.

### 1. Shared visual system (one source of truth)

A new `flyerTheme.ts` module exports the palette and typography used across all four flyers, so the family is consistent.

**Palette (proposed — final pick is your call below)**

```text
Direction A — "Margarita Cream" (matches her deck verbatim)
  paper      #F5EFE0   warm cream
  ink        #1F3A5F   deep navy
  accent     #B8956C   warm gold (already brand)
  body       #4A4536   soft umber for italic body
  hairline   #D9CFB8

Direction B — "Editorial Ivory" (slightly cooler, more modern)
  paper      #F8F4EC
  ink        #14213D   sharper navy
  accent     #C9A765   brighter gold
  body       #3A3A3A
  hairline   #E5DDC8

Direction C — "Manuscript" (warmer, more luxurious)
  paper      #EFE7D5
  ink        #2A1810   espresso brown
  accent     #B8956C   warm gold
  body       #4A3F2E
  hairline   #D4C7A8
```

I'll generate one preview rendering of the Sales Sheet in each direction so you can pick visually before I commit. (Direction A is my recommendation — it matches her deck and works against the existing brand gold #B8956C.)

**Typography**
- Headlines: Playfair Display (already loaded), 500–600 weight, tight letter-spacing
- Italic accent: Playfair Display Italic, in gold for the second half of split headlines (e.g. "Start simple. *Go deeper when ready.*")
- Body: Inter, italic for the editorial passages, regular for structured data
- Caps labels: Inter, 9–10pt, 0.24em tracking, gold

**Shared chrome**
- Top hairline rule in gold (4px band)
- "FROM GALAVANTEER" or "PRESENTED BY {partner}" in tracked caps, top-right
- Footer: `{Partner} · In partnership with Galavanteer` left, page mark right
- Bottom hairline rule

### 2. Flyer-by-flyer rebuild (all four → cream/editorial)

All four become 8.5 × 11 (Letter), since you noted it earlier and Letter is what partners actually print.

**A. Roundtable Intro** — split title ("An invitation to *The Roundtable*."), italic editorial tagline, three numbered bullets in the deck's "01 Title — body" rhythm, partner photo bottom-right inside a hairline-bordered cream block.

**B. Founder Offer** — same cream paper (no more dark layout — you said the dark felt heavy). Bold split headline, single hero passage, three pillars laid out like the deck's "Who's in the room" page (3 columns × hairline tops), CTA + QR in footer.

**C. Event Invite** — date/time/place in tall display Playfair, italic blurb, tiny letterspaced details ("Curated guest list · No slides · No press"), large QR centered low.

**D. Sales Sheet** — the most complex. Full layout below.

### 3. Sales Sheet — detailed layout

```text
┌───────────────────────────────────────────────────────────┐
│  ▬▬▬▬▬▬▬▬▬▬ gold rule ▬▬▬▬▬▬▬▬▬▬▬                          │
│                                                            │
│  PRESENTED BY {Partner}            FROM GALAVANTEER ▮     │
│                                                            │
│  WHAT IT IS                                                │
│  ─────                                                     │
│                                                            │
│  The Roundtable.                                           │
│  A private executive boardroom                             │
│  inside your own ChatGPT.                                  │
│                                                            │
│  {italic tagline — editorial, 2–3 lines}                   │
│                                                            │
├──────────────────────── hairline ─────────────────────────┤
│  WHAT YOU ACTUALLY GET                                     │
│                                                            │
│  01  A real boardroom    │  02  Built around               │
│      on demand           │      your business              │
│      {italic body}       │      {italic body}              │
│  ─────                   │  ─────                          │
│  03  Structured to       │  04  Private and yours          │
│      an answer           │      {italic body}              │
│      {italic body}       │                                 │
│                                                            │
├──────────────────────── hairline ─────────────────────────┤
│  HOW DEEP YOU GO                                           │
│                                                            │
│  01  The Roundtable     {body italic}        Included      │
│  ─────                                                     │
│  02  Company Context    {body italic}        $— or req     │
│  ─────                                                     │
│  03  You, in the Room   {body italic}        $— or req     │
│  ─────                                                     │
│  04  Future You         {body italic}        $— or req     │
│                                                            │
│  Which level is right for you is a conversation.           │
│                                                            │
├──────────────────────── hairline ─────────────────────────┤
│  INVESTMENT                                                │
│                                                            │
│  Workspace build (Level 1)              $6,000             │
│  Each additional persona                $500 / build       │
│  ─────                                                     │
│  Not included — billed separately:                         │
│    ChatGPT Teams (paid to OpenAI)       $50 / month        │
│    Each additional user                 $100 / month       │
│    Optional ongoing maintenance         $200 / month       │
│                                                            │
├──────────────────────── hairline ─────────────────────────┤
│  ─── only when toggle on ───                               │
│  YOU GET THE SYSTEM. AND YOU GET {PARTNER}.                │
│                                                            │
│  {Partner} introduces you personally. If you want them at  │
│  the table, they can sit in your Roundtable sessions as a  │
│  coaching voice — drawing on the experience that brought   │
│  this to you in the first place.                           │
│                                                            │
├──────────────────────── hairline ─────────────────────────┤
│  REQUEST ACCESS                              [QR]          │
│  galavanteer.com/r/{slug}                                  │
│  {Partner} · In partnership with Galavanteer    PAGE 01    │
└───────────────────────────────────────────────────────────┘
```

Key changes vs current Sales Sheet:
- **No more dark blocks** — the $6,000 investment block becomes a clean editorial line on cream, not a heavy navy slab. The number is large Playfair in navy, right-aligned, with a hairline above.
- **$500 per additional persona** added as its own line in Investment.
- **Level names locked** to your terms: Roundtable / Company Context / You, in the Room / Future You.
- **Margarita callout becomes a generic, optional "introducer in your room" block** — driven by a toggle in the form. Copy auto-personalizes with the current partner's name. Off by default.
- **Letter sizing kept** (8.5 × 11) and propagated to the other three flyers too, so the family prints together.

### 4. Form additions

In `PartnersMarketingPage.tsx`:
- New toggle: **"Include 'partner sits in your room' offer"** (default off). When on, the callout appears with the partner's name baked in.
- New optional input: **"Custom intro line"** for when the partner wants to override the default coaching-seat copy.
- The existing Level 2/3/4 price inputs stay; they now feed the new ladder visual.
- Per-additional-persona is fixed at $500 (shown but not editable, since you set it as a global price).

### 5. Color preview step

Before any code goes out, I'll render the Sales Sheet in each of the three palette directions above as a single screenshot, present them via `ask_questions` (visual_choice), and only then commit the chosen palette into `flyerTheme.ts` and wire up all four flyers.

### Files affected

- **New** `src/components/partners/marketing/flyerTheme.ts` — shared palette + typography tokens.
- **Rewrite** `FlyerSalesSheet.tsx` — full editorial layout, persona add-on line, toggleable introducer block.
- **Rewrite** `FlyerRoundtableIntro.tsx` — editorial cream layout matching deck.
- **Rewrite** `FlyerFounderOffer.tsx` — cream layout (lose the dark).
- **Rewrite** `FlyerEventInvite.tsx` — cream + Playfair display.
- **Update** `FlyerFrame.tsx` — default size becomes Letter; cream paper background option.
- **Update** `PartnersMarketingPage.tsx` — introducer toggle, optional custom intro line.
- **Update** `SalesMaterialReference.tsx` — mirror the new visual language in the on-page reference.
- **Untouched** `partnerFlyer.ts` — already honors per-element size; no change needed.

### Out of scope

- No DB changes. Toggle + custom line are session-only inputs (consistent with existing pattern).
- No multi-page deck PDF in this pass — that's a bigger lift; we can add it after the 1-pagers land.
- Public marketing site untouched.

### What I'll need from you mid-flight

After implementation, I'll generate three Sales Sheet renderings (palettes A / B / C above) and ask you to pick. That's the only blocker.