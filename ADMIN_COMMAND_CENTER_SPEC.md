# Galavanteer Admin Command Center - Enterprise Specification

## Overview
Build an enterprise-grade, non-public admin dashboard for $500K/month agency operations. This is a comprehensive command center for business intelligence, visitor tracking, lead generation, and growth optimization.

**🔐 AUTHENTICATION & ACCESS:**
This entire admin system is **password-protected using Supabase Authentication**. All routes (`/admin`, `/admin-portal`, `/dashboard`, `/security`, `/2fa-setup`, `/admin-users`, `/audit-logs`) require authenticated Supabase sessions with verified @galavanteer.com email addresses. The existing AdminPortalPage handles login with password reset functionality and optional 2FA.

**Critical Requirements:**
- 🚫 Non-public: Hidden from robots.txt, sitemap.xml, and LLM crawlers
- 🔐 Supabase Authentication: Password-protected with email verification
- 🛡️ Multi-Factor Authentication (2FA): Optional but recommended
- 🍪 Cookie-less tracking (privacy-first, GDPR compliant)
- 🔒 Enterprise-level security and role-based access control
- 📊 Real-time data and insights via Supabase Realtime
- 🎯 Actionable intelligence for business growth

---

## 1. VISITOR INTELLIGENCE & TRACKING

### 1.1 Real-Time Visitor Dashboard
- **Live Visitor Map**: Interactive world map showing active visitors in real-time
- **Current Active Users**: Count and list of users currently browsing
- **Real-Time Activity Feed**: Stream of visitor actions (page views, clicks, form fills)
- **Session Recordings**: Privacy-respecting session replay capabilities
- **Visitor Timeline**: Individual visitor journey tracking

### 1.2 Visitor Identification & Enrichment
- **Cookie-less Fingerprinting**: Browser fingerprinting for anonymous tracking
- **IP-based Identification**: Reverse IP lookup for B2B company identification
  - Company name, size, industry, revenue
  - LinkedIn company data integration
  - Clearbit/FullContact enrichment
- **Visitor Profiles**: Build anonymous profiles over time
  - First visit date
  - Total visits
  - Pages visited
  - Engagement score
  - Lead temperature (hot/warm/cold)

### 1.3 Geographic Intelligence
- Country, region, city, timezone
- Language preferences
- IP address (masked for privacy)
- ISP and organization name
- Geographic heat maps
- Market penetration by region

### 1.4 Traffic Source Analytics
- **Traffic Sources**: Direct, Organic, Referral, Social, Email, Paid
- **UTM Campaign Tracking**: Full UTM parameter capture
  - utm_source, utm_medium, utm_campaign, utm_term, utm_content
- **Referrer Analysis**: Top referring domains and pages
- **Social Media Attribution**: Platform-specific tracking (LinkedIn, Twitter, etc.)
- **Email Campaign Tracking**: Open rates, click-through attribution
- **QR Code Tracking**: Track offline-to-online conversions

### 1.5 Device & Technology Stack
- Device type (Desktop, Mobile, Tablet)
- Operating system and version
- Browser and version
- Screen resolution
- Viewport size
- Connection type (WiFi, 4G, 5G)
- Device model (iPhone 15 Pro, Samsung Galaxy, etc.)

---

## 2. CONVERSION & LEAD INTELLIGENCE

### 2.1 Lead Capture & Management
- **Form Submissions**: All contact form captures with full data
- **Email Captures**: Newsletter signups, content downloads
- **Consultation Requests**: Booking form submissions
- **Lead Scoring**: Automatic scoring based on:
  - Pages visited
  - Time on site
  - Return visits
  - Content engagement
  - Company size (if B2B identified)
- **Lead Enrichment**: Auto-populate missing data from third-party APIs
- **CRM Integration**: Sync leads to Salesforce, HubSpot, Pipedrive

### 2.2 Conversion Funnel Analysis
- **Funnel Visualization**: Multi-step funnel tracking
  - Homepage → Services → Contact → Consultation Booked
