
# Custom Goal Tracking, CTA Heatmaps & Lead Enrichment

This plan implements the three remaining conversion intelligence features to complete Section 2.

---

## Current State

| Component | Status |
|-----------|--------|
| Funnel visualization | Implemented in `ConversionFunnel.tsx` |
| CTA performance table | Implemented in `CTAPerformance.tsx` |
| Lead scoring | Implemented via `calculate_lead_score` function |
| A/B testing | Implemented in `ABTestingPanel.tsx` |
| Visitor session tracking | Stores `company_name`, `company_size`, `company_industry` (currently empty) |

---

## Phase 1: Custom Goal Completion Tracking

### 1.1 Database Schema

Create a new `conversion_goals` table:

```text
conversion_goals
+------------------+-------------+---------------------------------------+
| Column           | Type        | Description                           |
+------------------+-------------+---------------------------------------+
| id               | uuid        | Primary key                           |
| name             | text        | Goal name (e.g., "Booked Call")       |
| description      | text        | Optional description                  |
| goal_type        | text        | url_visit, event, time_on_site, etc.  |
| goal_config      | jsonb       | Configuration for matching            |
| value            | numeric     | Optional monetary value               |
| status           | text        | active, paused, archived              |
| created_at       | timestamptz | Creation timestamp                    |
+------------------+-------------+---------------------------------------+
```

Create a `goal_completions` table:

```text
goal_completions
+------------------+-------------+---------------------------------------+
| Column           | Type        | Description                           |
+------------------+-------------+---------------------------------------+
| id               | uuid        | Primary key                           |
| goal_id          | uuid        | FK to conversion_goals                |
| session_id       | text        | Session that completed goal           |
| completed_at     | timestamptz | When goal was completed               |
| metadata         | jsonb       | Additional context                    |
+------------------+-------------+---------------------------------------+
```

### 1.2 Goal Types Configuration

The `goal_config` JSONB will support multiple goal types:

```text
URL Visit:      {"url_pattern": "/pricing%", "min_time": 10}
Event:          {"event_type": "cta_click", "event_filter": {"ctaName": "Book"}}
Time on Site:   {"min_seconds": 180}
Scroll Depth:   {"min_depth": 75, "url_pattern": "/%"}
Page Count:     {"min_pages": 3}
Form Submit:    {"form_id": "contact-form"}
```

### 1.3 New Component: `GoalsPanel.tsx`

Admin interface with:
- List of defined goals with completion counts
- Create/edit goal dialog with type selector
- Goal type options with appropriate config fields
- Real-time completion tracking display
- Sparkline trends for each goal

### 1.4 New Hook: `useGoals.ts`

Provides:
- CRUD operations for goals
- Goal completion statistics
- Conversion rate calculations by source

### 1.5 Frontend Goal Detection

Modify `src/lib/visitorTracking.ts` to check for goal completion on:
- Page views (URL patterns)
- Events (custom event matching)
- Session metrics (time, scroll, pages)

---

## Phase 2: CTA Heatmap Visualization

### 2.1 New Component: `CTAHeatmap.tsx`

Visual click density display showing:

```text
+-----------------------------------------------+
|  Page: /marketing                       [v]   |
+-----------------------------------------------+
|                                               |
|  +------------------------------------------+ |
|  |           HEADER                         | |
|  |   [Logo]              [Nav] [CTA: 45]    | |
|  +------------------------------------------+ |
|  |                                          | |
|  |           HERO SECTION                   | |
|  |                                          | |
|  |      Headline Here                       | |
|  |      Subheadline                         | |
|  |                                          | |
|  |      [CTA Button: 234 clicks]  <-- HOT   | |
|  |                                          | |
|  +------------------------------------------+ |
|  |           PRICING SECTION                | |
|  |                                          | |
|  |   [Plan A: 89]  [Plan B: 156]  [Plan C]  | |
|  |                                          | |
|  +------------------------------------------+ |
|                                               |
+-----------------------------------------------+
```

### 2.2 Implementation Approach

Since we cannot capture actual screen positions, the heatmap will:
1. Query CTA clicks grouped by page URL
2. Display a schematic page layout with labeled sections
3. Show click counts as badges with color intensity
4. Use predefined page templates for known routes

### 2.3 Heatmap Data Structure

```typescript
interface CTAClickData {
  ctaName: string;
  pageUrl: string;
  section: string; // Derived from data-track-location
  totalClicks: number;
  intensity: 'cold' | 'warm' | 'hot';
}
```

### 2.4 Page Template System

Define templates for main pages:

```typescript
const PAGE_TEMPLATES = {
  '/marketing': [
    { section: 'header', label: 'Header CTA' },
    { section: 'hero', label: 'Hero Section' },
    { section: 'scorecard', label: 'Scorecard Section' },
    { section: 'pricing', label: 'Pricing Section' },
    { section: 'final_cta', label: 'Final CTA' },
  ],
  // ... other pages
};
```

