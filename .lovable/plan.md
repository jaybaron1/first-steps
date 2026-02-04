
# Upgrade Live Visitor Map to Mapbox GL JS

## Overview
Replace the current SVG-based static world map with an interactive Mapbox GL JS map featuring city-level precision, real-time updates, marker clustering for high-traffic areas, and smooth pan/zoom interactions.

## Current State
- `LiveVisitorMap.tsx` uses a static SVG with hand-drawn continent paths
- Visitor locations are approximated using country-level coordinates with random jitter
- No actual city-level geocoding - just country centroids
- Latitude/longitude not stored in database (only country/city names)

## Implementation

### 1. Install Dependencies
Add the required Mapbox packages:
- `mapbox-gl` - Core Mapbox GL JS library
- `react-map-gl` - React wrapper for Mapbox GL JS (by Uber/Vis.gl)
- `supercluster` - Clustering engine for markers
- `@types/supercluster` - TypeScript definitions

### 2. Add Database Columns for Coordinates
Add `latitude` and `longitude` columns to `visitor_sessions` table to store precise coordinates from geo-lookup.

| Column | Type | Description |
|--------|------|-------------|
| latitude | NUMERIC(10,7) | Decimal latitude |
| longitude | NUMERIC(10,7) | Decimal longitude |

### 3. Update Edge Function
Enhance `get-visitor-info/index.ts` to return latitude and longitude from ipinfo.io response (which provides `loc` field with "lat,lng" format).

### 4. Update Visitor Tracking
Modify `visitorTracking.ts` to store the lat/lng coordinates when creating sessions.

### 5. Create New LiveVisitorMap Component
Build a new Mapbox-powered map component with:

**Map Features:**
- Interactive zoom (scroll wheel) and pan (click-drag)
- Dark-themed style matching admin dashboard aesthetic
- Smooth fly-to animations when clicking clusters

**Clustering:**
- Use Supercluster for high-performance marker grouping
- Cluster circles sized by point count
- Click cluster to zoom into points
- Expand threshold at zoom level 14

**Real-time Updates:**
- Poll database every 15 seconds for active visitors (last 5 minutes)
- Smooth marker transitions when data updates
- Pulsing animation on new visitor arrivals

**Visual Design:**
- Emerald dot markers (consistent with current design)
- Cluster circles with count badges
- Hover tooltips showing city, country, device
- Legend with active visitor count

### 6. Mapbox Token Management
Store the Mapbox API key in a constant within the component (publishable token is safe for frontend use).

---

## Technical Details

### Files to Create/Modify:

| File | Action | Purpose |
|------|--------|---------|
| `src/components/admin/LiveVisitorMap.tsx` | Replace | New Mapbox-powered component |
| `src/components/admin/MapboxCluster.tsx` | Create | Cluster rendering logic |
| `supabase/functions/get-visitor-info/index.ts` | Modify | Return lat/lng coordinates |
| `src/lib/visitorTracking.ts` | Modify | Store coordinates in session |

### Database Migration:
```sql
ALTER TABLE visitor_sessions 
ADD COLUMN latitude NUMERIC(10,7),
ADD COLUMN longitude NUMERIC(10,7);
```

### Mapbox Configuration:
```typescript
const MAPBOX_TOKEN = 'pk.eyJ1IjoiamF5YmFyb24xIiwiYSI6ImNtbDhuODdnYjA5OGgzZHB0d2o1NzdrZHYifQ.i_RjDQ3_PTj3KfSnf1bxOw';
```

### Component Structure:
```text
LiveVisitorMap
├── MapContainer (react-map-gl)
│   ├── Source (GeoJSON of visitors)
│   ├── ClusterLayer (circle layer for clusters)
│   ├── UnclusteredLayer (individual markers)
│   └── MarkerPopup (hover tooltip)
├── Legend (active count)
└── LoadingState (spinner)
```

### Data Flow:
```text
1. Poll Supabase every 15s for active sessions with lat/lng
2. Convert to GeoJSON FeatureCollection
3. Apply clustering via Mapbox source clustering
4. Render layers for clusters and individual points
5. Handle click events for zoom-to-cluster
```

## Map Style
Use a muted dark style (`mapbox://styles/mapbox/dark-v11`) that complements the admin dashboard's gold and cream color palette while providing good contrast for the emerald visitor markers.

## Fallback Behavior
If a session has no coordinates (legacy data), exclude from map display. The count legend will show all active visitors regardless.
