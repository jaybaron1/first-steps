 import React from "react";
 import { ArrowRight, TrendingDown } from "lucide-react";
 import type { SectionFlowStep } from "@/hooks/useSectionStats";
 
 interface Props {
   flow: SectionFlowStep[];
   loading: boolean;
 }
 
 const SectionFlowCard: React.FC<Props> = ({ flow, loading }) => {
   if (loading) {
     return (
       <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
         <div className="animate-pulse space-y-4">
           <div className="h-6 bg-gray-200 rounded w-1/3" />
           <div className="flex items-center gap-2">
             {[1, 2, 3, 4, 5].map((i) => (
               <React.Fragment key={i}>
                 <div className="h-16 w-20 bg-gray-100 rounded" />
                 {i < 5 && <div className="h-4 w-4 bg-gray-100 rounded" />}
               </React.Fragment>
             ))}
           </div>
         </div>
       </div>
     );
   }
 
   if (flow.length === 0) {
     return (
       <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
         <h3 className="font-medium text-[#1A1915] flex items-center gap-2 mb-4">
           <TrendingDown className="w-4 h-4 text-[#B8956C]" />
           Section Flow
         </h3>
         <p className="text-sm text-[#8C857A]">Flow data will appear once visitors browse your site.</p>
       </div>
     );
   }
 
   // Find the biggest drop-off
   let biggestDropIdx = -1;
   let biggestDrop = 0;
   for (let i = 1; i < flow.length; i++) {
     const drop = flow[i - 1].reach_percentage - flow[i].reach_percentage;
     if (drop > biggestDrop) {
       biggestDrop = drop;
       biggestDropIdx = i - 1;
     }
   }
 
   return (
     <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
       <h3 className="font-medium text-[#1A1915] flex items-center gap-2 mb-4">
         <TrendingDown className="w-4 h-4 text-[#B8956C]" />
         Section Flow
       </h3>
 
       <div className="overflow-x-auto pb-2">
         <div className="flex items-center gap-1 min-w-max">
           {flow.map((step, i) => {
             const isBiggestDrop = i === biggestDropIdx;
             const dropFromPrev = i > 0 ? flow[i - 1].reach_percentage - step.reach_percentage : 0;
 
             return (
               <React.Fragment key={step.section_id}>
                 <div
                   className={`flex flex-col items-center justify-center min-w-[80px] px-3 py-2 rounded-lg border transition-colors ${
                     step.reach_percentage >= 80
                       ? "bg-emerald-50 border-emerald-200"
                       : step.reach_percentage >= 50
                       ? "bg-amber-50 border-amber-200"
                       : "bg-red-50 border-red-200"
                   }`}
                 >
                   <span className="text-xs font-medium text-[#4A4640] text-center leading-tight">
                     {step.section_name}
                   </span>
                   <span
                     className={`text-lg font-semibold mt-1 ${
                       step.reach_percentage >= 80
                         ? "text-emerald-700"
                         : step.reach_percentage >= 50
                         ? "text-amber-700"
                         : "text-red-700"
                     }`}
                   >
                     {step.reach_percentage}%
                   </span>
                   <span className="text-[10px] text-[#8C857A]">
                     {step.visitors_count} visitors
                   </span>
                 </div>
 
                 {i < flow.length - 1 && (
                   <div className="flex flex-col items-center mx-1">
                     <ArrowRight
                       className={`w-4 h-4 ${
                         isBiggestDrop ? "text-red-500" : "text-[#B8956C]/40"
                       }`}
                     />
                     {dropFromPrev > 0 && (
                       <span
                         className={`text-[10px] font-medium ${
                           isBiggestDrop ? "text-red-500" : "text-[#8C857A]"
                         }`}
                       >
                         -{dropFromPrev}%
                       </span>
                     )}
                   </div>
                 )}
               </React.Fragment>
             );
           })}
         </div>
       </div>
 
       {biggestDropIdx >= 0 && (
         <div className="mt-4 pt-4 border-t border-[#B8956C]/10">
           <p className="text-xs text-[#8C857A]">
             <span className="text-red-600 font-medium">Biggest drop-off:</span>{" "}
             {biggestDrop}% of visitors leave after{" "}
             <span className="font-medium text-[#1A1915]">{flow[biggestDropIdx].section_name}</span>
           </p>
         </div>
       )}
     </div>
   );
 };
 
 export default SectionFlowCard;