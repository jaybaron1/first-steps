
# Complete Revenue Attribution System with Data Population

## Overview
This plan implements all missing revenue attribution features (LTV, CAC, Stage Velocity, At-Risk Deals, Cohort Analysis, Retention, and Churn) and provides methods for adding data to populate the dashboards.

## Current State Analysis

| Feature | Status | Gap |
|---------|--------|-----|
| Revenue by Channel | Done | - |
| Pipeline Value | Done | - |
| Win Rate | Done | - |
| Avg Deal Size | Done | - |
| ROI by Campaign | Done | - |
| MoM Growth | Done | - |
| **LTV** | Missing | Need calculation logic |
| **CAC** | Missing | Need spend tracking |
| **Stage Velocity** | Missing | Need stage history table |
| **At-Risk Deals** | Missing | Need stall detection |
| **Cohort Analysis** | Missing | Need cohort grouping |
| **Retention Curves** | Missing | Need customer tracking |
| **Churn Analysis** | Missing | Need churn detection |

---

## Part 1: Adding Revenue Data

### Method 1: Admin Data Entry Form (Recommended)
We will create an admin interface with forms to add:

1. **Deals** - Name, Company, Value, Stage, Expected Close Date
2. **Revenue Events** - Amount, Event Type, Date (linked to deals)
3. **Attribution Touchpoints** - Channel, Source, Campaign (linked to deals)

### Method 2: Direct Database Queries
Run these SQL inserts via Cloud View:

```sql
-- Insert sample deals
INSERT INTO deals (name, company, value, stage, probability, expected_close_date) VALUES
  ('Enterprise SaaS Contract', 'Acme Corp', 50000, 'closed_won', 100, '2024-01-15'),
  ('Mid-Market Package', 'TechStart Inc', 25000, 'negotiation', 80, '2026-02-28'),
  ('Consulting Engagement', 'Growth Co', 15000, 'proposal', 60, '2026-03-15');

-- Insert revenue events (after getting deal IDs)
INSERT INTO revenue_events (deal_id, amount, event_type, event_date, description) VALUES
  ('<deal_uuid>', 50000, 'payment', '2024-01-20', 'Initial contract payment'),
  ('<deal_uuid>', 12500, 'payment', '2024-02-15', 'Milestone payment');

-- Insert attribution touchpoints
INSERT INTO attribution_touchpoints (deal_id, channel, source, medium, campaign, touchpoint_type) VALUES
  ('<deal_uuid>', 'organic', 'google', 'organic', NULL, 'page_view'),
  ('<deal_uuid>', 'paid', 'google', 'cpc', 'brand_campaign_2024', 'ad_click');
```

---

## Part 2: Database Schema Updates

### 2.1 New Tables

**deal_stage_history** - Track time in each stage

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| deal_id | uuid | FK to deals |
| from_stage | deal_stage | Previous stage |
| to_stage | deal_stage | New stage |
| changed_at | timestamptz | When change occurred |
| duration_hours | numeric | Time spent in from_stage |

**customer_cohorts** - Group customers by signup month

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| cohort_month | date | First day of cohort month |
| customer_id | text | Unique customer identifier |
| first_revenue_date | date | Date of first payment |
| total_lifetime_value | numeric | Sum of all payments |
| last_activity_date | date | Most recent interaction |
| is_churned | boolean | Has customer churned |
| churned_at | date | When customer churned |

### 2.2 Add Columns to Campaigns

| Column | Type | Description |
|--------|------|-------------|
| actual_spend | numeric | Actual spend (vs budget) |

---

## Part 3: Implementation Details

### 3.1 Unit Economics (LTV/CAC)

**New Hook: useUnitEconomics.ts**

```text
Calculations:
- LTV = Total Revenue / Unique Customers
- CAC = Total Marketing Spend / New Customers Acquired
- LTV:CAC Ratio = LTV / CAC (healthy = 3:1 or higher)
- Payback Period = CAC / (LTV * Monthly Churn Rate)
```

**UI Component: UnitEconomicsCard.tsx**
- Display LTV, CAC, Ratio, Payback Period
- Trend arrows showing improvement/decline
- Industry benchmark comparisons

### 3.2 Stage Velocity & At-Risk Deals

**Database Trigger**: Automatically log stage changes to `deal_stage_history` when deals.stage is updated

**Velocity Calculation**:
- Query average duration per stage from history
- Compare current deal's time-in-stage to average
- Flag as "at risk" if > 2x average

**UI Component: AtRiskDealsPanel.tsx**
- List deals stalled in current stage
- Show days overdue vs average
- Action buttons (Send reminder, Escalate)

### 3.3 Cohort Analysis & Retention

**Cohort Assignment**: Group customers by month of first purchase

**Retention Matrix**:
```text
         Month 0   Month 1   Month 2   Month 3
Jan '24    100%      85%       70%       65%
Feb '24    100%      82%       68%       -
Mar '24    100%      80%       -         -
```

**UI Component: CohortRetentionChart.tsx**
- Heat map visualization
- Color intensity = retention rate
- Hover for detailed metrics

### 3.4 Churn Analysis

**Churn Detection**:
- Customer inactive for 90+ days after previous purchase
- Mark as churned in customer_cohorts

**UI Component: ChurnAnalysisPanel.tsx**
- Churn rate by cohort
- Top churn reasons (survey data or inferred)
- Revenue at risk from potential churners

---

