

## Plan: Add "See how it was decided" toggle below "View sample output"

Add a second expandable toggle button below the existing "View sample output" button in `ComparisonSection.tsx`.

### Changes to `src/components/sections/ComparisonSection.tsx`

1. Add a new `showDecision` state variable alongside the existing `showDeliverables` state
2. Add a second toggle button below the deliverables section (after line 183) with the text pattern: "See how it was decided ↓" / "Hide how it was decided ↑"
3. Add an empty expandable content area that will be populated once you provide the content
4. Style it identically to the existing "View sample output" toggle for visual consistency

The button will use the same `ChevronDown`/`ChevronUp` icons and styling as the existing toggle. The expanded content area will use the same white card with `shadow-soft` treatment, with a placeholder ready for your content.

