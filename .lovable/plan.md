

# Enhanced Visitor Tracking & Analytics Implementation

This plan adds complete UTM tracking, lead scoring, device details, and a geographic heat map to your admin dashboard.

---

## Overview

We'll implement four key enhancements:
1. Add `utm_term` and `utm_content` columns for complete UTM tracking
2. Add `screen_resolution` and `viewport_size` columns for device details
3. Implement an automated lead scoring algorithm
4. Create a geographic heat map dashboard

---

## Phase 1: Database Schema Updates

### New Columns for `visitor_sessions` table

| Column | Type | Purpose |
|--------|------|---------|
| `utm_term` | text | Paid keywords |
| `utm_content` | text | A/B test variants |
| `screen_resolution` | text | e.g., "1920x1080" |
| `viewport_size` | text | e.g., "1440x900" |
| `timezone` | text | e.g., "America/New_York" |
| `language` | text | e.g., "en-US" |

### Migration SQL
```sql
ALTER TABLE visitor_sessions 
ADD COLUMN IF NOT EXISTS utm_term text,
ADD COLUMN IF NOT EXISTS utm_content text,
ADD COLUMN IF NOT EXISTS screen_resolution text,
ADD COLUMN IF NOT EXISTS viewport_size text,
ADD COLUMN IF NOT EXISTS timezone text,
ADD COLUMN IF NOT EXISTS language text;
```

---

## Phase 2: Update Tracking Code

### Files to Modify

**1. `src/lib/visitorTracking.ts`**
- Update `getUTMParameters()` to capture all 5 UTM params:
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- Add `getScreenInfo()` method to capture:
  - `screen_resolution`: `screen.width + "x" + screen.height`
  - `viewport_size`: `window.innerWidth + "x" + window.innerHeight`
  - `timezone`: `Intl.DateTimeFormat().resolvedOptions().timeZone`
  - `language`: `navigator.language`
- Update `createSession()` to include all new fields in the database insert

**2. `src/lib/tracking.ts`**
- Update `parseUTMParams()` to return all 5 UTM parameters
- Update `initializeSession()` to include screen/viewport/timezone/language data

---

## Phase 3: Lead Scoring Algorithm

### Scoring Logic

Create a new database function that calculates a lead score (0-100) based on:

| Factor | Points | Logic |
|--------|--------|-------|
| Page views | 0-25 | +5 per page, max 25 |
| Time on site | 0-25 | +1 per 30 seconds, max 25 |
| Scroll depth avg | 0-15 | +15 if avg > 75%, +10 if > 50%, +5 if > 25% |
| High-value pages | 0-20 | +10 for /pricing, +5 for /about, /examples |
| CTA clicks | 0-10 | +5 per CTA click, max 10 |
| Form interactions | 0-5 | +5 if started any form |

### Implementation

