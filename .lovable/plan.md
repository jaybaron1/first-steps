

Looking at the screenshot, the Bravado quote still has a large gap below the white comparison cards. The quote margin is currently `mt-8` but needs to be much tighter.

## Plan

**File: `src/components/sections/ComparisonSection.tsx`**

1. Change the quote container margin from `mt-8` to `mt-2` to pull it much closer to the cards above.

This is a one-line change on the `<div className="mt-8 max-w-xl mx-auto text-center">` wrapping the blockquote.

