// AI Visibility Marketing Microsite - Analytics & Attribution Tracking

// Calendly event types
type CalendlyEvent = {
  event: 'calendly.event_type_viewed' | 'calendly.date_and_time_selected' | 'calendly.event_scheduled';
  payload?: {
    event?: {
      uri?: string;
    };
    invitee?: {
      uri?: string;
      email?: string;
      name?: string;
    };
    event_type?: {
      name?: string;
    };
  };
};

// Initialize Calendly event listener
export const initCalendlyTracking = () => {
  if (typeof window === 'undefined') return;

  const handleCalendlyEvent = (e: MessageEvent) => {
    if (!e.data?.event?.startsWith('calendly.')) return;

    const calendlyEvent = e.data as CalendlyEvent;

    switch (calendlyEvent.event) {
      case 'calendly.event_type_viewed':
        pushEvent('calendly_widget_opened', {
          event_category: 'calendly',
          event_label: 'Widget Opened',
        });
        break;

      case 'calendly.date_and_time_selected':
        pushEvent('calendly_time_selected', {
          event_category: 'calendly',
          event_label: 'Time Selected',
        });
        break;

      case 'calendly.event_scheduled':
        // This is the conversion event!
        pushEvent('calendly_booking_complete', {
          event_category: 'conversion',
          event_label: 'Calendly Booking Complete',
          invitee_email: calendlyEvent.payload?.invitee?.email || '',
          invitee_name: calendlyEvent.payload?.invitee?.name || '',
          event_type: calendlyEvent.payload?.event_type?.name || '',
          value: 1,
          ...getStoredAttribution(),
        });

        // Also fire as a GA4 conversion
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'conversion', {
            send_to: 'G-2NHHE1D4WZ',
            event_category: 'conversion',
            event_label: 'Calendly Booking',
          });
        }
        break;
    }
  };

  window.addEventListener('message', handleCalendlyEvent);

  // Return cleanup function
  return () => window.removeEventListener('message', handleCalendlyEvent);
};
// Get URL parameters for attribution
export const getAttributionData = () => {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    landingPage: window.location.pathname,
    referrerUrl: document.referrer || '',
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmTerm: params.get('utm_term') || '',
    utmContent: params.get('utm_content') || '',
    ref: params.get('ref') || '', // AI referral tracking (chatgpt, claude, perplexity, gemini)
    timestamp: new Date().toISOString(),
  };
};

// Store attribution in session storage for persistence across page views
export const storeAttribution = () => {
  const attribution = getAttributionData();
  if (typeof window !== 'undefined' && !sessionStorage.getItem('mkt_attribution')) {
    sessionStorage.setItem('mkt_attribution', JSON.stringify(attribution));
  }
};

// Get stored attribution
export const getStoredAttribution = () => {
  if (typeof window === 'undefined') return {};
  const stored = sessionStorage.getItem('mkt_attribution');
  return stored ? JSON.parse(stored) : getAttributionData();
};

// Push event to dataLayer and GA4
const pushEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;
  
  // Push to dataLayer for GTM
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: eventName,
    ...params,
  });
  
  // Also send directly to GA4 via gtag
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', eventName, params);
  }
  
  console.log(`[Marketing Analytics] ${eventName}`, params);
};

// Event: CTA Book Call Click
export const trackBookCallClick = (placement: string) => {
  pushEvent('cta_book_call_click', {
    placement, // header, hero, scorecard, pricing, footer
    ...getStoredAttribution(),
  });
};

// Event: Scorecard Submit
export const trackScorecardSubmit = (formData: {
  websiteUrl: string;
  businessType: string;
  platform: string;
  city?: string;
  email: string;
  answers: Record<string, boolean>;
}) => {
  pushEvent('scorecard_submit', {
    business_type: formData.businessType,
    platform: formData.platform,
    city: formData.city || '',
    ...getStoredAttribution(),
  });
};

// Event: Scorecard Result View
export const trackScorecardResultView = (result: {
  overallGrade: string;
  scores: Record<string, number>;
}) => {
  pushEvent('scorecard_result_view', {
    overall_grade: result.overallGrade,
    ai_discoverability_score: result.scores.aiDiscoverability,
    structured_data_score: result.scores.structuredData,
    crawl_signals_score: result.scores.crawlSignals,
    tracking_score: result.scores.tracking,
    content_clarity_score: result.scores.contentClarity,
    ...getStoredAttribution(),
  });
};

