## Add a visually distinct "Upgrade ladder" to the Sales Sheet

The four Level files describe the same product getting progressively more personal. They become the upgrade story inside the existing Sales Sheet — not a new flyer.

### The four levels (plain client-facing names, derived from the specs)

| Level | Name | What it adds |
|---|---|---|
| **Level 1** | The Roundtable (base) | Prestige executive personas, web-only context. Already covered as "Workspace build". |
| **Level 2** | Company Context | Two layers loaded together: the **Company Runtime** (what the business is, sells, and protects) and the **Operating Frame** (how this organization actually decides — risk, speed, escalation). The room reasons inside the company, not around it. |
| **Level 3** | You, in the Room | A faithful replica of how the principal actually thinks, decides, and speaks today. The room mirrors their bias and instinct so its outputs feel like their own thinking, sharper. |
| **Level 4** | Future You | An aspirational counterpart that challenges Present You. Creates productive tension on tradeoffs the principal has said they want to handle differently. |

Level 2A and Level 2B are merged under "Level 2 — Company Context" because the spec treats them as the paired company-truth layer; partners don't need to sell them separately.

### What changes in the Sales Sheet

The Sales Sheet (PDF + on-page reference) gains a new dedicated section between "What you actually get" and "Investment":

**Section title: "How deep you go"**

Visual treatment: a 4-step ladder/escalator (each step taller and more saturated than the last), each with:
- Level number (small, accent color)
- Plain name (bold)
- One-line description
- Editable price (blank default; renders as "Quoted on request" if blank, or `$X,XXX` if set)

Level 1 is shown as **Included** (not priced) so the ladder reads as: included → upgrade → upgrade → upgrade.

### Form changes (per-partner editability)

Add four optional price fields shown only when the Sales Sheet template is selected:
- Level 2 price
- Level 3 price
- Level 4 price

Blank = "Quoted on request" appears on the PDF. All in-session only, no DB write.

### Visual design step (before implementation)

Because the user wants the ladder visually designed, I'll generate **3 design directions** for just the "How deep you go" block — same accent color, same font stack as the rest of the Sales Sheet — and let you pick one before I write the final markup. The three directions will explore: (1) horizontal stepped ladder, (2) vertical numbered tiers with increasing weight, (3) connected-cards "ascent" layout.

### Files

**Modified**
- `src/components/partners/marketing/FlyerSalesSheet.tsx` — insert the Levels section; render prices conditionally
- `src/components/partners/marketing/SalesMaterialReference.tsx` — mirror the Levels block on-page
- `src/components/partners/marketing/FlyerRoundtableIntro.tsx` — extend `FlyerData` with optional `levelPrices: { l2?: number; l3?: number; l4?: number }`
- `src/pages/partners/PartnersMarketingPage.tsx` — three new editable price inputs (visible when `template === "sales"`), plumbed into `FlyerData`

### Out of scope

- No new flyer template, no DB schema, no public marketing-site changes.
- The four Level spec files remain internal knowledge — not surfaced to clients verbatim.
- No commission/pricing logic changes.

### Memory

Update `mem://features/partners-marketing` to record the four-level upgrade ladder names and that Level 2A + 2B are merged under "Company Context" for partner-facing material.
