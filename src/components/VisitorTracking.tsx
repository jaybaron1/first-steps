/**
 * Galavanteer Visitor Tracking System
 * Cookie-less visitor intelligence with chatbot integration
 */

import { createClient } from "@supabase/supabase-js";

// Supabase client for tracking (use your actual credentials)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://pydbejawnenjqgnyyonf.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface VisitorSession {
  session_id: string;
  fingerprint_hash: string;
  ip_address: string;
  country: string | null;
  city: string | null;
  device_type: string;
  browser: string;
  os: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  entry_page: string;
  lead_score: number;
}

interface PageView {
  session_id: string;
  page_url: string;
  page_title: string;
  time_on_page: number;
  scroll_depth: number;
  referrer: string | null;
}

interface VisitorEvent {
  session_id: string;
  event_type: string;
  event_data: Record<string, any>;
}

interface ChatbotLead {
  session_id: string;
  name?: string;
  email?: string;
  phone?: string;
  trip_destination?: string;
  trip_dates?: string;
  budget_range?: string;
  group_size?: string;
  trip_occasion?: string;
  travel_style?: string;
  interests?: string[];
  message?: string;
  conversation_data?: Record<string, any>;
}

class VisitorTracker {
  private sessionId: string | null = null;
  private fingerprint: string | null = null;
  private pageLoadTime: number = Date.now();
  private maxScrollDepth: number = 0;
  private isTracking: boolean = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize tracking system
   */
  private async init() {
    if (this.isTracking) return;
    this.isTracking = true;

    // Generate or retrieve session
    await this.initSession();

    // Track page view
    await this.trackPageView();

    // Set up event listeners
    this.setupListeners();
  }

