

## Plan: Enhance DecisionProcess with Stakeholder Map, Restored Lines, and Closing Offer

Three targeted enhancements to the existing curated transcript, all in `src/components/sections/DecisionProcess.tsx`.

### 1. Restore Key Advisor Lines

Add back these high-impact lines that were trimmed but add real persuasive depth:

- **Sarah** (after her "building something together" line): *"If they reached out to you, they already believe you can deliver something meaningful. The danger is pretending you're a large firm when you're still founder-led. The smartest partners name that reality upfront."*
- **Monica** (in her structure recommendation): *"If they won't accept that structure, that tells you something important about the risk profile of the client."*
- **Sarah** (in her phased credibility response): *"This is not 'I'm not sure I can do this.' This is 'We want to ensure this delivers real transformation before scaling.' That language earns respect."*
- **David** (final line addition): *"Your yes must include permission to build leverage, support, or structure as the program evolves. If you lock yourself into a promise frozen in time, you will resent it. That resentment always leaks into delivery."*

### 2. Add Stakeholder Map (New Section 05)

Add a new numbered section after Risks in the Executive Output:

| Stakeholder | Strategy |
|---|---|
| Fortune 500 sponsor / HR / L&D leader | Position phased structure as intentional transformation design |
| Senior executive team (participants) | Emphasize behavior change, not inspiration |
| John Lim (internal) | Protect energy, standards, and long-term brand equity |

Styled as a compact grid/list matching existing Executive Output aesthetic.

### 3. Expand Facilitator Closing with Reconvene Offer

Replace the single closing line with the full facilitator sign-off including the reconvene options:

- Pressure-test your Phase One proposal language
- Rehearse the client conversation
- Design the internal delivery architecture before you commit

Styled as a subtle list under the closing statement, reinforcing ongoing value.

### Technical Details

- All changes in `src/components/sections/DecisionProcess.tsx`
- Add lines to existing `boardroomDialogue` array entries
- Add `stakeholders` array to `executiveOutput` object
- Add section 05 JSX block and update facilitator closing JSX
- No new dependencies or files needed

