

## Changes

Three targeted edits to `ComparisonSection.tsx`:

1. **White box behind ChatGPT tagline** (lines 70-73): Wrap the tagline text in a white card (`bg-white p-5 lg:p-6`) and bold the first line (`font-semibold`).

2. **Increase Bravado quote font size** (line 225): Change from `text-lg` to `text-2xl lg:text-3xl` to give it proper visual weight.

3. **Bump attribution text** (line 229): Change from `text-xs` to `text-sm`.

### Technical Details

- Lines 70-73: Replace the plain `div` with a white card container, add `font-semibold` to "You can prompt ChatGPT."
- Line 225: `text-lg` → `text-2xl lg:text-3xl`
- Line 229: `text-xs` → `text-sm`