// Event: Testimonial Video Play
export const trackVideoPlay = (videoTitle: string, videoLocation: string) => {
  pushEvent('testimonial_video_play', {
    video_title: videoTitle,
    video_location: videoLocation,
    ...getStoredAttribution(),
  });
};

// Event: Pricing Tier Click
export const trackPricingTierClick = (tier: string, price: string) => {
  pushEvent('pricing_tier_click', {
    tier,
    price,
    ...getStoredAttribution(),
  });
};

// Event: FAQ Open
export const trackFaqOpen = (question: string) => {
  pushEvent('faq_open', {
    question,
    ...getStoredAttribution(),
  });
};

// Event: Page View (for SPA navigation)
export const trackPageView = (page: string, title: string) => {
  pushEvent('page_view', {
    page_path: page,
    page_title: title,
    ...getStoredAttribution(),
  });
};

// Scorecard data model
export interface ScorecardSubmission {
  // Form inputs
  websiteUrl: string;
  businessType: string;
  platform: string;
  city: string;
  email: string;
  
  // Yes/No answers
  answers: {
    hasGoogleAnalytics: boolean;
    hasSearchConsole: boolean;
    hasFaqContent: boolean;
    hasAdvancedSchema: boolean;
    hasRobotsTxtStrategy: boolean;
    hasLlmsTxt: boolean;
  };
  
  // Calculated results
  results: {
    overallGrade: string;
    overallScore: number;
    scores: {
      aiDiscoverability: number;
      structuredData: number;
      crawlSignals: number;
      tracking: number;
      contentClarity: number;
    };
    topFixes: string[];
  };
  
  // Attribution
  attribution: ReturnType<typeof getStoredAttribution>;
  
  // Metadata
  submittedAt: string;
}

// Calculate scorecard results
export const calculateScorecardResults = (answers: ScorecardSubmission['answers']): ScorecardSubmission['results'] => {
  const scores = {
    aiDiscoverability: answers.hasLlmsTxt ? 100 : 20,
    structuredData: answers.hasAdvancedSchema ? 100 : (answers.hasFaqContent ? 50 : 20),
    crawlSignals: answers.hasRobotsTxtStrategy ? 100 : 40,
    tracking: (answers.hasGoogleAnalytics ? 50 : 0) + (answers.hasSearchConsole ? 50 : 0),
    contentClarity: answers.hasFaqContent ? 100 : 30,
  };
  
  const overallScore = Math.round(
    (scores.aiDiscoverability + scores.structuredData + scores.crawlSignals + scores.tracking + scores.contentClarity) / 5
  );
  
  const overallGrade = 
    overallScore >= 90 ? 'A' :
    overallScore >= 75 ? 'B' :
    overallScore >= 60 ? 'C' :
    overallScore >= 40 ? 'D' : 'F';
  
  // Generate top 3 fixes based on lowest scores
  const topFixes: string[] = [];
  
  if (!answers.hasLlmsTxt) {
    topFixes.push('Add an llms.txt file to help AI engines understand your business');
  }
  if (!answers.hasAdvancedSchema) {
    topFixes.push('Implement advanced structured data (schema) for your services and FAQs');
  }
  if (!answers.hasRobotsTxtStrategy) {
    topFixes.push('Optimize your robots.txt to guide AI and search crawlers effectively');
  }
  if (!answers.hasGoogleAnalytics) {
    topFixes.push('Set up Google Analytics to track visitor behavior and conversions');
  }
  if (!answers.hasSearchConsole) {
    topFixes.push('Connect Google Search Console to monitor search performance');
  }
  if (!answers.hasFaqContent) {
    topFixes.push('Add structured FAQ content to key pages for better AI extraction');
  }
  
  return {
    overallGrade,
    overallScore,
    scores,
    topFixes: topFixes.slice(0, 3),
  };
};

// Prepare submission payload for webhook
export const prepareScorecardPayload = (submission: ScorecardSubmission) => {
  return {
    ...submission,
    // Ready for webhook integration
    webhookType: 'scorecard_submission',
    version: '1.0',
  };
};