- **Drop-off Analysis**: Where visitors leave the funnel
- **Conversion Rates by Source**: Channel-specific conversion performance
- **A/B Test Results**: Variant performance comparison
- **Goal Completion Tracking**: Custom goal definitions and tracking

### 2.3 CTA Performance
- **Button Click Tracking**: Every CTA button tracked
- **CTA Heatmaps**: Visual representation of click density
- **CTA A/B Testing**: Compare different copy, colors, placements
- **Mobile vs Desktop Performance**: Device-specific CTA analysis

---

## 3. BUSINESS GROWTH METRICS

### 3.1 Revenue Attribution
- **Revenue by Channel**: Attribute revenue to traffic sources
- **Customer Lifetime Value (LTV)**: Track average customer value
- **Customer Acquisition Cost (CAC)**: Cost per acquired customer
- **ROI by Campaign**: Return on investment for each marketing initiative
- **Pipeline Value**: Total value of opportunities in progress
- **Win Rate**: Percentage of leads that convert to customers
- **Average Deal Size**: Mean revenue per closed deal

### 3.2 Sales Pipeline Visualization
- **Pipeline Stages**: Visual funnel of sales stages
- **Stage Velocity**: Time spent in each stage
- **Forecast Accuracy**: Predicted vs actual revenue
- **Top Opportunities**: High-value deals in progress
- **At-Risk Deals**: Deals likely to churn or stall

### 3.3 Growth Metrics Dashboard
- **Month-over-Month Growth**: Traffic, leads, revenue trends
- **Year-over-Year Comparison**: Historical performance comparison
- **Growth Rate**: Compound growth calculations
- **Cohort Analysis**: Customer behavior by signup date
- **Retention Curves**: Customer retention over time
- **Churn Analysis**: Why customers leave

---

## 4. CONTENT & ENGAGEMENT ANALYTICS

### 4.1 Page Performance
- **Most Viewed Pages**: Top pages by traffic volume
- **Engagement Metrics**: Time on page, scroll depth, interactions
- **Exit Pages**: Where visitors most commonly leave
- **Entry Pages**: Most common landing pages
- **Internal Link Clicks**: Track navigation patterns
- **Download Tracking**: PDF, resources, case studies
- **Video Engagement**: Play rate, watch time, completion rate

### 4.2 Content Scoring
- **Engagement Score**: Proprietary score based on user interactions
- **Content ROI**: Which content generates leads/revenue
- **Share Tracking**: Social sharing activity
- **Comment/Feedback Analysis**: User-generated content insights

### 4.3 Blog Analytics
- **Post Performance**: Views, time on page, shares per post
- **Author Performance**: Best-performing writers
- **Topic Performance**: Which topics resonate most
- **SEO Performance**: Organic traffic by post
- **Internal Linking Graph**: Visual content relationship map

---

## 5. SEO & SEARCH INTELLIGENCE

### 5.1 Organic Search Performance
- **Google Search Console Integration**:
  - Impressions, clicks, CTR, position
  - Query performance
  - Page performance
  - Country/device breakdown
- **Keyword Rankings**: Track position for target keywords
- **Keyword Gap Analysis**: Opportunities vs competitors
- **Featured Snippet Tracking**: Which content owns position zero

### 5.2 Technical SEO Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking over time
- **Lighthouse Scores**: Performance, SEO, Accessibility, Best Practices
- **Page Speed Trends**: Historical performance data
- **Mobile Usability**: Mobile-specific issues
- **Indexability Status**: Pages indexed vs crawled
- **Sitemap Health**: Sitemap errors and warnings

### 5.3 Backlink Intelligence
- **Backlink Monitoring**: New/lost backlinks
- **Domain Authority Tracking**: Site authority trends
- **Toxic Link Detection**: Harmful backlinks to disavow
- **Competitor Backlink Gap**: Links competitors have that you don't
- **Link Quality Score**: Authority and relevance of backlinks