## Part 4: Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `src/hooks/useUnitEconomics.ts` | LTV, CAC, Ratio calculations |
| `src/hooks/useStageVelocity.ts` | Time-in-stage analysis |
| `src/hooks/useCohortAnalysis.ts` | Cohort grouping and retention |
| `src/components/admin/UnitEconomicsCard.tsx` | LTV/CAC display |
| `src/components/admin/AtRiskDealsPanel.tsx` | Stalled deal alerts |
| `src/components/admin/StageVelocityChart.tsx` | Avg time per stage |
| `src/components/admin/CohortRetentionChart.tsx` | Retention heat map |
| `src/components/admin/ChurnAnalysisPanel.tsx` | Churn metrics |
| `src/components/admin/GrowthMetricsDashboard.tsx` | MoM/YoY comparisons |
| `src/components/admin/DealEntryModal.tsx` | Form to add deals |
| `src/components/admin/RevenueEntryModal.tsx` | Form to add revenue |

### Modified Files

| File | Changes |
|------|---------|
| `src/pages/admin/RevenuePage.tsx` | Add new panels and entry buttons |
| `src/hooks/useDeals.ts` | Add at-risk detection logic |
| `src/hooks/useRevenueMetrics.ts` | Add LTV/CAC calculations |

---

## Part 5: New Dashboard Layout

```text
RevenuePage
+-------------------------------------------------------+
| [+ Add Deal] [+ Record Revenue]                       |  <- Action buttons
+-------------------------------------------------------+
| Unit Economics                                         |
| +-------------+ +-------------+ +-------------+       |
| | LTV: $12.5k | | CAC: $2.8k  | | Ratio: 4.5x |       |
| +-------------+ +-------------+ +-------------+       |
+-------------------------------------------------------+
| Revenue Trend (existing)                              |
+-------------------------------------------------------+
| Sales Pipeline (existing) | At-Risk Deals             |
|                           | - Acme Corp (15 days)     |
|                           | - TechStart (8 days)      |
+-------------------------------------------------------+
| Stage Velocity            | Revenue Forecast          |
| Lead: 3.2 days avg       | (existing)                |
| Qualified: 5.1 days      |                           |
| Proposal: 8.4 days       |                           |
+-------------------------------------------------------+
| Channel Attribution (existing)                        |
+-------------------------------------------------------+
| Cohort Retention          | Churn Analysis            |
| [Heat map visualization]  | Churn Rate: 8.2%         |
|                           | Revenue at Risk: $45k     |
+-------------------------------------------------------+
| Campaign ROI (existing)                               |
+-------------------------------------------------------+
```

---

## Part 6: Technical Specifications

### Database Migration

```sql
-- Deal stage history for velocity tracking
CREATE TABLE deal_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  from_stage deal_stage,
  to_stage deal_stage NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_hours NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to auto-log stage changes
CREATE OR REPLACE FUNCTION log_deal_stage_change()
RETURNS TRIGGER AS $$
DECLARE
  prev_change RECORD;
BEGIN
  IF OLD.stage IS DISTINCT FROM NEW.stage THEN
    SELECT changed_at INTO prev_change
    FROM deal_stage_history
    WHERE deal_id = NEW.id
    ORDER BY changed_at DESC LIMIT 1;
    
    INSERT INTO deal_stage_history (deal_id, from_stage, to_stage, duration_hours)
    VALUES (
      NEW.id,
      OLD.stage,
      NEW.stage,
      CASE WHEN prev_change.changed_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (now() - prev_change.changed_at)) / 3600
        ELSE EXTRACT(EPOCH FROM (now() - OLD.created_at)) / 3600
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deal_stage_change_trigger
AFTER UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION log_deal_stage_change();

-- Customer cohorts for retention analysis
CREATE TABLE customer_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_month DATE NOT NULL,
  customer_id TEXT NOT NULL,
  first_revenue_date DATE NOT NULL,
  total_lifetime_value NUMERIC DEFAULT 0,
  last_activity_date DATE,
  is_churned BOOLEAN DEFAULT false,
  churned_at DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id)
);

-- Add actual_spend to campaigns
ALTER TABLE campaigns ADD COLUMN actual_spend NUMERIC DEFAULT 0;

-- RLS policies
ALTER TABLE deal_stage_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage stage history" ON deal_stage_history
  FOR ALL USING (has_role(auth.uid(), 'admin'));

ALTER TABLE customer_cohorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage cohorts" ON customer_cohorts
  FOR ALL USING (has_role(auth.uid(), 'admin'));
```

### At-Risk Detection Logic

```typescript
// In useDeals.ts
const STAGE_THRESHOLDS = {
  lead: 5,        // days
  qualified: 7,
  proposal: 14,
  negotiation: 21,
};

// Flag deals where days_in_stage > threshold * 1.5
const isAtRisk = (deal, avgVelocity) => {
  const daysInStage = (Date.now() - new Date(deal.updated_at)) / (1000*60*60*24);
  return daysInStage > (avgVelocity[deal.stage] || STAGE_THRESHOLDS[deal.stage]) * 1.5;
};
```

---

## Summary

This implementation:
1. Adds forms to enter deals, revenue events, and touchpoints via the UI
2. Creates stage history tracking with automatic triggers
3. Calculates LTV, CAC, and unit economics
4. Detects at-risk deals based on stage velocity
5. Implements cohort analysis with retention heat maps
6. Tracks and visualizes customer churn

Estimated new components: 11 files
Database changes: 2 new tables, 1 trigger, 1 column addition
