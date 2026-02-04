
# Section 2: Conversion & Lead Intelligence - Complete Implementation

This plan implements all remaining features from Section 2, building on existing tracking infrastructure.

---

## Current State Analysis

### Already Implemented
- Lead capture via ChatDiscovery chatbot and SessionRequestForm
- Lead scoring algorithm (0-100) with database triggers
- CTA click tracking via `data-track-cta` attribute
- Form start event tracking (`form_start` events)
- Lead temperature badges (Hot/Warm/Cool/Cold)

### To Be Implemented
- Leads management dashboard with filtering and search
- Conversion funnel visualization with drop-off analysis
- CTA performance dashboard with heatmaps
- Google Sheets integration for lead sync
- A/B testing framework

---

## Phase 1: Leads Management Dashboard

### New Component: `LeadsPanel.tsx`

Creates a comprehensive leads management interface showing:

| Column | Description |
|--------|-------------|
| Name/Email | Lead contact info |
| Source | chatbot, form, contact |
| Status | new, contacted, qualified, converted |
| Lead Score | Temperature badge + numeric score |
| Journey | Pages visited count + entry page |
| Created | Timestamp with relative time |
| Actions | View details, change status |

**Features:**
- Filter by status, source, date range
- Search by name/email
- Sort by score, date, status
- Expandable rows showing full journey
- Bulk status updates

### New Hook: `useLeads.ts`

```typescript
interface UseLeadsOptions {
  status?: string[];
  source?: string[];
  dateRange?: { start: Date; end: Date };
  search?: string;
  sortBy?: 'created_at' | 'lead_score' | 'status';
  sortOrder?: 'asc' | 'desc';
}
```

---

## Phase 2: Conversion Funnel Visualization

### Database: New `funnel_steps` Table

```sql
CREATE TABLE funnel_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url_pattern text NOT NULL,
  step_order integer NOT NULL,
  funnel_name text DEFAULT 'default',
  created_at timestamptz DEFAULT now()
);

-- Default funnel: Homepage -> Services -> Pricing -> Contact -> Booked
INSERT INTO funnel_steps (name, url_pattern, step_order) VALUES
  ('Homepage', '/', 1),
  ('Services', '/services%', 2),
  ('Pricing', '/pricing%', 3),
  ('Contact', '/contact%', 4),
  ('Booked', 'calendly_booking_complete', 5);
```

### New Component: `ConversionFunnel.tsx`

Visual funnel showing:

```text
+------------------------------------------+
|  Homepage                    2,450 (100%)|
+------------------------------------------+
          |
          v  (68% continue)
+------------------------------------------+
|  Services                    1,666  (68%)|
+------------------------------------------+
          |
          v  (45% continue)
+------------------------------------------+
|  Pricing                       750  (31%)|
+------------------------------------------+
          |
          v  (40% continue)
+------------------------------------------+
|  Contact                       300  (12%)|
+------------------------------------------+
          |
          v  (33% continue)
+------------------------------------------+
|  Booked                        100   (4%)|
+------------------------------------------+
```

**Features:**
- Animated bars showing visitor volume
- Drop-off percentages between steps
- Time range selector (7d, 30d, 90d)
- Source filter (show funnel by UTM source)
- Click step to see visitor list who reached it

### New Hook: `useFunnelStats.ts`

Calculates:
- Visitors at each funnel step
- Drop-off rate between steps
- Conversion rate (step 1 to final step)
- Average time between steps
- Breakdown by traffic source

---

## Phase 3: CTA Performance Dashboard

### New Component: `CTAPerformance.tsx`

Dashboard showing all tracked CTAs with:

| CTA | Location | Clicks | Conversions | Rate | Mobile/Desktop |
|-----|----------|--------|-------------|------|----------------|
| "Book a Call" | Hero | 245 | 45 | 18.4% | 60/40 |
| "Get Started" | Pricing | 189 | 32 | 16.9% | 55/45 |
| "Learn More" | Services | 156 | 12 | 7.7% | 70/30 |

**Features:**
- Click count trends over time (sparkline charts)
- Device breakdown (mobile vs desktop)
- Conversion attribution (clicks that led to leads)
- Top performing CTAs ranking
- CTA click heatmap per page

### New Hook: `useCTAStats.ts`

Aggregates from `visitor_events` where `event_type = 'cta_click'`:
- Total clicks per CTA
- Unique sessions clicking
- Device type breakdown
- Page location distribution
- Time-series data for trends

### CTA Heatmap Component: `CTAHeatmap.tsx`

Visual representation of click density on page mockup:
- Page sections with color intensity based on clicks
- Overlay showing CTA positions
- Compare periods (this week vs last week)

---

## Phase 4: Google Sheets Integration

### New Edge Function: `sync-leads-to-sheets`

Syncs new leads to a Google Sheet automatically:

```typescript
// Triggered via webhook or scheduled
export async function handler(req: Request) {
  // 1. Get unsynced leads
  // 2. Append to Google Sheet
  // 3. Mark leads as synced
}
```

### Database: Add `sheets_synced_at` Column

```sql
ALTER TABLE leads ADD COLUMN sheets_synced_at timestamptz;
```

