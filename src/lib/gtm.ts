/**
 * Google Tag Manager Data Layer Helpers
 * Push custom events and data to GTM for tracking
 */

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Push a custom event to Google Tag Manager
 */
export const pushToDataLayer = (data: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

/**
 * Track page views
 */
export const trackPageView = (url: string, title: string) => {
  pushToDataLayer({
    event: 'pageview',
    page: {
      url,
      title,
    },
  });
};

/**
 * Track conversion events
 */
export const trackConversion = (eventName: string, data?: Record<string, any>) => {
  pushToDataLayer({
    event: eventName,
    ...data,
  });
};

/**
 * Track Calendly booking clicks
 */
export const trackCalendlyClick = (source: string, planType?: string) => {
  pushToDataLayer({
    event: 'calendly_click',
    eventCategory: 'conversion',
    eventAction: 'calendly_booking_click',
    eventLabel: source,
    planType: planType || 'unknown',
    conversionValue: 100,
  });
};

/**
 * Track demo/discovery call requests
 */
export const trackDemoRequest = (source: string) => {
  pushToDataLayer({
    event: 'demo_request',
    eventCategory: 'lead_generation',
    eventAction: 'demo_request',
    eventLabel: source,
    conversionValue: 1,
  });
};

/**
 * Track pricing page interactions
 */
export const trackPricingView = (planName: string, planPrice: string) => {
  pushToDataLayer({
    event: 'view_pricing',
    eventCategory: 'engagement',
    eventAction: 'pricing_card_view',
    eventLabel: planName,
    planName,
    planPrice,
  });
};

/**
 * Track CTA button clicks
 */
export const trackCTAClick = (ctaText: string, ctaLocation: string, ctaDestination: string) => {
  pushToDataLayer({
    event: 'cta_click',
    eventCategory: 'engagement',
    eventAction: 'button_click',
    eventLabel: ctaText,
    ctaLocation,
    ctaDestination,
  });
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (formName: string, formLocation: string) => {
  pushToDataLayer({
    event: 'form_submission',
    eventCategory: 'conversion',
    eventAction: 'form_submit',
    eventLabel: formName,
    formName,
    formLocation,
    conversionValue: 50,
  });
};

/**
 * Track video plays (Instagram embeds, etc.)
 */
export const trackVideoPlay = (videoTitle: string, videoLocation: string) => {
  pushToDataLayer({
    event: 'video_play',
    eventCategory: 'engagement',
    eventAction: 'video_start',
    eventLabel: videoTitle,
    videoTitle,
    videoLocation,
  });
};

/**
 * Track testimonial views
 */
export const trackTestimonialView = (testimonialAuthor: string) => {
  pushToDataLayer({
    event: 'testimonial_view',
    eventCategory: 'engagement',
    eventAction: 'testimonial_impression',
    eventLabel: testimonialAuthor,
  });
};

/**
 * Track example/case study views
 */
export const trackExampleView = (exampleTitle: string) => {
  pushToDataLayer({
    event: 'example_view',
    eventCategory: 'engagement',
    eventAction: 'case_study_view',
    eventLabel: exampleTitle,
  });
};

/**
 * Track scroll depth milestones
 */
export const trackScrollDepth = (percentage: number, page: string) => {
  pushToDataLayer({
    event: 'scroll_depth',
    eventCategory: 'engagement',
    eventAction: 'scroll',
    eventLabel: `${percentage}%`,
    scrollPercentage: percentage,
    page,
  });
};

/**
 * Track outbound link clicks
 */
export const trackOutboundClick = (linkUrl: string, linkText: string) => {
  pushToDataLayer({
    event: 'outbound_click',
    eventCategory: 'engagement',
    eventAction: 'external_link_click',
    eventLabel: linkUrl,
    linkUrl,
    linkText,
  });
};

/**
 * Track internal navigation
 */
export const trackInternalNavigation = (fromPage: string, toPage: string, linkText: string) => {
  pushToDataLayer({
    event: 'internal_navigation',
    eventCategory: 'navigation',
    eventAction: 'internal_link_click',
    eventLabel: linkText,
    fromPage,
    toPage,
    linkText,
  });
};

/**
 * Track user preferences (e.g., plan selection)
 */
export const trackUserPreference = (preferenceType: string, preferenceValue: string) => {
  pushToDataLayer({
    event: 'user_preference',
    eventCategory: 'user_behavior',
    eventAction: 'preference_selected',
    eventLabel: preferenceType,
    preferenceType,
    preferenceValue,
  });
};

/**
 * E-commerce tracking for virtual products/services
 */
export const trackProductView = (productName: string, productPrice: string, productCategory: string) => {
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: 'USD',
      value: parseFloat(productPrice.replace(/[^0-9.]/g, '')),
      items: [{
        item_name: productName,
        item_category: productCategory,
        price: parseFloat(productPrice.replace(/[^0-9.]/g, '')),
        quantity: 1,
      }],
    },
  });
};

/**
 * Track when user adds item to consideration (e.g., clicks "Learn More")
 */
export const trackAddToCart = (productName: string, productPrice: string) => {
  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'USD',
      value: parseFloat(productPrice.replace(/[^0-9.]/g, '')),
      items: [{
        item_name: productName,
        price: parseFloat(productPrice.replace(/[^0-9.]/g, '')),
        quantity: 1,
      }],
    },
  });
};

/**
 * Track checkout initiation (e.g., booking started)
 */
export const trackBeginCheckout = (productName: string, productPrice: string) => {
  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'USD',
      value: parseFloat(productPrice.replace(/[^0-9.]/g, '')),
      items: [{
        item_name: productName,
        price: parseFloat(productPrice.replace(/[^0-9.]/g, '')),
        quantity: 1,
      }],
    },
  });
};

/**
 * Track purchase completion (if you implement payments)
 */
export const trackPurchase = (
  transactionId: string,
  productName: string,
  productPrice: string,
  tax?: string,
  shipping?: string
) => {
  pushToDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: transactionId,
      currency: 'USD',
      value: parseFloat(productPrice.replace(/[^0-9.]/g, '')),
      tax: tax ? parseFloat(tax.replace(/[^0-9.]/g, '')) : 0,
      shipping: shipping ? parseFloat(shipping.replace(/[^0-9.]/g, '')) : 0,
      items: [{
        item_name: productName,
        price: parseFloat(productPrice.replace(/[^0-9.]/g, '')),
        quantity: 1,
      }],
    },
  });
};