  /**
   * Generate browser fingerprint (cookie-less)
   */
  private async generateFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      navigator.hardwareConcurrency || "unknown",
      navigator.deviceMemory || "unknown",
    ];

    // Add canvas fingerprint
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillText("Galavanteer", 2, 2);
      components.push(canvas.toDataURL());
    }

    const componentString = components.join("|||");
    const fingerprint = await this.hashString(componentString);

    return fingerprint;
  }

  /**
   * Hash string using SubtleCrypto
   */
  private async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }

  /**
   * Initialize or retrieve session
   */
  private async initSession() {
    // Check if session exists in sessionStorage
    this.sessionId = sessionStorage.getItem("galavanteer_session_id");
    this.fingerprint = sessionStorage.getItem("galavanteer_fingerprint");

    if (!this.sessionId || !this.fingerprint) {
      // Generate new session
      this.fingerprint = await this.generateFingerprint();
      this.sessionId = `${this.fingerprint}-${Date.now()}`;

      sessionStorage.setItem("galavanteer_session_id", this.sessionId);
      sessionStorage.setItem("galavanteer_fingerprint", this.fingerprint);

      // Create session in database
      await this.createSession();
    }
  }

  /**
   * Create new visitor session in database
   */
  private async createSession() {
    try {
      const sessionData: Partial<VisitorSession> = {
        session_id: this.sessionId!,
        fingerprint_hash: this.fingerprint!,
        ip_address: await this.getIPAddress(),
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        referrer: document.referrer || null,
        ...this.getUTMParameters(),
        entry_page: window.location.href,
        lead_score: 0,
      };

      // Get location from IP (will be filled by Supabase Edge Function or external service)
      const location = await this.getLocation();
      if (location) {
        sessionData.country = location.country;
        sessionData.city = location.city;
      }

      const { error } = await supabase.from("visitor_sessions").insert(sessionData);

      if (error) {
        console.error("Error creating session:", error);
      }
    } catch (error) {
      console.error("Error in createSession:", error);
    }
  }

  /**
   * Track page view
   */
  private async trackPageView() {
    if (!this.sessionId) return;

    this.pageLoadTime = Date.now();

    try {
      const { error } = await supabase.from("page_views").insert({
        session_id: this.sessionId,
        page_url: window.location.href,
        page_title: document.title,
        referrer: document.referrer || null,
        time_on_page: 0,
        scroll_depth: 0,
      });

      if (error) {
        console.error("Error tracking page view:", error);
      }

      // Update lead score based on page type
      this.updateLeadScore();
    } catch (error) {
      console.error("Error in trackPageView:", error);
    }
  }

  /**
   * Update time on page and scroll depth on page unload
   */
  private async updatePageMetrics() {
    if (!this.sessionId) return;

    const timeOnPage = Math.floor((Date.now() - this.pageLoadTime) / 1000);

    try {
      const { error } = await supabase
        .from("page_views")
        .update({
          time_on_page: timeOnPage,
          scroll_depth: this.maxScrollDepth,
        })
        .eq("session_id", this.sessionId)
        .eq("page_url", window.location.href)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error updating page metrics:", error);
      }
    } catch (error) {
      console.error("Error in updatePageMetrics:", error);
    }
  }

  /**
   * Track custom event
   */
  public async trackEvent(eventType: string, eventData?: Record<string, any>) {
    if (!this.sessionId) return;

    try {
      const { error } = await supabase.from("visitor_events").insert({
        session_id: this.sessionId,
        event_type: eventType,
        event_data: eventData || {},
      });

      if (error) {
        console.error("Error tracking event:", error);
      }

      // Update lead score for important events
      if (["download", "video_play", "form_start"].includes(eventType)) {
        this.updateLeadScore(5);
      }
    } catch (error) {
      console.error("Error in trackEvent:", error);
    }
  }

  /**
   * Capture chatbot lead (identity capture)
   */
  public async captureChatbotLead(leadData: Partial<ChatbotLead>) {
    if (!this.sessionId) return;

    try {
      const { error } = await supabase.from("leads").insert({
        session_id: this.sessionId,
        email: leadData.email || null,
        name: leadData.name || null,
        phone: leadData.phone || null,
        company: null,
        message: leadData.message || null,
        source: "chatbot",
        lead_score: await this.calculateLeadScore(leadData),
        status: "new",
        // Store all chatbot data in a JSONB field
        metadata: {
          trip_destination: leadData.trip_destination,
          trip_dates: leadData.trip_dates,
          budget_range: leadData.budget_range,
          group_size: leadData.group_size,
          trip_occasion: leadData.trip_occasion,
          travel_style: leadData.travel_style,
          interests: leadData.interests,
          conversation_data: leadData.conversation_data,
        },
      });

      if (error) {
        console.error("Error capturing chatbot lead:", error);
        return false;
      }

      // Update session lead score
      const leadScore = await this.calculateLeadScore(leadData);
      await supabase.from("visitor_sessions").update({ lead_score: leadScore }).eq("session_id", this.sessionId);

      // Track conversion event
      await this.trackEvent("chatbot_lead_captured", {
        has_email: !!leadData.email,
        has_phone: !!leadData.phone,
        destination: leadData.trip_destination,
      });

      return true;
    } catch (error) {
      console.error("Error in captureChatbotLead:", error);
      return false;
    }
  }

  /**
   * Calculate lead score based on behavior and data provided
   */
  private async calculateLeadScore(leadData?: Partial<ChatbotLead>): Promise<number> {
    let score = 0;

    // Base score for providing contact info
    if (leadData?.email) score += 20;
    if (leadData?.phone) score += 15;
    if (leadData?.name) score += 10;

    // Trip details indicate intent
    if (leadData?.trip_destination) score += 10;
    if (leadData?.trip_dates) score += 15; // Has specific dates = serious
    if (leadData?.budget_range) score += 10;

    // Get behavioral score from page views
    const { count: pageViewCount } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .eq("session_id", this.sessionId!);

    score += Math.min((pageViewCount || 0) * 3, 20); // Max 20 points from page views

    // Check for high-intent pages
    const { data: highIntentPages } = await supabase
      .from("page_views")
      .select("page_url")
      .eq("session_id", this.sessionId!)
      .or("page_url.ilike.%pricing%,page_url.ilike.%booking%,page_url.ilike.%contact%");

    if (highIntentPages && highIntentPages.length > 0) {
      score += 15;
    }

    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Update lead score based on page viewed
   */
  private async updateLeadScore(additionalPoints: number = 0) {
    if (!this.sessionId) return;

    const url = window.location.href.toLowerCase();
    let points = additionalPoints;

    // High-value pages
    if (url.includes("pricing")) points += 15;
    if (url.includes("booking") || url.includes("book")) points += 20;
    if (url.includes("contact")) points += 10;
    if (url.includes("testimonial") || url.includes("review")) points += 5;

    // Destination pages
    if (url.includes("italy") || url.includes("france") || url.includes("spain")) points += 3;

    if (points > 0) {
      try {
        const { data: session } = await supabase
          .from("visitor_sessions")
          .select("lead_score")
          .eq("session_id", this.sessionId)
          .single();

        const currentScore = session?.lead_score || 0;
        const newScore = Math.min(currentScore + points, 100);

        await supabase.from("visitor_sessions").update({ lead_score: newScore }).eq("session_id", this.sessionId);
      } catch (error) {
        console.error("Error updating lead score:", error);
      }
    }
  }

  /**
   * Set up event listeners
   */
  private setupListeners() {
    // Track scroll depth
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPercentage = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
          );
          this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercentage);
          ticking = false;
        });
        ticking = true;
      }
    });

    // Track time on page when leaving
    window.addEventListener("beforeunload", () => {
      this.updatePageMetrics();
    });

    // Track visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.updatePageMetrics();
      }
    });

    // Track clicks on important elements
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      // Track CTA clicks
      if (target.matches("[data-track-cta]")) {
        this.trackEvent("cta_click", {
          cta_text: target.textContent,
          cta_location: target.getAttribute("data-track-cta"),
        });
      }

      // Track download clicks
      if (target.matches('a[href*=".pdf"]')) {
        this.trackEvent("pdf_download", {
          file_name: target.getAttribute("href"),
        });
      }
    });
  }

  /**
   * Helper: Get device type
   */
  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)
    ) {
      return "mobile";
    }
    return "desktop";
  }

  /**
   * Helper: Get browser
   */
  private getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("SamsungBrowser")) return "Samsung Internet";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    if (ua.includes("Trident")) return "IE";
    if (ua.includes("Edge")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    return "Unknown";
  }

  /**
   * Helper: Get operating system
   */
  private getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Win")) return "Windows";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("X11") || ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Unknown";
  }

  /**
   * Helper: Get UTM parameters
   */
  private getUTMParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_term: params.get("utm_term"),
      utm_content: params.get("utm_content"),
    };
  }

  /**
   * Helper: Get IP address and location
   */
  private async getIPAddress(): Promise<string> {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch {
      return "unknown";
    }
  }

  /**
   * Helper: Get geographic location from IP
   */
  private async getLocation(): Promise<{ country: string; city: string } | null> {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return {
        country: data.country_name,
        city: data.city,
      };
    } catch {
      return null;
    }
  }

  /**
   * Public method to get current session ID
   */
  public getSessionId(): string | null {
    return this.sessionId;
  }
}

// Create singleton instance
const tracker = new VisitorTracker();

// Export public API
export const visitorTracking = {
  trackEvent: (eventType: string, eventData?: Record<string, any>) => tracker.trackEvent(eventType, eventData),

  captureChatbotLead: (leadData: Partial<ChatbotLead>) => tracker.captureChatbotLead(leadData),

  getSessionId: () => tracker.getSessionId(),
};

export default visitorTracking;