---

## Phase 3: Clearbit Lead Enrichment Integration

### 3.1 Edge Function: `enrich-visitor`

New edge function that:
1. Receives IP address and optional email
2. Calls Clearbit Reveal API for IP-based company lookup
3. Optionally calls Clearbit Enrichment API for email lookup
4. Returns company data (name, size, industry)

```text
POST /enrich-visitor
{
  "ip_address": "104.193.168.24",
  "email": "john@company.com"  // optional
}

Response:
{
  "company_name": "Acme Corp",
  "company_size": "51-200",
  "company_industry": "Software",
  "company_domain": "acme.com"
}
```

### 3.2 Clearbit API Integration

Using Clearbit Reveal API (IP-based):

```text
GET https://reveal.clearbit.com/v1/companies/find?ip={ip}
Authorization: Bearer sk_...

Response includes:
- company.name
- company.domain
- company.metrics.employeesRange
- company.category.industry
```

### 3.3 Update Visitor Tracking

Modify `get-visitor-info` edge function to:
1. Get IP and geo data (existing)
2. Call `enrich-visitor` for company data
3. Return enriched response

Or alternatively, call enrichment on lead creation for cost efficiency.

### 3.4 Database Updates

The `visitor_sessions` table already has:
- `company_name`
- `company_size`
- `company_industry`

These will be populated by the enrichment function.

### 3.5 Admin Display

Update `LeadsPanel.tsx` to show:
- Company name column
- Company size badge
- Industry tag
- "Enrich" button for manual enrichment

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `conversion_goals` table | Create | Goal definitions |
| `goal_completions` table | Create | Completion tracking |
| `src/hooks/useGoals.ts` | Create | Goal CRUD and stats |
| `src/components/admin/GoalsPanel.tsx` | Create | Goal management UI |
| `src/components/admin/CTAHeatmap.tsx` | Create | Click density visualization |
| `src/hooks/useCTAStats.ts` | Modify | Add section grouping |
| `supabase/functions/enrich-visitor/index.ts` | Create | Clearbit integration |
| `src/components/admin/LeadsPanel.tsx` | Modify | Show company data |
| `src/lib/visitorTracking.ts` | Modify | Goal completion detection |
| `src/pages/admin/AdminDashboard.tsx` | Modify | Add Goals and Heatmap sections |

---

## Technical Implementation Details

### Goal Completion Detection Logic

```typescript
async function checkGoalCompletion(sessionId: string, context: GoalContext) {
  const goals = await getActiveGoals();
  
  for (const goal of goals) {
    if (await matchesGoal(goal, context)) {
      // Check if not already completed
      const exists = await goalCompletionExists(goal.id, sessionId);
      if (!exists) {
        await recordGoalCompletion(goal.id, sessionId, context);
      }
    }
  }
}

function matchesGoal(goal: Goal, context: GoalContext): boolean {
  switch (goal.goal_type) {
    case 'url_visit':
      return urlMatchesPattern(context.pageUrl, goal.goal_config.url_pattern);
    case 'event':
      return context.eventType === goal.goal_config.event_type;
    case 'time_on_site':
      return context.totalTime >= goal.goal_config.min_seconds;
    // ... other types
  }
}
```

### Heatmap Intensity Calculation

```typescript
function getIntensity(clicks: number, maxClicks: number): 'cold' | 'warm' | 'hot' {
  const ratio = clicks / maxClicks;
  if (ratio >= 0.6) return 'hot';
  if (ratio >= 0.3) return 'warm';
  return 'cold';
}
```

### Clearbit Error Handling

```typescript
async function enrichVisitor(ip: string): Promise<CompanyData | null> {
  try {
    const response = await fetch(
      `https://reveal.clearbit.com/v1/companies/find?ip=${ip}`,
      {
        headers: {
          'Authorization': `Bearer ${CLEARBIT_API_KEY}`,
        },
      }
    );
    
    if (response.status === 404) {
      // No company found for this IP (consumer IP)
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Clearbit API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      company_name: data.company?.name,
      company_size: data.company?.metrics?.employeesRange,
      company_industry: data.company?.category?.industry,
    };
  } catch (error) {
    console.error('[enrich-visitor] Error:', error);
    return null;
  }
}
```

---

## Secret Requirements

The Clearbit integration requires:
- `CLEARBIT_API_KEY` - Clearbit API secret key

This will need to be added via the secrets tool before the enrichment feature can work.

---

## Execution Order

1. Create database tables (conversion_goals, goal_completions)
2. Create `useGoals.ts` hook
3. Create `GoalsPanel.tsx` component
4. Create `CTAHeatmap.tsx` component
5. Request CLEARBIT_API_KEY secret
6. Create `enrich-visitor` edge function
7. Update `LeadsPanel.tsx` with company data display
8. Update `visitorTracking.ts` with goal detection
9. Update `AdminDashboard.tsx` with new sections
10. Test end-to-end goal tracking and enrichment
