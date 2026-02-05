
# Technical SEO Health - Expandable Check Details

## The Issue
The Technical SEO Health panel shows 80% because only 8 of 10 checks are passing (warnings count against the score). Currently each check shows only a brief summary, but you want to see exactly what each check is reviewing.

## The Solution
Convert each SEO check row into an expandable accordion that reveals:
- **What it checks**: Detailed explanation of what the check looks for
- **Why it matters**: SEO impact and importance
- **How to fix**: Actionable steps if the check fails or warns
- **Current value**: The actual data found (e.g., the full meta description text, canonical URL, etc.)

---

## What You'll See

Each check will be clickable and expand to show:

```
┌─────────────────────────────────────────────────────────┐
│ ✓ Meta Description                           [expand ▼] │
│   152 characters (optimal)                              │
├─────────────────────────────────────────────────────────┤
│ EXPANDED:                                               │
│                                                         │
│ What it checks:                                         │
│ Looks for a <meta name="description"> tag and validates │
│ the content length is between 120-160 characters.       │
│                                                         │
│ Why it matters:                                         │
│ Search engines display this in results. Optimal length  │
│ ensures your description isn't truncated.               │
│                                                         │
│ Current value:                                          │
│ "Stop explaining the same thing over and over. Custom   │
│ AI systems that think and write exactly like you..."    │
│                                                         │
│ How to fix:                                             │
│ Update the meta description in SEOHead component.       │
└─────────────────────────────────────────────────────────┘
```

---

## Technical Changes

### Updated SEOCheck Interface

```typescript
interface SEOCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  link?: string;
  // NEW FIELDS:
  whatItChecks: string;
  whyItMatters: string;
  howToFix: string;
  currentValue?: string; // The actual data found
}
```

### Check Details to Add

| Check | What It Checks | Why It Matters | How To Fix |
|-------|---------------|----------------|------------|
| robots.txt | Fetches /robots.txt and checks for sitemap reference | Controls which pages search engines can crawl | Create/update public/robots.txt with sitemap URL |
| sitemap.xml | Fetches /sitemap.xml and counts URL entries | Helps search engines discover all pages | Create public/sitemap.xml with all page URLs |
| Viewport Meta | Looks for `<meta name="viewport">` with width=device-width | Required for mobile-friendly ranking | Add viewport meta in index.html |
| Meta Description | Checks `<meta name="description">` and validates 120-160 chars | Displayed in search results; affects CTR | Update description in SEOHead component |
| Canonical URL | Checks for `<link rel="canonical">` | Prevents duplicate content issues | Add canonical link in SEOHead |
| Open Graph Tags | Checks for og:title, og:description, og:image | Controls social media sharing appearance | Add OG tags in SEOHead |
| Structured Data | Counts JSON-LD script blocks | Enables rich snippets in search results | Add schema.org markup via OrganizationSchema etc. |
| HTTPS | Checks window.location.protocol | Security requirement; ranking factor | Deploy on HTTPS-enabled host |
| Favicon | Looks for link[rel="icon"] | Branding in browser tabs and bookmarks | Add favicon link in index.html |
| HTML Lang | Checks `<html lang="">` attribute | Helps search engines understand language | Set lang="en" on html element |

### UI Component Update

Use the existing Accordion component to make each check expandable:

```tsx
<Accordion type="multiple" className="space-y-2">
  {checks.map((check) => (
    <AccordionItem key={check.name} value={check.name}>
      <AccordionTrigger>
        {/* Existing check row content */}
      </AccordionTrigger>
      <AccordionContent>
        {/* New detailed content */}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/TechnicalSEOPanel.tsx` | Add detailed check info, convert to accordion layout, capture current values |

---

## Score Calculation Note

The current 80% score means 8 of 10 checks are "pass". Warnings and failures both count against the score. After implementing the expandable details, you'll be able to see exactly which 2 checks are not passing and what needs to be fixed to reach 100%.
