 import React, { useState } from "react";
 import { Clock, Eye, TrendingDown, ArrowUpDown } from "lucide-react";
 import type { SectionStat } from "@/hooks/useSectionStats";
 
 interface Props {
   sections: SectionStat[];
   loading: boolean;
 }
 
 type SortKey = "impressions" | "total_focus_time" | "avg_focus_seconds" | "drop_off_rate";
 
 const SectionEngagementTable: React.FC<Props> = ({ sections, loading }) => {
   const [sortKey, setSortKey] = useState<SortKey>("impressions");
   const [sortAsc, setSortAsc] = useState(false);
 
   const handleSort = (key: SortKey) => {
     if (sortKey === key) {
       setSortAsc(!sortAsc);
     } else {
       setSortKey(key);
       setSortAsc(false);
     }
   };
 
   const sortedSections = [...sections].sort((a, b) => {
     const aVal = a[sortKey];
     const bVal = b[sortKey];
     return sortAsc ? aVal - bVal : bVal - aVal;
   });
 
   const formatTime = (seconds: number): string => {
     if (seconds < 60) return `${seconds}s`;
     const mins = Math.floor(seconds / 60);
     const secs = seconds % 60;
     return `${mins}m ${secs}s`;
   };
 
   const formatTotalTime = (seconds: number): string => {
     if (seconds < 60) return `${seconds}s`;
     if (seconds < 3600) {
       const mins = Math.floor(seconds / 60);
       return `${mins}m`;
     }
     const hours = Math.floor(seconds / 3600);
     const mins = Math.floor((seconds % 3600) / 60);
     return `${hours}h ${mins}m`;
   };
 
   const getEngagementBadge = (score: "high" | "medium" | "low") => {
     const styles = {
       high: "bg-emerald-50 text-emerald-700 border-emerald-200",
       medium: "bg-amber-50 text-amber-700 border-amber-200",
       low: "bg-slate-50 text-slate-600 border-slate-200",
     };
     const icons = {
       high: "🔥",
       medium: "⚡",
       low: "❄️",
     };
     return (
       <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${styles[score]}`}>
         <span>{icons[score]}</span>
         <span className="capitalize">{score}</span>
       </span>
     );
   };
 
   if (loading) {
     return (
       <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
         <div className="animate-pulse space-y-4">
           <div className="h-6 bg-gray-200 rounded w-1/3" />
           <div className="space-y-3">
             {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="h-12 bg-gray-100 rounded" />
             ))}
           </div>
         </div>
       </div>
     );
   }
 
   if (sections.length === 0) {
     return (
       <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-8 shadow-lg text-center">
         <Eye className="w-12 h-12 mx-auto text-[#B8956C]/30 mb-3" />
         <h3 className="font-medium text-[#1A1915] mb-1">No section data yet</h3>
         <p className="text-sm text-[#8C857A]">
           Section engagement data will appear here once visitors start browsing your site.
         </p>
       </div>
     );
   }
 
   return (
     <div className="bg-white border border-[#B8956C]/20 rounded-2xl shadow-lg overflow-hidden">
       <div className="p-4 border-b border-[#B8956C]/10">
         <h3 className="font-medium text-[#1A1915] flex items-center gap-2">
           <Eye className="w-4 h-4 text-[#B8956C]" />
           Section Engagement
         </h3>
       </div>
 
       <div className="overflow-x-auto">
         <table className="w-full text-sm">
           <thead>
             <tr className="bg-[#F9F6F0]/50 text-left">
               <th className="px-4 py-3 font-medium text-[#8C857A]">Section</th>
               <th
                 className="px-4 py-3 font-medium text-[#8C857A] cursor-pointer hover:text-[#1A1915]"
                 onClick={() => handleSort("impressions")}
               >
                 <span className="flex items-center gap-1">
                   Impressions
                   <ArrowUpDown className="w-3 h-3" />
                 </span>
               </th>
               <th
                 className="px-4 py-3 font-medium text-[#8C857A] cursor-pointer hover:text-[#1A1915]"
                 onClick={() => handleSort("total_focus_time")}
               >
                 <span className="flex items-center gap-1">
                   Total Focus
                   <ArrowUpDown className="w-3 h-3" />
                 </span>
               </th>
               <th
                 className="px-4 py-3 font-medium text-[#8C857A] cursor-pointer hover:text-[#1A1915]"
                 onClick={() => handleSort("avg_focus_seconds")}
               >
                 <span className="flex items-center gap-1">
                   Avg Focus
                   <ArrowUpDown className="w-3 h-3" />
                 </span>
               </th>
               <th className="px-4 py-3 font-medium text-[#8C857A]">Engagement</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-[#B8956C]/10">
             {sortedSections.map((section) => (
               <tr key={section.section_id} className="hover:bg-[#F9F6F0]/30 transition-colors">
                 <td className="px-4 py-3">
                   <span className="font-medium text-[#1A1915]">{section.section_name}</span>
                 </td>
                 <td className="px-4 py-3 text-[#4A4640]">
                   {section.impressions.toLocaleString()}
                 </td>
                 <td className="px-4 py-3 text-[#4A4640]">
                   {formatTotalTime(section.total_focus_time)}
                 </td>
                 <td className="px-4 py-3">
                   <span className="flex items-center gap-1 text-[#4A4640]">
                     <Clock className="w-3 h-3 text-[#B8956C]" />
                     {formatTime(section.avg_focus_seconds)}
                   </span>
                 </td>
                 <td className="px-4 py-3">
                   {getEngagementBadge(section.engagement_score)}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>
   );
 };
 
 export default SectionEngagementTable;