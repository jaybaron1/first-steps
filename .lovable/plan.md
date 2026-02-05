

# Section-Level Engagement Tracking

## The Problem
You only have ~2 main pages, so page-level metrics like "Homepage" with X views aren't useful. What matters is understanding which **sections** of your page capture attention and for how long.

## The Solution
Implement **Section Focus Tracking** — automatically track when each section enters the viewport and how long users spend with that section visible on screen.

---

## What You'll See Instead

Replace the current "Page Performance" table with a **Section Engagement Dashboard** showing:

| Section | Focus Time | Impressions | Avg Focus | Engagement Score |
|---------|-----------|-------------|-----------|------------------|
| Hero | 45m total | 523 | 52s | 🔥 High |
| Problem | 38m total | 498 | 46s | 🔥 High |
| Pricing Tiers | 22m total | 312 | 42s | ⚡ Medium |
| Testimonials | 15m total | 445 | 20s | ❄️ Low |

**Key Insights Card** replacing the generic page cards:
- **Most Engaging Section**: "Pricing Tiers" (avg 42s focus)
- **Drop-off Point**: "After Video Testimonials" (65% exit here)
- **Scroll Stopper**: "Reframe - Think Alone Again" (highest re-scroll rate)

---

## How It Works

1. **Add `data-section` attributes** to each section component:
   - Hero → `data-section="hero"`
   - ProblemSection → `data-section="the-problem"`
   - ReframeSection → `data-section="reframe-possibility"`
   - RevealSection → `data-section="the-roundtable-reveal"`
   - ComparisonSection → `data-section="comparison"`
   - VideoTestimonialsSection → `data-section="video-testimonials"`
   - TestimonialsSection → `data-section="text-testimonials"`
   - TiersSection → `data-section="pricing-tiers"`
   - CTASection → `data-section="final-cta"`

2. **Create a new tracking module** (`sectionTracking.ts`) that:
   - Uses `IntersectionObserver` to detect when sections enter/exit viewport
   - Tracks "focus time" = time each section is ≥50% visible
   - Fires events: `section_view` (impression) and `section_exit` (with duration)
   - Stores data in `visitor_events` table with `event_type: 'section_focus'`

3. **Add database table** for aggregated section stats:
   - `section_engagement` table with: `section_id`, `session_id`, `focus_duration_seconds`, `entered_at`, `exited_at`, `scroll_depth_on_exit`

4. **Build new admin components**:
   - `SectionEngagementTable.tsx` — ranked list of sections by engagement
   - `SectionFlowDiagram.tsx` — visual funnel showing section-to-section flow
   - Update `ContentPage.tsx` to replace/supplement page metrics with section metrics

---

## Technical Details

### New Files

```text
src/lib/sectionTracking.ts      — IntersectionObserver logic
src/hooks/useSectionStats.ts    — Query hook for admin dashboard
src/components/admin/SectionEngagementTable.tsx
src/components/admin/SectionFlowCard.tsx
```

### Database Migration

```sql
-- Section engagement tracking table
CREATE TABLE section_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES visitor_sessions(session_id),
  section_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  focus_duration_seconds INTEGER DEFAULT 0,
  entered_at TIMESTAMPTZ DEFAULT now(),
  exited_at TIMESTAMPTZ,
  entry_scroll_depth INTEGER,
  exit_scroll_depth INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast aggregation queries
CREATE INDEX idx_section_engagement_section ON section_engagement(section_id, created_at);
CREATE INDEX idx_section_engagement_session ON section_engagement(session_id);
```

### Tracking Logic

```text
IntersectionObserver Setup:
├── Threshold: 0.5 (section 50% visible)
├── On Enter:
│   ├── Record section_id + timestamp
│   └── Fire 'section_view' event (for impression counting)
├── On Exit:
│   ├── Calculate focus_duration = exit_time - enter_time
│   ├── Capture exit_scroll_depth
│   └── Insert into section_engagement table
└── On Page Unload:
    └── Flush any currently-visible section with partial duration
```

### Section Labels

| Component | `data-section` value | Friendly Name |
|-----------|---------------------|---------------|
| HeroSection | `hero` | Hero |
| ProblemSection | `the-problem` | The Problem |
| ReframeSection | `reframe` | The Possibility |
| RevealSection | `reveal` | The Roundtable |
| ComparisonSection | `comparison` | ChatGPT vs Roundtable |
| VideoTestimonialsSection | `video-testimonials` | Video Testimonials |
| TestimonialsSection | `testimonials` | Written Testimonials |
| TiersSection | `pricing` | Pricing Tiers |
| CTASection | `final-cta` | Final CTA |

---

## Admin Dashboard Changes

### Content Performance Page Updates

1. **New Summary Cards** (replace page-level ones):
   - "Highest Engagement" → Shows section with highest avg focus time
   - "Drop-off Section" → Shows section after which most users exit
   - "Hidden Gem" → Section with low impressions but high engagement when viewed

2. **Section Engagement Table** (replace Page Performance table):
   - Columns: Section Name, Impressions, Total Focus Time, Avg Focus, Drop-off Rate
   - Color-coded engagement scores
   - Sortable by any column

3. **Section Flow Visualization** (new):
   - Simple flow diagram showing: Hero → Problem → Reframe → etc.
   - With percentages showing how many users reach each section
   - Highlights where the biggest drop-offs occur

---

## Benefits

- **Actionable insights**: Know exactly which section captures attention vs. gets skipped
- **Content optimization**: If "Problem" section has low engagement, rewrite it
- **Exit analysis**: "Most users exit during Video Testimonials" → maybe move pricing higher
- **A/B testing support**: Compare engagement across section variants

---

## Future Enhancements

Once this is in place, you could add:
- **Heatmap overlay**: Visual heatmap showing focus intensity on actual page layout
- **Session replay markers**: Jump to exact point in replay where user lingered
- **Subdomain support**: Easy to add `visibility.galavanteer.com` tracking later — same section system

