# Marketing copy pass — Sales Sheet

Two strings get rewritten. No layout, no logic, no schema changes. Both remain editable per partner and persist via the existing auto-save.

## 1. Tagline (top of Sales Sheet)

Current default:
> A private boardroom inside your own ChatGPT. Bring a real decision and the room assembles three to five of sixty-plus senior advisors — chosen for the problem in front of you — to think it through and hand back a written brief you can defend.

The marketer's read: it's accurate but it front-loads mechanics ("inside your own ChatGPT", "three to five of sixty-plus") before the promise. A tagline should sell the outcome, then prove it. Pick one:

**A. Outcome-led, short**
> Stop deciding alone. Convene a boardroom of sixty-plus senior advisors inside your own ChatGPT — and walk out with a written brief you can defend on Monday.

**B. Provocation-led**
> Every hard call deserves a room. Yours now has one — sixty-plus senior operators, founders, and specialists living inside your ChatGPT, ready to pressure-test the decision in front of you and hand back the memo.

**C. Quiet-confidence, editorial**
> A private boardroom, summoned on demand. Sixty-plus senior advisors sit inside your own ChatGPT; the three to five who fit your decision step forward, work it with you, and leave you a brief you can act on.

**D. Plain-spoken, founder voice**
> Bring the decision you've been circling. The Roundtable assembles the three to five advisors — out of sixty-plus — who've actually solved it before, thinks it through with you, and hands you the written brief.

## 2. Margarita's personal note (the callout card)

Source line from you:
> As part of this offer, my persona will be included as part of your boardroom, as a thanks for working with me. Ask me questions on-demand!

The marketer's read: this is the most human moment on the page — it shouldn't read like a bonus disclosure. It should feel like a handshake. The hook is *"I'm in the room with you."* Pick one:

**A. Warm + specific (recommended)**
> A small thank-you for working with me: I'm in the room. My voice — how I think, how I push back, the questions I'd actually ask — sits at your Roundtable from day one. Pull me in whenever you want a second read.

**B. Direct, founder-to-founder**
> Consider this my seat at your table. I've built a version of me into your Roundtable — same instincts, same questions, on call whenever the decision gets heavy. No extra charge, no scheduling.

**C. Short and confident**
> I'm at your table. A trained version of me joins your Roundtable as part of this engagement — ask me anything, anytime, and I'll answer the way I would in the room.

**D. Service-led**
> Because we're working together, I've added myself to your boardroom. My persona answers in my voice, with my playbook, on demand — so you've got me between our calls, not just on them.

## What I'll change

- `DEFAULT_TAGLINE_SALES` in `src/pages/partners/PartnersMarketingPage.tsx` (and the matching `tagline` inside `TEMPLATES` for the `sales` entry) → chosen tagline.
- `DEFAULT_MARGARITA_NOTE` in `src/pages/partners/PartnersMarketingPage.tsx` **and** in `src/components/partners/marketing/FlyerSalesSheet.tsx` (two copies must stay in sync) → chosen note.

Both strings remain overridable per partner; existing saved values are untouched (only blanks fall back to the new defaults).

## Question for you

Pick one tagline (A/B/C/D) and one note (A/B/C/D), or tell me to remix — e.g. "tagline B, note A, but cut the last sentence."