### 5.4 Competitor Analysis
- **Competitor Traffic Estimates**: Benchmark against competitors
- **Keyword Overlap**: Shared keywords with competitors
- **Content Gap**: Topics competitors cover that you don't
- **Social Presence**: Competitor social media performance

---

## 6. MARKETING CAMPAIGN INTELLIGENCE

### 6.1 Campaign Dashboard
- **All Active Campaigns**: Status, budget, performance
- **Campaign ROI**: Revenue generated per campaign
- **Campaign Attribution**: First-touch, last-touch, multi-touch
- **Channel Mix**: Budget allocation across channels
- **Best Performing Campaigns**: Ranked by conversion/revenue

### 6.2 Email Marketing Analytics
- **Email Open Rates**: Track email campaign performance
- **Click-Through Rates**: Link clicks within emails
- **Email-to-Website Attribution**: Track email visitors on site
- **Email Conversion Tracking**: Leads/sales from email campaigns
- **List Growth**: Subscriber acquisition trends
- **Engagement Decay**: When subscribers become inactive

### 6.3 Social Media Analytics
- **Social Traffic**: Visitors from each platform
- **Social Conversions**: Leads/sales from social media
- **Post Performance**: Which social posts drive traffic
- **Influencer Impact**: Track influencer referral performance
- **Social Listening**: Brand mentions and sentiment

### 6.4 Paid Advertising Intelligence
- **Ad Spend Tracking**: Budget consumption by platform
- **Cost Per Click (CPC)**: Average CPC by campaign
- **Cost Per Lead (CPL)**: Lead acquisition cost
- **ROAS**: Return on ad spend
- **Ad Quality Score**: Platform-specific quality metrics
- **Ad Creative Performance**: Which creatives convert best

---

## 7. INTEGRATIONS & DATA SOURCES

### 7.1 Core Integrations
- **Supabase**: Primary database and auth
- **Google Analytics 4**: Cross-reference data
- **Google Search Console**: SEO data
- **Google Tag Manager**: Event tracking
- **Plausible/Fathom**: Cookie-less analytics alternative
- **PostHog**: Product analytics and feature flags

### 7.2 CRM & Sales Tools
- **Salesforce**: Opportunity and contact sync
- **HubSpot**: Marketing and sales automation
- **Pipedrive**: Deal pipeline management
- **Calendly**: Booking data import
- **Intercom/Drift**: Chat conversation insights

### 7.3 Marketing Tools
- **Mailchimp/SendGrid**: Email campaign data
- **LinkedIn Ads**: Paid campaign performance
- **Facebook/Meta Ads**: Social advertising data
- **Twitter/X Ads**: Platform-specific insights
- **Clearbit**: Company enrichment
- **FullContact**: Contact enrichment

### 7.4 Development & Operations
- **GitHub**: Deployment tracking
- **Sentry**: Error monitoring
- **Vercel/Netlify Analytics**: Hosting platform data
- **Cloudflare**: CDN and security analytics
- **Stripe**: Payment and revenue data

---

## 8. REAL-TIME ALERTS & NOTIFICATIONS

### 8.1 Intelligent Alerts
- **High-Value Visitor Alert**: When a large company visits
- **Hot Lead Notification**: When a visitor shows buying signals
- **Conversion Alert**: Real-time notification of form submissions
- **Traffic Spike Alert**: Unusual traffic patterns detected
- **Page Error Alert**: 404s or server errors detected
- **Security Alert**: Suspicious login attempts or activity
- **Goal Completion**: When business goals are achieved

### 8.2 Notification Channels
- **Email Notifications**: Digest emails or instant alerts
- **Slack Integration**: Channel-specific notifications
- **SMS Alerts**: Critical alerts via Twilio
- **Push Notifications**: Browser push for real-time updates
- **Discord Webhooks**: Team communication integration

---

## 9. ADVANCED ANALYTICS & AI

