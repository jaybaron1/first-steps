## Add a Sales Material section to /partners/marketing

Build a fourth flyer template ("Sales Sheet") plus a static on-page reference block partners can read while pitching The Roundtable.

### What gets added on the page

A new section above the existing template/preview UI titled **"Sales material"** with three blocks:

1. **What it is** — one short paragraph on The Roundtable (private ChatGPT workspace, calibrated to how the client thinks, no prompts to memorize).
2. **How it works** — the 4 public steps mirrored from the marketing site:
  - Call — confirm fit, goals, workflow
  - Blueprint — map personas, voice, decisions, integrations
  - Implement — build and validate the workspace
  - Track — confirm adoption and deliver a results snapshot
3. **What it costs** — clear pricing card:
  - **Setup** — $6,000 (one-time, editable per partner; can be paid in monthly installments)
  - **Not included / billed separately:**
    - ChatGPT Teams — $50/month (paid to OpenAI)
    - Each additional user — $100/month
    - Optional ongoing maintenance — $200/month

A small "Reference for you, the partner" note clarifies this is the talk-track, and partners can still customize the downloadable PDF below.

### What gets added to the flyer system

A fourth template **"Sales Sheet"** alongside Roundtable Intro / Founder Offer / Event Invite. Layout:

- Header: partner name + photo + accent rule
- Section 1: "The Roundtable" — short description
- Section 2: "How it works" — 4 numbered steps (Call → Blueprint → Implement → Track)
- Section 3: "Investment" — setup price + add-on table
- Footer: referral URL + QR (already wired to `/r/:slug/connect`)

The setup price defaults to **$6,000** but is editable in a new "Setup price" form field, persisted only in component state (no DB write). Add-on prices ($50 / $100 / $200) are fixed in copy — they're OpenAI / service costs, not partner-controlled.

### Files

**New**

- `src/components/partners/marketing/FlyerSalesSheet.tsx` — the PDF template
- `src/components/partners/marketing/SalesMaterialReference.tsx` — the on-page static reference block

**Modified**

- `src/pages/partners/PartnersMarketingPage.tsx`
  - Render `<SalesMaterialReference />` at the top of the page
  - Register the new template in the `TEMPLATES` array with `key: "sales"`
  - Extend `FlyerData` with optional `setupPrice` (default 6000) + add a "Setup price" input (only shown when `template === "sales"`)
  - Wire `renderFlyer` to return `<FlyerSalesSheet />` for the new key
- `src/components/partners/marketing/FlyerRoundtableIntro.tsx` — extend the shared `FlyerData` type to include the optional `setupPrice` field (or move the type to a shared file). Existing templates ignore the new field.

### Out of scope

- No DB schema changes. No edits to public marketing pricing.
- No per-partner persistence of the setup price (in-session only).
- No changes to commission logic or `partner_clients`.

### Memory

Update `mem://features/partners-marketing` to note the new Sales Sheet template and the on-page reference block.