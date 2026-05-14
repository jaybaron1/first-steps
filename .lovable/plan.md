## Goal

Make the Sales Sheet feel like it knows the product: persist pricing per partner, show Tier 1 as Included, drop the "Pull Up a Chair" tier, move the Galavanteer mark to the footer only, and ship a tagline that actually says what The Roundtable is.

## 1. Persist pricing per partner (auto-save)

Add five new columns to `public.partners`. Auto-save fires on edit (debounced ~600ms), scoped to the logged-in partner's row. No Save button.

```text
flyer_setup_price    integer  default 6000
flyer_tier_prices    jsonb    default '{}'::jsonb     -- { l2:1500, l3:2500, l4:300, l5:500 }
flyer_show_margarita boolean  default true
flyer_margarita_note text     nullable
flyer_tagline        text     nullable
```

- Existing RLS already covers it: SDRs update their own partner row, portal partners see their own row, admins manage all. No new policies needed.
- On `PartnersMarketingPage` mount, load these alongside `name`/`landing_*` fields and hydrate state.
- Save: debounced `update partners set ... where id = partnerId`. Toast only on error.
- Field reverts to default if the partner clears the input.

## 2. Tier ladder — 5 tiers, Tier 1 "Included"

Drop "Pull Up a Chair." The Sales Sheet describes the workspace build; the per-chair monthly access fee belongs in a separate conversation, not on this one-pager.

```text
1  The Roundtable        — Included      (badge, no $)
2  The Operating Frame   — partner price or "Quoted on request"
3  Take A Seat           — partner price or "Quoted on request"
4  Future Me             — partner price or "Quoted on request"
5  Add a Voice           — partner price or "Quoted on request"
```

Tier 1 row keeps the medallion + name + body, with an `Included` pill in the same slot the price would sit. Reads as: "the room itself comes with the build."

Mirror the same five-row ladder in `SalesMaterialReference.tsx` so the on-page talk-track and the printed flyer agree.

## 3. Galavanteer logo — footer only

- Remove the `GalavanteerMark` from the dark masthead. The masthead becomes: partner accent stripe → `Presented by [partner]` → "The Roundtable" wordmark → partner photo on the right. Top of the sheet is the partner's space.
- Keep the `GalavanteerMark` lockup in the footer left column under the referral URL.
- Other three flyers (Intro / Founder / Event) already have the mark only in the footer — no change.

## 4. Tagline — stronger default

Replace the current default with copy that names what's actually happening, drawn from the deck and landing page:

> **A private boardroom inside your own ChatGPT. Bring a real decision and the room assembles three to five of sixty-plus senior advisors — chosen for the problem in front of you — to think it through and hand back a written brief you can defend.**

Why this is the default:
- "private boardroom inside your own ChatGPT" — placement and ownership.
- "three to five of sixty-plus senior advisors" — the scale point you flagged.
- "chosen for the problem in front of you" — specialization, not generic chat.
- "written brief you can defend" — the deliverable, mirrors the deck.

Margarita can still rewrite it inline; her edits persist via `flyer_tagline`. If she clears the field, it falls back to this default.

## 5. Form layout (left rail)

After this change, the Sales Sheet form panel shows, in order:

1. Template chooser
2. Your name / photo / image style
3. Headline
4. Tagline (auto-saved)
5. Margarita callout toggle + note (auto-saved)
6. Workspace build price (auto-saved)
7. Tier prices: Operating Frame, Take A Seat, Future Me, Add a Voice — four inputs, blank → "Quoted on request" (auto-saved)
8. Accent color
9. Referral link (read-only)
10. Download PDF

The Tier 6 / Pull Up a Chair input is removed.

## 6. Out of scope

- No changes to the Intro / Founder / Event flyer templates.
- No changes to authentication, RLS, or other partner pages.
- No subscription/MRR pricing surfaced on this sheet — that's a different document.

## Files touched

- **Migration**: add five `flyer_*` columns to `public.partners`.
- `src/components/partners/marketing/FlyerSalesSheet.tsx` — drop logo from masthead, change ladder to 5 rows, render Tier 1 as `Included`.
- `src/components/partners/marketing/FlyerRoundtableIntro.tsx` — narrow `FlyerData.levelPrices` to `{ l2?, l3?, l4?, l5? }`.
- `src/components/partners/marketing/SalesMaterialReference.tsx` — mirror the 5-tier ladder.
- `src/pages/partners/PartnersMarketingPage.tsx` — load + hydrate the five new fields, debounced auto-save, drop the Tier 6 input, swap in the new default tagline.
