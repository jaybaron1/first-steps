
# Fix: Structured Data Detection Should Check Homepage

## The Problem
The Structured Data check currently queries `document.querySelectorAll('script[type="application/ld+json"]')` on the **current page** (`/admin/seo`), which has no JSON-LD schemas. Your homepage (`/`) has 12+ schema components, but the admin page doesn't know about them.

## The Solution
Modify the Structured Data check to **fetch the homepage HTML** and parse it for JSON-LD scripts, similar to how `robots.txt` and `sitemap.xml` are already fetched.

---

## Technical Changes

### File: `src/components/admin/TechnicalSEOPanel.tsx`

Replace the current Structured Data check logic:

```typescript
// CURRENT (broken - checks admin page DOM):
const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');

// NEW (correct - fetches homepage and parses):
try {
  const homeRes = await fetch('/');
  if (homeRes.ok) {
    const html = await homeRes.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    // ... parse and count schemas
  }
} catch {
  // Handle error
}
```

### What This Achieves
1. Fetches the homepage HTML (same approach as robots.txt/sitemap.xml)
2. Parses it with DOMParser to extract JSON-LD blocks
3. Counts schemas and extracts their `@type` values
4. Shows accurate results: "12 JSON-LD blocks found" with types like "Organization, Service, FAQPage, BreadcrumbList, etc."

---

## Expected Result After Fix

| Check | Status | Details |
|-------|--------|---------|
| Structured Data | ✅ Pass | 12+ JSON-LD blocks found |
| Current Value | | Schema types: Organization, Service, FAQPage, BreadcrumbList, Person, Review, LocalBusiness, AggregateRating, WebPage, etc. |

This will also increase your Technical SEO Score since Structured Data will now pass.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/admin/TechnicalSEOPanel.tsx` | Update Structured Data check to fetch homepage HTML and parse JSON-LD from there |
