## Goal

Restore the Sales Sheet to the **previous visual format** (the one before this turn), but render the ladder as **6 tiers** instead of 4, and fix the dark "$6,000" block so it's readable on print.

Keep the other improvements from this turn that you've approved: Galavanteer logo on all flyers, Margarita toggle + editable note, updated tagline, and hiding the Bullets field on the Sales Sheet.

## What changes

### 1. Sales Sheet — revert layout to the prior format
Restore the structure that was already working:

- **Masthead** — dark ink bar with accent stripe, "Presented by [partner]", "The Roundtable" wordmark, partner photo on the right. Add the Galavanteer logo lockup next to the photo.
- **Lead** — `What it is` label + tagline.
- **Two columns** — left: 4 pillars with accent rules. Right: the **numbered medallion ladder** with the vertical accent rail.
- **Margarita callout** — back inside the left column under the pillars (toggle-controlled, editable note).
- **Investment block** — two-column band:
  - Left: "Investment · Workspace build" + `$6,000` price.
  - Right: "Not included — billed separately" list (ChatGPT Teams, additional users, maintenance).
- **Footer** — "Request access" + referral URL + Galavanteer mark on the left, QR on the right.

### 2. Ladder — expand to 6 tiers, same visual format
Same numbered medallion + rail + name/description + right-aligned price, but rendered for 6 tiers. Numbers `1`–`6` (not Roman numerals — keeps the prior visual). Defaults:

```text
1  The Roundtable        — Required
2  The Operating Frame   — price (override or "Quoted on request")
3  Take A Seat           — price
4  Future Me             — price
5  Add a Voice           — price
6  Pull Up a Chair       — price
```

The `Required` pill replaces the old "Included" pill on tier 1, since under the AB schema the room is a subscription, not "included."

### 3. Investment block — fix readability
The previous dark `$6,000` panel was unreadable on print. Keep the panel but:

- Lighten the background from near-black to the ink color at reduced weight (or invert: light cream background, ink-color price, accent stripe on the left).
- Bump the price to a bolder serif weight at the same size.
- Keep the accent stripe and the "Investment · Workspace build" eyebrow.

Result: the $6,000 still anchors the eye, but prints cleanly.

### 4. Form controls (left rail)
Update the price-override inputs to match the 6-tier ladder. Replace the current Level 2/3/4 inputs with:

- Tier 2 — The Operating Frame
- Tier 3 — Take A Seat
- Tier 4 — Future Me
- Tier 5 — Add a Voice
- Tier 6 — Pull Up a Chair

Each input is optional; blank shows "Quoted on request" exactly like before. Keep the Margarita toggle + note fields and the workspace setup price input.

### 5. Keep from this turn
- Galavanteer logo on all four flyer footers (and Sales Sheet masthead).
- Margarita toggle + editable note.
- Updated default tagline.
- Bullets field hidden when Sales Sheet is selected.

### 6. Out of scope (for this plan)
- The 6-tier AB pricing copy itself ($79/mo, +$1,500, etc.) — those values stay as **partner-overridable inputs**, not hardcoded into the template. You can put real numbers in for one partner and leave them blank for another.
- No edits to Intro / Founder / Event flyers beyond what's already shipped.

## Files touched

- `src/components/partners/marketing/FlyerSalesSheet.tsx` — restore prior layout, ladder grows to 6 rows, lighten the Investment panel.
- `src/pages/partners/PartnersMarketingPage.tsx` — extend the price-override form from 3 inputs to 5 inputs (tiers 2–6), keep Margarita toggle/note, keep setup price input.
- `src/components/partners/marketing/FlyerRoundtableIntro.tsx` — extend `FlyerData.levelPrices` shape to `{ l2?, l3?, l4?, l5?, l6? }`.
- `src/components/partners/marketing/SalesMaterialReference.tsx` — mirror the 6-tier ladder in the on-page reference so the talk-track matches the flyer.

No changes to backend, routing, auth, or the other flyer templates.