### 9.1 Predictive Analytics
- **Churn Prediction**: Which customers are at risk
- **Lead Scoring AI**: Machine learning-based lead quality
- **Traffic Forecasting**: Predicted future traffic patterns
- **Revenue Forecasting**: Projected future revenue
- **Anomaly Detection**: Automatic detection of unusual patterns

### 9.2 AI-Powered Insights
- **Natural Language Queries**: Ask questions in plain English
- **Automated Insights**: Daily AI-generated insights
- **Recommendations Engine**: Suggested actions to improve metrics
- **Trend Detection**: Emerging patterns and opportunities
- **Sentiment Analysis**: Customer feedback sentiment scoring

### 9.3 Custom Report Builder
- **Drag-and-Drop Report Builder**: Create custom dashboards
- **Saved Reports**: Template library of common reports
- **Scheduled Reports**: Auto-generated and emailed reports
- **White-Label Reports**: Client-facing branded reports
- **Data Export**: CSV, Excel, PDF export options

---

## 10. SECURITY & COMPLIANCE

### 10.1 Security Features
- **Multi-Factor Authentication (2FA)**: Required for all admins
- **Role-Based Access Control (RBAC)**: Granular permissions
- **IP Whitelisting**: Restrict access by IP address
- **Session Management**: Active session monitoring
- **Audit Logs**: Complete activity history (already have)
- **Failed Login Tracking**: Brute force protection (already have)
- **Rate Limiting**: API and login rate limits
- **Encryption**: All data encrypted at rest and in transit

### 10.2 Privacy & Compliance
- **GDPR Compliance Tools**:
  - Data deletion requests
  - Export user data
  - Cookie consent management
- **CCPA Compliance**: California privacy rights
- **Data Retention Policies**: Auto-delete old data
- **Privacy-First Tracking**: Cookie-less, anonymous by default
- **Data Anonymization**: Remove PII from analytics

---

## 11. SYSTEM HEALTH & OPERATIONS

### 11.1 Performance Monitoring
- **Uptime Monitoring**: 99.9% uptime tracking
- **Response Time**: API and page load times
- **Error Rate**: 4xx and 5xx error tracking
- **Database Performance**: Query performance metrics
- **CDN Performance**: Edge caching effectiveness
- **Third-Party Service Health**: Integration status monitoring

### 11.2 API Usage Analytics
- **API Call Volume**: Requests per endpoint
- **API Response Times**: Performance by endpoint
- **Rate Limit Status**: Current usage vs limits
- **Failed Requests**: Error tracking
- **Most Used Endpoints**: Popular API routes

### 11.3 Cost Monitoring
- **Supabase Usage**: Database, storage, bandwidth costs
- **Hosting Costs**: Vercel/Netlify spend
- **Third-Party API Costs**: Integration expenses
- **Total Monthly Spend**: All infrastructure costs
- **Cost Per Visitor**: Infrastructure efficiency

---

## 12. USER EXPERIENCE & DESIGN

### 12.1 Dashboard Design Principles
- **Dark Mode**: Professional dark theme (like Bloomberg Terminal)
- **Real-Time Updates**: Live data streaming without refresh
- **Responsive Design**: Works on all device sizes
- **Keyboard Shortcuts**: Power user navigation
- **Customizable Layouts**: Drag-and-drop widget arrangement
- **Data Visualization**: Charts, graphs, maps, tables
- **Color-Coded Metrics**: Green (good), yellow (warning), red (critical)

### 12.2 Data Visualization Libraries
- **Recharts**: Primary charting library
- **D3.js**: Advanced custom visualizations
- **Mapbox/Leaflet**: Interactive maps
- **AG Grid**: Enterprise-grade data tables
- **Victory Charts**: React-native chart library alternative

### 12.3 UX Features
- **Quick Filters**: Date ranges, sources, campaigns
- **Search Everything**: Global search across all data
- **Favorites/Bookmarks**: Save commonly viewed reports
- **Comparison Mode**: Compare two time periods side-by-side
- **Export Buttons**: One-click data export
- **Tooltips & Help**: Context-sensitive help throughout