### Admin UI: Sheets Configuration

Simple settings panel to:
- Enter Google Sheet ID
- Test connection
- Toggle auto-sync on/off
- Manual sync button
- View sync history

---

## Phase 5: A/B Testing Framework

### Database: New Tables

```sql
-- Experiments table
CREATE TABLE ab_experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  element_selector text NOT NULL,
  variants jsonb NOT NULL DEFAULT '[]',
  status text DEFAULT 'draft',
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Variant assignments (which visitor saw which variant)
CREATE TABLE ab_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid REFERENCES ab_experiments(id),
  session_id text NOT NULL,
  variant_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Variant conversions
CREATE TABLE ab_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid REFERENCES ab_experiments(id),
  session_id text NOT NULL,
  variant_id text NOT NULL,
  conversion_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

### New Component: `ABTestingPanel.tsx`

Admin interface to:
- Create new experiments
- Define variants (control + variations)
- Set traffic split percentage
- View real-time results
- Declare winners

### A/B Results Display

```text
Experiment: "Hero CTA Copy"
Status: Running (Day 5 of 14)

+------------------+--------+-------+------+------------+
| Variant          | Views  | Conv. | Rate | Confidence |
+------------------+--------+-------+------+------------+
| A: "Book a Call" | 1,245  | 89    | 7.1% | Baseline   |
| B: "Start Free"  | 1,198  | 112   | 9.3% | 94%        |
| C: "Get Started" | 1,201  | 95    | 7.9% | 72%        |
+------------------+--------+-------+------+------------+

Recommendation: Variant B showing +31% lift. 
Needs 2 more days to reach 95% confidence.
```

---

## Phase 6: Dashboard Integration

### Update `AdminDashboard.tsx`

Add new sections:
1. **Leads Panel** - After Recent Visitors
2. **Conversion Funnel** - New dedicated section
3. **CTA Performance** - New dedicated section

### New Admin Sub-Pages

Create dedicated pages for deeper analysis:
- `/admin/leads` - Full leads management
- `/admin/funnels` - Funnel analysis
- `/admin/cta-performance` - CTA analytics
- `/admin/experiments` - A/B testing

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `funnel_steps` table | Create | Define funnel stages |
| `ab_experiments` table | Create | A/B test definitions |
| `ab_assignments` table | Create | Variant assignments |
| `ab_conversions` table | Create | Conversion tracking |
| `leads.sheets_synced_at` | Alter | Track sync status |
| `src/hooks/useLeads.ts` | Create | Leads data hook |
| `src/hooks/useFunnelStats.ts` | Create | Funnel analytics hook |
| `src/hooks/useCTAStats.ts` | Create | CTA performance hook |
| `src/hooks/useABTests.ts` | Create | A/B testing hook |
| `src/components/admin/LeadsPanel.tsx` | Create | Leads management UI |
| `src/components/admin/ConversionFunnel.tsx` | Create | Funnel visualization |
| `src/components/admin/CTAPerformance.tsx` | Create | CTA analytics |
| `src/components/admin/CTAHeatmap.tsx` | Create | Click heatmap |
| `src/components/admin/ABTestingPanel.tsx` | Create | A/B test management |
| `src/pages/admin/AdminDashboard.tsx` | Modify | Add new sections |
| `supabase/functions/sync-leads-to-sheets` | Create | Google Sheets sync |

---

## Technical Implementation Details

### Funnel Calculation Logic

```typescript
// For each funnel step, count unique sessions that visited
async function calculateFunnelMetrics(dateRange, source?) {
  const steps = await getFunnelSteps();
  
  return Promise.all(steps.map(async step => {
    // Match page_views against url_pattern
    const { count } = await supabase
      .from('page_views')
      .select('session_id', { count: 'exact' })
      .ilike('page_url', step.url_pattern)
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);
    
    return { step: step.name, visitors: count };
  }));
}
```

### CTA Attribution Logic

Link CTA clicks to eventual conversions:
1. Get all `cta_click` events
2. For each, check if same `session_id` has a lead
3. Calculate conversion rate per CTA

### A/B Variant Assignment

```typescript
// Deterministic assignment based on session fingerprint
function assignVariant(sessionId: string, experiment: ABExperiment) {
  const hash = hashString(sessionId + experiment.id);
  const bucket = parseInt(hash.slice(0, 8), 16) % 100;
  
  // Find variant based on traffic split
  let cumulative = 0;
  for (const variant of experiment.variants) {
    cumulative += variant.trafficPercent;
    if (bucket < cumulative) return variant.id;
  }
  return experiment.variants[0].id; // Fallback to control
}
```

---

## Execution Order

1. Run database migrations (funnel_steps, A/B tables)
2. Create data hooks (useLeads, useFunnelStats, useCTAStats, useABTests)
3. Build LeadsPanel component
4. Build ConversionFunnel component
5. Build CTAPerformance and CTAHeatmap components
6. Build ABTestingPanel component
7. Create sync-leads-to-sheets edge function
8. Update AdminDashboard with new sections
9. Add navigation for dedicated admin sub-pages
10. Test end-to-end
