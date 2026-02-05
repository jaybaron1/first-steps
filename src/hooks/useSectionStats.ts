 /**
  * Hook for fetching section engagement statistics
  */
 
 import { useState, useEffect } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { SECTION_NAMES } from "@/lib/sectionTracking";
 
 export interface SectionStat {
   section_id: string;
   section_name: string;
   impressions: number;
   total_focus_time: number;
   avg_focus_seconds: number;
   drop_off_rate: number;
   engagement_score: "high" | "medium" | "low";
 }
 
 export interface SectionFlowStep {
   section_id: string;
   section_name: string;
   reach_percentage: number;
   visitors_count: number;
 }
 
 export interface SectionSummary {
   mostEngaging: { section: string; avgFocus: number } | null;
   dropOffPoint: { section: string; rate: number } | null;
   hiddenGem: { section: string; impressions: number; avgFocus: number } | null;
 }
 
 export function useSectionStats(days: number = 30) {
   const [sections, setSections] = useState<SectionStat[]>([]);
   const [flow, setFlow] = useState<SectionFlowStep[]>([]);
   const [summary, setSummary] = useState<SectionSummary>({
     mostEngaging: null,
     dropOffPoint: null,
     hiddenGem: null,
   });
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     fetchSectionStats();
   }, [days]);
 
   async function fetchSectionStats() {
     setLoading(true);
 
     const startDate = new Date();
     startDate.setDate(startDate.getDate() - days);
 
     try {
       // Fetch section engagement data
       const { data: engagementData, error: engagementError } = await supabase
         .from("section_engagement")
         .select("section_id, focus_duration_seconds, session_id")
         .gte("created_at", startDate.toISOString());
 
       if (engagementError) throw engagementError;
 
       // Fetch section view events for impressions
       const { data: viewData, error: viewError } = await supabase
         .from("visitor_events")
         .select("event_data, session_id")
         .eq("event_type", "section_view")
         .gte("created_at", startDate.toISOString());
 
       if (viewError) throw viewError;
 
       // Get total unique sessions for calculating drop-off
       const { data: sessionData, error: sessionError } = await supabase
         .from("visitor_sessions")
         .select("session_id")
         .gte("created_at", startDate.toISOString());
 
       if (sessionError) throw sessionError;
 
       const totalSessions = new Set(sessionData?.map((s) => s.session_id)).size;
 
       // Aggregate by section
       const sectionMap = new Map<string, {
         totalFocus: number;
         count: number;
         sessions: Set<string>;
         impressions: number;
       }>();
 
       // Process engagement data
       engagementData?.forEach((row) => {
         const sectionId = row.section_id;
         if (!sectionMap.has(sectionId)) {
           sectionMap.set(sectionId, {
             totalFocus: 0,
             count: 0,
             sessions: new Set(),
             impressions: 0,
           });
         }
         const stat = sectionMap.get(sectionId)!;
         stat.totalFocus += row.focus_duration_seconds || 0;
         stat.count += 1;
         if (row.session_id) stat.sessions.add(row.session_id);
       });
 
       // Process view data for impressions
       viewData?.forEach((row) => {
         const eventData = row.event_data as { section_id?: string } | null;
         const sectionId = eventData?.section_id;
         if (!sectionId) return;
 
         if (!sectionMap.has(sectionId)) {
           sectionMap.set(sectionId, {
             totalFocus: 0,
             count: 0,
             sessions: new Set(),
             impressions: 0,
           });
         }
         sectionMap.get(sectionId)!.impressions += 1;
       });
 
       // Convert to array and calculate metrics
       const sectionStats: SectionStat[] = [];
 
       sectionMap.forEach((stat, sectionId) => {
         const avgFocus = stat.count > 0 ? Math.round(stat.totalFocus / stat.count) : 0;
         const reachRate = totalSessions > 0 ? (stat.sessions.size / totalSessions) * 100 : 0;
         const dropOffRate = 100 - reachRate;
 
         // Determine engagement score
         let engagementScore: "high" | "medium" | "low" = "low";
         if (avgFocus >= 30) engagementScore = "high";
         else if (avgFocus >= 15) engagementScore = "medium";
 
         sectionStats.push({
           section_id: sectionId,
           section_name: SECTION_NAMES[sectionId] || sectionId,
           impressions: stat.impressions,
           total_focus_time: stat.totalFocus,
           avg_focus_seconds: avgFocus,
           drop_off_rate: Math.round(dropOffRate),
           engagement_score: engagementScore,
         });
       });
 
       // Sort by impressions (most viewed first)
       sectionStats.sort((a, b) => b.impressions - a.impressions);
 
       setSections(sectionStats);
 
       // Calculate flow (ordered by typical page position)
       const orderedSections = [
         "hero", "the-problem", "reframe", "reveal", "comparison",
         "video-testimonials", "testimonials", "pricing", "final-cta"
       ];
 
       const flowSteps: SectionFlowStep[] = orderedSections
         .filter((id) => sectionMap.has(id))
         .map((id) => {
           const stat = sectionMap.get(id)!;
           return {
             section_id: id,
             section_name: SECTION_NAMES[id] || id,
             reach_percentage: totalSessions > 0 
               ? Math.round((stat.sessions.size / totalSessions) * 100) 
               : 0,
             visitors_count: stat.sessions.size,
           };
         });
 
       setFlow(flowSteps);
 
       // Calculate summary insights
       const sortedByAvgFocus = [...sectionStats].sort(
         (a, b) => b.avg_focus_seconds - a.avg_focus_seconds
       );
       
       const mostEngaging = sortedByAvgFocus[0]
         ? { section: sortedByAvgFocus[0].section_name, avgFocus: sortedByAvgFocus[0].avg_focus_seconds }
         : null;
 
       // Find biggest drop-off between consecutive sections
       let maxDropOff = { section: "", rate: 0 };
       for (let i = 1; i < flowSteps.length; i++) {
         const dropOff = flowSteps[i - 1].reach_percentage - flowSteps[i].reach_percentage;
         if (dropOff > maxDropOff.rate) {
           maxDropOff = { section: flowSteps[i - 1].section_name, rate: dropOff };
         }
       }
 
       // Hidden gem: low impressions but high engagement when viewed
       const hiddenGem = sectionStats
         .filter((s) => s.impressions > 0 && s.impressions < (sectionStats[0]?.impressions || 0) * 0.5)
         .sort((a, b) => b.avg_focus_seconds - a.avg_focus_seconds)[0];
 
       setSummary({
         mostEngaging,
         dropOffPoint: maxDropOff.rate > 0 ? maxDropOff : null,
         hiddenGem: hiddenGem
           ? {
               section: hiddenGem.section_name,
               impressions: hiddenGem.impressions,
               avgFocus: hiddenGem.avg_focus_seconds,
             }
           : null,
       });
 
     } catch (error) {
       console.error("Error fetching section stats:", error);
     } finally {
       setLoading(false);
     }
   }
 
   return { sections, flow, summary, loading };
 }