---

## 13. SPECIFIC DASHBOARD PAGES TO BUILD

### Page 1: Command Center Overview
- Real-time visitor count and map
- Today's key metrics (visitors, leads, revenue)
- Active campaigns performance
- Recent high-value visitors
- Top pages today
- Alerts and notifications panel

### Page 2: Visitor Intelligence
- Visitor list with filters
- Individual visitor profiles
- Geographic breakdown
- Device/browser analytics
- Traffic source pie chart
- Visitor journey maps

### Page 3: Lead Generation Dashboard
- Lead list with scoring
- Lead source attribution
- Form submission tracking
- Lead enrichment status
- Conversion funnel visualization
- Hot leads requiring action

### Page 4: Revenue & Growth Analytics
- Revenue by channel
- ROI by campaign
- Sales pipeline visualization
- Growth trends (MoM, YoY)
- Customer acquisition metrics
- Forecasting charts

### Page 5: Content Performance
- Page performance table
- Blog analytics
- Content engagement scores
- Video/download tracking
- Internal linking graph
- Top exit pages

### Page 6: SEO & Search Intelligence
- Keyword rankings table
- Search console data
- Core Web Vitals trends
- Backlink monitoring
- Competitor analysis
- Technical SEO health

### Page 7: Campaign Intelligence
- Active campaigns overview
- Email marketing performance
- Social media analytics
- Paid advertising dashboard
- UTM parameter tracking
- Campaign ROI comparison

### Page 8: System Health
- Uptime and performance
- Error monitoring
- API usage statistics
- Cost tracking
- Database performance
- Third-party integrations status

### Page 9: Security Dashboard (already exists)
- Login attempts
- 2FA status
- Active sessions
- Suspicious activity
- Audit logs
- User management

### Page 10: Reports & Exports
- Report builder interface
- Saved reports library
- Scheduled reports
- White-label report templates
- Data export center

---

## 14. TECHNICAL IMPLEMENTATION NOTES

### 14.1 Cookie-less Tracking Implementation
```typescript
// Use browser fingerprinting + session storage
const generateFingerprint = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
    canvasFingerprint: generateCanvasFingerprint(),
  };
};

// Store in Supabase with anonymous ID
await supabase.from('visitor_sessions').insert({
  session_id: generateSessionId(),
  fingerprint_hash: hashFingerprint(fingerprint),
  // ... other data
});
```

### 14.2 Real-Time Data Streaming
```typescript
// Use Supabase Realtime for live updates
const subscription = supabase
  .channel('visitor_activity')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'visitor_sessions' },
    (payload) => {
      updateDashboard(payload);
    }
  )
  .subscribe();
```

### 14.3 Database Schema Additions
```sql
-- Visitor tracking
CREATE TABLE visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  fingerprint_hash TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  page_views INTEGER DEFAULT 1,
  total_time_seconds INTEGER DEFAULT 0,
  lead_score INTEGER DEFAULT 0,
  company_name TEXT,
  company_size TEXT,
  company_industry TEXT
);

-- Page views
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES visitor_sessions(session_id),
  page_url TEXT NOT NULL,
  page_title TEXT,
  time_on_page INTEGER,
  scroll_depth INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE visitor_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES visitor_sessions(session_id),
  event_type TEXT NOT NULL, -- 'click', 'form_submit', 'download', etc.
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES visitor_sessions(session_id),
  email TEXT,
  name TEXT,
  company TEXT,
  phone TEXT,
  message TEXT,
  source TEXT,
  lead_score INTEGER,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 14.4 Non-Public Security
```typescript
// robots.txt additions
User-agent: *
Disallow: /admin
Disallow: /admin-portal
Disallow: /dashboard
Disallow: /security
Disallow: /2fa-setup
Disallow: /admin-users
Disallow: /audit-logs