**1. Create database function `calculate_lead_score`**
```sql
CREATE OR REPLACE FUNCTION calculate_lead_score(p_session_id text)
RETURNS integer AS $$
DECLARE
  score integer := 0;
  page_count integer;
  total_time integer;
  avg_scroll integer;
  high_value_pages integer;
  cta_clicks integer;
  form_starts integer;
BEGIN
  -- Get session data
  SELECT page_views, total_time_seconds INTO page_count, total_time
  FROM visitor_sessions WHERE session_id = p_session_id;
  
  -- Calculate page view score (max 25)
  score := score + LEAST(page_count * 5, 25);
  
  -- Calculate time score (max 25)
  score := score + LEAST(FLOOR(total_time / 30), 25);
  
  -- Get average scroll depth
  SELECT COALESCE(AVG(scroll_depth), 0) INTO avg_scroll
  FROM page_views WHERE session_id = p_session_id;
  
  -- Scroll depth score
  IF avg_scroll > 75 THEN score := score + 15;
  ELSIF avg_scroll > 50 THEN score := score + 10;
  ELSIF avg_scroll > 25 THEN score := score + 5;
  END IF;
  
  -- High-value pages
  SELECT COUNT(*) INTO high_value_pages
  FROM page_views WHERE session_id = p_session_id
  AND (page_url LIKE '%/pricing%' OR page_url LIKE '%/about%' OR page_url LIKE '%/examples%');
  score := score + LEAST(high_value_pages * 5, 20);
  
  -- CTA clicks
  SELECT COUNT(*) INTO cta_clicks
  FROM visitor_events WHERE session_id = p_session_id AND event_type = 'cta_click';
  score := score + LEAST(cta_clicks * 5, 10);
  
  -- Form starts
  SELECT COUNT(*) INTO form_starts
  FROM visitor_events WHERE session_id = p_session_id AND event_type = 'form_start';
  IF form_starts > 0 THEN score := score + 5; END IF;
  
  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**2. Create trigger to auto-update lead score**
- Trigger on `page_views` INSERT/UPDATE
- Trigger on `visitor_events` INSERT
- Recalculates and updates `visitor_sessions.lead_score`

**3. Update tracking code to track `form_start` events**
- Add form focus listener to capture when users start filling forms

---

## Phase 4: Geographic Heat Map Dashboard

### New Component: `GeoHeatMap.tsx`

Location: `src/components/admin/GeoHeatMap.tsx`

**Features:**
- Shows visitor density by country with color intensity
- Time range selector (Today, 7 days, 30 days, All time)
- Country list with visitor counts sorted by volume
- Interactive tooltips showing country stats

**Visual Design:**
- SVG world map with country polygons
- Color scale: Light gold (#F3EDE4) to deep gold (#B8956C) based on visitor count
- Hover states showing visitor count and percentage
- Legend showing color scale

### Data Structure

```typescript
interface CountryStats {
  country: string;
  visitor_count: number;
  percentage: number;
  avg_time_on_site: number;
  conversion_rate: number;
}
```

### Integration

**1. Create `useGeoStats` hook**
- Location: `src/hooks/useGeoStats.ts`
- Fetches aggregated country data from `visitor_sessions`
- Supports time range filtering
- Returns sorted country stats array

**2. Add to AdminDashboard**
- New section between "Live Visitor Map" and "Real-Time Activity"
- Title: "Geographic Distribution"
- Subtitle: "Visitor density by country"

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `visitor_sessions` table | Migrate | Add 6 new columns |
| `src/lib/visitorTracking.ts` | Modify | Capture all UTM + screen data |
| `src/lib/tracking.ts` | Modify | Update parseUTMParams + initializeSession |
| `calculate_lead_score` | Create | Database function |
| `update_lead_score_trigger` | Create | Auto-update trigger |
| `src/hooks/useGeoStats.ts` | Create | Hook for geo data |
| `src/components/admin/GeoHeatMap.tsx` | Create | Heat map component |
| `src/pages/admin/AdminDashboard.tsx` | Modify | Add heat map section |

---

## Technical Details

### UTM Parameters Captured

After implementation, the tracking system will capture:

| Parameter | Example | Purpose |
|-----------|---------|---------|
| `utm_source` | google, newsletter | Traffic source |
| `utm_medium` | cpc, email | Marketing medium |
| `utm_campaign` | summer_sale | Campaign name |
| `utm_term` | luxury+travel | Paid search keywords |
| `utm_content` | banner_v2 | A/B test variant |

### Lead Score Temperature Mapping

| Score Range | Temperature | Color |
|-------------|-------------|-------|
| 0-25 | Cold | Gray |
| 26-50 | Cool | Blue |
| 51-75 | Warm | Yellow |
| 76-100 | Hot | Red/Orange |

### Heat Map Color Scale

The geographic heat map uses a logarithmic color scale to handle the typical power-law distribution of visitor locations:

```text
+--------------------------------------------------+
|  0 visitors    |------------>|    Max visitors   |
|  #F3EDE4       |    Gradient |    #B8956C        |
|  (Light cream) |             |    (Deep gold)    |
+--------------------------------------------------+
```

---

## Execution Order

1. Run database migration (add columns)
2. Deploy database function and trigger
3. Update tracking code files
4. Create new hook and component
5. Update AdminDashboard layout
6. Test end-to-end

