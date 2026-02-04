
# Add FAQ Structured Data for Featured Snippets

## Overview
Add FAQ schema markup to the homepage to improve chances of appearing in Google's featured snippets and AI-powered search results. The existing `FAQSchema.tsx` component contains outdated content about "Custom GPT" pricing that doesn't match the current site focus on "The Roundtable."

## What This Accomplishes
- Increases visibility in Google's "People Also Ask" boxes
- Enables rich FAQ snippets in search results
- Improves AI discoverability (GPT, Perplexity, Claude) with structured Q&A content
- Provides direct answers to common prospect questions

## Implementation

### 1. Update FAQSchema Component
Replace the outdated FAQ content in `src/components/FAQSchema.tsx` with questions relevant to The Roundtable service:

**New FAQ Content:**
| Question | Answer Focus |
|----------|--------------|
| What is The Roundtable? | 60+ expert personas, cognitive infrastructure for executives |
| How is this different from ChatGPT? | Decision-making vs text generation, structured outcomes |
| Who is The Roundtable for? | Founders, executives, PE partners, coaches |
| What are the three service levels? | Level 1 (Roundtable), Level 2 (Connected), Level 3 (Replicated) |
| How do I get started? | Clarity Call booking process |

### 2. Add FAQSchema to Homepage
Import and render the `FAQSchema` component in `src/pages/Index.tsx` alongside the existing structured data (OrganizationSchema, ServiceSchema, ReviewSchema, etc.).

## Technical Details

**Files to modify:**
- `src/components/FAQSchema.tsx` - Update FAQ content to match current offerings
- `src/pages/Index.tsx` - Add FAQSchema import and render

**Schema format:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text"
      }
    }
  ]
}
```

## Verification
After implementation, validate the structured data using:
- Google Rich Results Test
- Schema.org validator
- View page source to confirm JSON-LD injection
