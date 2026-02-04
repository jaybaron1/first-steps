/**
 * Galavanteer Visitor Tracking System
 * Cookie-less visitor intelligence with chatbot integration
 */

import { trackingSupabase } from "@/lib/trackingBackend";

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
    // Auto-initialize when imported
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private async init() {
    if (this.isTracking) return;
    
    // Skip admin routes
    if (window.location.pathname.startsWith('/admin')) {
      return;
    }
    
    this.isTracking = true;

    await this.initSession();
    await this.trackPageView();
    this.setupListeners();
  }

  private async generateFingerprint(): Promise<string> {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      navigator.hardwareConcurrency || "unknown",
      nav.deviceMemory || "unknown",
    ];

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillText("Galavanteer", 2, 2);
      components.push(canvas.toDataURL());
    }

    const componentString = components.join("|||");
    return await this.hashString(componentString);
  }

  private async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  private async initSession() {
    this.sessionId = sessionStorage.getItem("galavanteer_session_id");
    this.fingerprint = sessionStorage.getItem("galavanteer_fingerprint");

    if (!this.sessionId || !this.fingerprint) {
      this.fingerprint = await this.generateFingerprint();
      this.sessionId = `${this.fingerprint}-${Date.now()}`;

      sessionStorage.setItem("galavanteer_session_id", this.sessionId);
      sessionStorage.setItem("galavanteer_fingerprint", this.fingerprint);

      await this.createSession();
    }
  }

  private async createSession() {
    try {
      const utmParams = this.getUTMParameters();
      const screenInfo = this.getScreenInfo();
      const { error } = await trackingSupabase.from("visitor_sessions").insert([{
        session_id: this.sessionId!,
        fingerprint_hash: this.fingerprint!,
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        referrer: document.referrer || null,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
        screen_resolution: screenInfo.screen_resolution,
        viewport_size: screenInfo.viewport_size,
        timezone: screenInfo.timezone,
        language: screenInfo.language,
        lead_score: 0,
      }]);
      if (error) console.error("Error creating session:", error);
    } catch (error) {
      console.error("Error in createSession:", error);
    }
  }

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

  private getScreenInfo() {
    return {
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    };
  }

  private async trackPageView() {
    if (!this.sessionId) return;
    this.pageLoadTime = Date.now();

    try {
      const { error } = await trackingSupabase.from("page_views").insert({
        session_id: this.sessionId,
        page_url: window.location.href,
        page_title: document.title,
        time_on_page: 0,
        scroll_depth: 0,
      });
      if (error) console.error("Error tracking page view:", error);
    } catch (error) {
      console.error("Error in trackPageView:", error);
    }
  }

  private async updatePageMetrics() {
    if (!this.sessionId) return;
    const timeOnPage = Math.floor((Date.now() - this.pageLoadTime) / 1000);

    try {
      await trackingSupabase
        .from("page_views")
        .update({ time_on_page: timeOnPage, scroll_depth: this.maxScrollDepth })
        .eq("session_id", this.sessionId)
        .eq("page_url", window.location.href)
        .order("created_at", { ascending: false })
        .limit(1);
    } catch (error) {
      console.error("Error in updatePageMetrics:", error);
    }
  }

  public async trackEvent(eventType: string, eventData?: Record<string, any>) {
    if (!this.sessionId) return;

    try {
      const { error } = await trackingSupabase.from("visitor_events").insert({
        session_id: this.sessionId,
        event_type: eventType,
        event_data: eventData || {},
      });
      if (error) console.error("Error tracking event:", error);
    } catch (error) {
      console.error("Error in trackEvent:", error);
    }
  }

  public async captureChatbotLead(leadData: Partial<ChatbotLead>) {
    if (!this.sessionId) return false;

    try {
      const { error } = await trackingSupabase.from("leads").insert({
        session_id: this.sessionId,
        email: leadData.email || null,
        name: leadData.name || null,
        phone: leadData.phone || null,
        message: leadData.message || null,
        source: "chatbot",
        status: "new",
      });

      if (error) {
        console.error("Error capturing chatbot lead:", error);
        return false;
      }

      await this.trackEvent("chatbot_lead_captured", {
        has_email: !!leadData.email,
        has_phone: !!leadData.phone,
      });

      return true;
    } catch (error) {
      console.error("Error in captureChatbotLead:", error);
      return false;
    }
  }

  private setupListeners() {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPercentage = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
          );
          this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercentage);
          ticking = false;
        });
        ticking = true;
      }
    });

    window.addEventListener("beforeunload", () => {
      this.updatePageMetrics();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.updatePageMetrics();
      }
    });

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.matches("[data-track-cta]")) {
        this.trackEvent("cta_click", {
          cta_text: target.textContent,
          cta_location: target.getAttribute("data-track-cta"),
        });
      }
    });
  }

  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
    return "desktop";
  }

  private getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("SamsungBrowser")) return "Samsung Internet";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    if (ua.includes("Edge")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    return "Unknown";
  }

  private getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Win")) return "Windows";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Unknown";
  }

  public getSessionId(): string {
    return this.sessionId || "";
  }
}

// Create singleton instance
const visitorTracking = new VisitorTracker();

export default visitorTracking;
export type { ChatbotLead };
