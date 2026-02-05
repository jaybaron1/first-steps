 /**
  * Section-Level Engagement Tracking
  * Uses IntersectionObserver to track how long users focus on each section
  */
 
 import { trackingSupabase } from "@/lib/trackingBackend";
 
 interface SectionState {
   sectionId: string;
   enteredAt: number;
   entryScrollDepth: number;
 }
 
 // Map section IDs to friendly names
 export const SECTION_NAMES: Record<string, string> = {
   "hero": "Hero",
   "the-problem": "The Problem",
   "reframe": "The Possibility",
   "reveal": "The Roundtable",
   "comparison": "ChatGPT vs Roundtable",
   "video-testimonials": "Video Testimonials",
   "testimonials": "Written Testimonials",
   "pricing": "Pricing Tiers",
   "final-cta": "Final CTA",
   // Marketing subdomain sections
   "marketing-hero": "Marketing Hero",
   "credibility": "Credibility Strip",
   "why": "Why AI Visibility",
   "scorecard": "Visibility Scorecard",
   "deliverables": "Deliverables",
   "proof": "Social Proof",
   "how-it-works-marketing": "How It Works",
   "marketing-pricing": "Marketing Pricing",
   "faq": "FAQ",
   "marketing-cta": "Marketing CTA",
 };
 
 class SectionTracker {
   private observer: IntersectionObserver | null = null;
   private activeSections: Map<string, SectionState> = new Map();
   private isInitialized: boolean = false;
 
   constructor() {
     if (typeof window !== "undefined") {
       // Wait for DOM to be ready
       if (document.readyState === "loading") {
         document.addEventListener("DOMContentLoaded", () => this.init());
       } else {
         // Small delay to ensure sections are rendered
         setTimeout(() => this.init(), 100);
       }
     }
   }
 
   private init() {
     if (this.isInitialized) return;
     
     // Skip admin routes
     if (window.location.pathname.startsWith("/admin")) {
       return;
     }
 
     this.isInitialized = true;
     this.setupObserver();
     this.setupUnloadHandler();
     
     console.log("[SectionTracking] Initialized");
   }
 
   private getSessionId(): string | null {
     return sessionStorage.getItem("galavanteer_session_id");
   }
 
   private getCurrentScrollDepth(): number {
     const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
     if (scrollHeight <= 0) return 100;
     return Math.round((window.scrollY / scrollHeight) * 100);
   }
 
   private setupObserver() {
     // Observe elements that are at least 50% visible
     this.observer = new IntersectionObserver(
       (entries) => {
         entries.forEach((entry) => {
           const sectionId = (entry.target as HTMLElement).dataset.section;
           if (!sectionId) return;
 
           if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
             this.handleSectionEnter(sectionId);
           } else if (!entry.isIntersecting && this.activeSections.has(sectionId)) {
             this.handleSectionExit(sectionId);
           }
         });
       },
       {
         threshold: [0, 0.5, 1],
         rootMargin: "0px",
       }
     );
 
     // Find and observe all sections with data-section attribute
     this.observeSections();
     
     // Re-observe on route changes (for SPAs)
     this.setupRouteChangeListener();
   }
 
   private observeSections() {
     const sections = document.querySelectorAll("[data-section]");
     sections.forEach((section) => {
       this.observer?.observe(section);
     });
     console.log(`[SectionTracking] Observing ${sections.length} sections`);
   }
 
   private setupRouteChangeListener() {
     // Listen for popstate (back/forward navigation)
     window.addEventListener("popstate", () => {
       setTimeout(() => this.observeSections(), 200);
     });
 
     // Use MutationObserver to detect new sections added to DOM
     const mutationObserver = new MutationObserver((mutations) => {
       let hasNewSections = false;
       mutations.forEach((mutation) => {
         mutation.addedNodes.forEach((node) => {
           if (node instanceof HTMLElement) {
             if (node.dataset?.section) {
               this.observer?.observe(node);
               hasNewSections = true;
             }
             // Also check children
             const childSections = node.querySelectorAll?.("[data-section]");
             childSections?.forEach((section) => {
               this.observer?.observe(section);
               hasNewSections = true;
             });
           }
         });
       });
       if (hasNewSections) {
         console.log("[SectionTracking] New sections detected and observed");
       }
     });
 
     mutationObserver.observe(document.body, {
       childList: true,
       subtree: true,
     });
   }
 
   private handleSectionEnter(sectionId: string) {
     // Don't double-track
     if (this.activeSections.has(sectionId)) return;
 
     const state: SectionState = {
       sectionId,
       enteredAt: Date.now(),
       entryScrollDepth: this.getCurrentScrollDepth(),
     };
 
     this.activeSections.set(sectionId, state);
 
     // Fire impression event
     this.trackSectionView(sectionId);
     
     console.log(`[SectionTracking] Entered: ${sectionId}`);
   }
 
   private async handleSectionExit(sectionId: string) {
     const state = this.activeSections.get(sectionId);
     if (!state) return;
 
     this.activeSections.delete(sectionId);
 
     const focusDuration = Math.floor((Date.now() - state.enteredAt) / 1000);
     const exitScrollDepth = this.getCurrentScrollDepth();
 
     // Record to database
     await this.recordSectionEngagement(
       sectionId,
       focusDuration,
       state.entryScrollDepth,
       exitScrollDepth,
       new Date(state.enteredAt).toISOString()
     );
 
     console.log(`[SectionTracking] Exited: ${sectionId} (${focusDuration}s focus)`);
   }
 
   private async trackSectionView(sectionId: string) {
     const sessionId = this.getSessionId();
     if (!sessionId) return;
 
     try {
       await trackingSupabase.from("visitor_events").insert({
         session_id: sessionId,
         event_type: "section_view",
         event_data: {
           section_id: sectionId,
           section_name: SECTION_NAMES[sectionId] || sectionId,
           page_url: window.location.pathname,
         },
       });
     } catch (error) {
       console.error("[SectionTracking] Error tracking section view:", error);
     }
   }
 
   private async recordSectionEngagement(
     sectionId: string,
     focusDuration: number,
     entryScrollDepth: number,
     exitScrollDepth: number,
     enteredAt: string
   ) {
     const sessionId = this.getSessionId();
     if (!sessionId) return;
 
     try {
       await trackingSupabase.from("section_engagement").insert({
         session_id: sessionId,
         section_id: sectionId,
         page_url: window.location.pathname,
         focus_duration_seconds: focusDuration,
         entry_scroll_depth: entryScrollDepth,
         exit_scroll_depth: exitScrollDepth,
         entered_at: enteredAt,
         exited_at: new Date().toISOString(),
       });
     } catch (error) {
       console.error("[SectionTracking] Error recording engagement:", error);
     }
   }
 
   private setupUnloadHandler() {
     // Flush any currently visible sections on page unload
     const flushActiveSections = () => {
       this.activeSections.forEach((state, sectionId) => {
         const focusDuration = Math.floor((Date.now() - state.enteredAt) / 1000);
         const exitScrollDepth = this.getCurrentScrollDepth();
 
         // Use sendBeacon for reliability on page unload
         const payload = {
           session_id: this.getSessionId(),
           section_id: sectionId,
           page_url: window.location.pathname,
           focus_duration_seconds: focusDuration,
           entry_scroll_depth: state.entryScrollDepth,
           exit_scroll_depth: exitScrollDepth,
           entered_at: new Date(state.enteredAt).toISOString(),
           exited_at: new Date().toISOString(),
         };
 
         // Try sendBeacon first (most reliable for unload)
         if (navigator.sendBeacon) {
           const url = `https://pydbejawnenjqgnyyonf.supabase.co/rest/v1/section_engagement`;
           const headers = {
             apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZGJlamF3bmVuanFnbnl5b25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzI2MzcsImV4cCI6MjA4NTc0ODYzN30.7of37Fz2TKO0NMKtt3kZ2zGLdavsCyAiG9GxBvlirH4",
             "Content-Type": "application/json",
             Prefer: "return=minimal",
           };
 
           const blob = new Blob([JSON.stringify(payload)], {
             type: "application/json",
           });
           
           // Create URL with headers as query params isn't standard, use fetch keepalive instead
           fetch(url, {
             method: "POST",
             headers,
             body: JSON.stringify(payload),
             keepalive: true,
           }).catch(() => {});
         }
       });
 
       this.activeSections.clear();
     };
 
     window.addEventListener("beforeunload", flushActiveSections);
     document.addEventListener("visibilitychange", () => {
       if (document.hidden) {
         flushActiveSections();
       }
     });
   }
 }
 
 // Create singleton instance
 const sectionTracking = new SectionTracker();
 
 export default sectionTracking;