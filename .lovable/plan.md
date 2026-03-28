
Goal: Make collapse feel physically connected to the motion (no “collapse first, then rebound” dizziness).

What’s likely happening now:
- The UI collapses with `gridTemplateRows` while `scrollIntoView({ behavior: 'smooth' })` runs at the same time.
- Browser scroll anchoring/layout shifts are fighting the smooth scroll, creating the rebound effect.

Implementation plan (single file: `src/components/sections/ComparisonSection.tsx`):

1. Replace one-shot `scrollIntoView` with coordinated collapse scroll
- Create a `collapseWithFollow()` handler instead of directly calling `scrollIntoView`.
- On click:
  - Capture current `window.scrollY` and target Y near the Roundtable block (using `roundtableRef.getBoundingClientRect()` + `window.scrollY`).
  - Immediately trigger collapse (`setShowDeliverables(false)`, `setShowDecision(false)`).
  - Drive scroll using `requestAnimationFrame` for the same duration as collapse (e.g., 700–800ms), interpolating from current Y to target Y.
- This makes viewport movement happen continuously while panels retract, not after.

2. Disable scroll anchoring on collapsing regions
- Add `overflowAnchor: 'none'` on the expandable wrappers (and optionally the section container) to prevent browser auto-adjust/jump during height changes.
- This removes the “rebound” sensation caused by anchoring corrections.

3. Tighten animation synchronization
- Keep both expand/collapse panels on one consistent duration/easing.
- Match JS scroll duration to CSS collapse duration exactly.
- Keep opacity fade slightly shorter than height transition so content visually recedes early while movement continues smoothly.

4. Safety/cleanup
- Add a ref for active animation frame and cancel it before starting a new one (prevents stacked animations on rapid clicks).
- Remove unused imports if any become unnecessary after refactor.

Technical details:
- New refs/state:
  - `collapseRafRef` for animation frame id
  - optional `isCollapsing` boolean to prevent double-trigger during active collapse
- Core function shape:
  - `const collapseWithFollow = () => { measure start/target -> set states false -> raf loop window.scrollTo(...) }`
- Keep existing UI structure and premium styling intact; only behavior logic changes.

Validation checklist:
- Open either panel and collapse from near bottom: page should glide upward as card height shrinks.
- Open both panels and collapse: still one smooth continuous upward motion.
- No end-of-animation jump/rebound.
- Rapid repeated clicks don’t create jitter.
- Mobile and desktop both feel stable.
