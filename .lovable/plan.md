
# Plan: Build Out Remaining Admin Dashboard Pages

## Overview
Based on the 10-page specification and current implementation status, I'll build out the remaining functional dashboard pages: **Content Performance** and **System Health**. The Security Dashboard already has foundational components in `AdminRoute.tsx` handling auth, so I'll enhance it with visibility into security events.

---

## Current Status

| Page | Status |
|------|--------|
| Overview | Complete |
| Visitor Intelligence | Complete |
| Lead Generation | Complete |
| Campaigns | Complete |
| **Content Performance** | **To Build** |
| Revenue & Growth | Hidden (needs external integrations) |
| SEO & Search | Hidden (needs Google Search Console) |
| **System Health** | **To Build** |
| **Security Dashboard** | **To Build** |
| Reports & Exports | Hidden (future phase) |

---

## Pages to Build

### Page 5: Content Performance (`/admin/content`)

**Components:**
- **ContentPerformanceTable**: Enhanced page analytics with engagement metrics
  - Page URL and title
  - Total views, unique visitors
  - Average time on page
  - Bounce rate per page
  - Avg scroll depth
  - Entry/exit ratios

- **TopExitPagesCard**: Shows pages where users leave most often
  - Calculate exit rates by comparing last page views per session

- **EngagementScorecard**: Visual summary cards
  - Most engaging page (highest time + scroll)
  - Highest bounce rate page
  - Most viewed content

**Data Source:** `page_views` table with aggregations

---

### Page 8: System Health (`/admin/system`)

**Components:**
- **UptimeMonitor**: Visualize `keep_alive_logs` data
  - Current status indicator (last ping)
  - Response time chart (last 24h)
  - Uptime percentage calculation
  - Response time trends

- **PerformanceMetrics**: Summary cards
  - Average response time
  - Total pings
  - Success rate %
  - Last check timestamp

- **ResponseTimeChart**: Line chart using `recharts`
  - X-axis: time
  - Y-axis: response_time_ms
  - Threshold lines for warning (2s) and critical (5s)

- **SystemHealthAlerts**: Automatic alerts for
  - Response times exceeding thresholds
  - Failed health checks
  - Degraded performance trends

**Data Source:** `keep_alive_logs` table

---

### Page 9: Security Dashboard (`/admin/security`)

**Components:**
- **LoginAttemptsLog**: Track admin login events
  - Uses `visitor_events` with `event_type = 'admin_login'` (needs tracking)
  - Show timestamp, email, status (success/failed), IP

- **ActiveSessionsPanel**: Current authenticated admin sessions
  - Based on recent admin activity

- **SecurityAlertsPanel**: Security-related alerts
  - Failed login attempts
  - Rate limit triggers
  - Suspicious activity patterns

- **AuditLogViewer**: Display admin actions
  - Uses existing audit log infrastructure
  - Filter by action type, user, date

**Data Source:** `visitor_events` + new audit tracking

---

## Implementation Steps

### Step 1: Create Data Hooks

```text
src/hooks/useContentStats.ts      - Page performance aggregations
src/hooks/useSystemHealth.ts      - Keep-alive logs & uptime metrics
src/hooks/useSecurityEvents.ts    - Login attempts & security events
```

### Step 2: Create UI Components

```text
src/components/admin/ContentPerformanceTable.tsx
src/components/admin/TopExitPagesCard.tsx
src/components/admin/UptimeMonitor.tsx
src/components/admin/ResponseTimeChart.tsx
src/components/admin/LoginAttemptsLog.tsx
src/components/admin/ActiveSessionsPanel.tsx
```

### Step 3: Create Page Files

```text
src/pages/admin/ContentPage.tsx
src/pages/admin/SystemPage.tsx
src/pages/admin/SecurityPage.tsx
```

### Step 4: Update Navigation

Update `AdminLayout.tsx` to add new navigation tabs:
- Content (FileText icon)
- System (Server icon)
- Security (Shield icon)

### Step 5: Register Routes

Update `App.tsx` to include:
```
/admin/content   -> ContentPage
/admin/system    -> SystemPage
/admin/security  -> SecurityPage
```

---

## Technical Details

### Content Stats Hook Logic
```text
- Aggregate page_views by page_url
- Calculate unique sessions per page
- Compute avg time_on_page and scroll_depth
- Identify exit pages (last page_view per session)
- Calculate bounce rate (sessions with 1 page view)
```

### System Health Hook Logic
```text
- Fetch keep_alive_logs with time filtering
- Calculate uptime = success_count / total_count * 100
- Get average, min, max response times
- Identify outliers for alerting
```

### Security Events
```text
- Track admin login events via visitor_events
- Query events by type for security dashboard
- Calculate failed login rates
```

---

## UI/UX Considerations

- Consistent card styling with existing pages (border-[#B8956C]/20, rounded-2xl, shadow-lg)
- Loading skeletons for all data panels
- Time range selectors where appropriate
- Real-time indicators for live data
- Visual alerts for concerning metrics (red for critical, amber for warning)

---

## Dependencies

- `recharts` (already installed) for charts
- `date-fns` (already installed) for time formatting
- Existing UI components (Table, Card, Badge, Progress)

---

## Files to Create/Modify

### New Files (12)
1. `src/hooks/useContentStats.ts`
2. `src/hooks/useSystemHealth.ts`
3. `src/hooks/useSecurityEvents.ts`
4. `src/components/admin/ContentPerformanceTable.tsx`
5. `src/components/admin/TopExitPagesCard.tsx`
6. `src/components/admin/UptimeMonitor.tsx`
7. `src/components/admin/ResponseTimeChart.tsx`
8. `src/components/admin/LoginAttemptsLog.tsx`
9. `src/pages/admin/ContentPage.tsx`
10. `src/pages/admin/SystemPage.tsx`
11. `src/pages/admin/SecurityPage.tsx`

### Modified Files (2)
1. `src/components/admin/AdminLayout.tsx` - Add navigation items
2. `src/App.tsx` - Add routes

---

## Summary

This plan adds 3 new dashboard pages with 11 new components/hooks, expanding the admin portal from 4 to 7 functional tabs. Each page leverages existing database tables and follows established patterns for consistency.