// Add meta tags to all admin pages
<meta name="robots" content="noindex, nofollow" />
<meta name="googlebot" content="noindex, nofollow" />
<meta name="bingbot" content="noindex, nofollow" />

// Middleware to check authentication
const requireAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    navigate('/admin-portal');
    return false;
  }
  return true;
};
```

---

## 15. LOVABLE IMPLEMENTATION PROMPTS

Use these prompts with Lovable to build specific features:

### Prompt 1: Visitor Tracking System
```
Build a cookie-less visitor tracking system using browser fingerprinting. Create a visitor_sessions table in Supabase to store anonymous visitor data including fingerprint hash, IP address, geographic location, device info, referrer, and UTM parameters. Implement real-time tracking of page views and events. Add a dashboard page showing live visitors on an interactive map, recent visitor list, and traffic source breakdown.
```

### Prompt 2: Lead Capture & Scoring
```
Create a comprehensive lead management system with automatic lead scoring. Build a leads table with contact information, source attribution, and score. Implement lead scoring algorithm based on pages visited, time on site, and company data. Create a leads dashboard with filterable lead list, lead profiles, source attribution charts, and hot leads requiring action.
```

### Prompt 3: Revenue Attribution
```
Build a revenue attribution system that tracks customer value from first touch through conversion. Create tables for tracking deals, opportunities, and revenue events. Implement attribution models (first-touch, last-touch, multi-touch). Create dashboards showing revenue by channel, ROI by campaign, sales pipeline visualization, and forecasting.
```

### Prompt 4: Real-Time Command Center
```
Create the main command center overview page with real-time updates. Show current active visitors count, live visitor map using Mapbox, today's key metrics cards, active campaign performance, and an alerts panel. Use Supabase Realtime for live data streaming without page refresh. Implement dark theme design similar to Bloomberg Terminal.
```

### Prompt 5: SEO Intelligence Dashboard
```
Build an SEO intelligence dashboard integrating Google Search Console data. Track keyword rankings over time, display Core Web Vitals trends, monitor backlinks, show technical SEO health scores, and compare performance against competitors. Include visual charts for impressions, clicks, CTR, and average position.
```

---

## 16. SUCCESS METRICS

After implementation, track these KPIs:

- **Dashboard Usage**: Daily active admins
- **Data Accuracy**: % of visitors successfully tracked
- **Lead Quality**: Lead-to-customer conversion rate
- **Attribution Accuracy**: % of revenue properly attributed
- **System Performance**: Dashboard load time < 2 seconds
- **Real-Time Latency**: Data updates within 5 seconds
- **Integration Uptime**: 99.9% availability for all integrations
- **User Satisfaction**: Admin user feedback and NPS score

---

## 17. FUTURE ENHANCEMENTS

Consider adding in future phases:

- **AI Chatbot for Queries**: "Show me top traffic sources this month"
- **Mobile Admin App**: Native iOS/Android apps
- **Voice Commands**: Alexa/Google Home integration
- **AR Dashboard**: Visualize data in augmented reality
- **Blockchain Analytics**: Track Web3 visitors and transactions
- **Influencer Tracking**: Track influencer referral performance
- **Podcast Analytics**: Track podcast listener attribution
- **Offline Event Tracking**: QR code and NFC tag attribution
- **Multi-Brand Management**: Manage multiple sites from one dashboard
- **API Marketplace**: Sell API access to your analytics data

---

## FINAL NOTES

This specification represents an enterprise-grade admin command center that would cost $100K+ to build custom. Every feature listed should provide actionable insights to grow the business. Focus on:

1. **Data Collection First**: Ensure all tracking is implemented properly
2. **Real-Time Updates**: Make the dashboard feel alive with live data
3. **Actionable Insights**: Every metric should suggest an action
4. **Beautiful Design**: Make it feel like a professional tool
5. **Security**: Keep all admin routes completely private and secure

Build this incrementally, starting with core visitor tracking and expanding to advanced features. Each dashboard page should be fully functional before moving to the next.
