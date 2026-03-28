

# Shift RevealSection Content Right of the Golden Thread

## What changes

In **RevealSection.tsx**, the content currently uses `max-w-4xl mx-auto text-center` which centers everything and ignores the golden thread line at `left-8 lg:left-16`.

**Plan:**
1. Change the content container from centered (`mx-auto text-center`) to left-aligned with a left margin that starts just past the golden thread line (roughly `ml-12 lg:ml-24`).
2. Update text alignment from `text-center` to `text-left` for headings, body text, and the "Introducing" label.
3. Keep the SVG diagram and "How the room works" / "The process" sections responsive — they can remain centered within the content area but the overall block shifts right.
4. The golden thread line stays at its current position — it now acts as a deliberate left margin anchor.

## Technical details

- **File**: `src/components/sections/RevealSection.tsx`
- Replace `max-w-4xl mx-auto text-center` with `max-w-4xl text-left` and add left padding/margin (`pl-16 lg:pl-24`) to clear the line.
- Update the "Introducing" label flex from `justify-center` to `justify-start`.
- Shift the "60+" background number positioning to align with the new left-aligned layout.
- The three-dot grid under "How the room works" and the four-step process can stay centered within the content block for visual balance.
- Mobile: On small screens, reduce the left margin so content doesn't get cramped.

