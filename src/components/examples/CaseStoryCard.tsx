
import React from "react";
import { 
  Briefcase, 
  Pencil, 
  MessageSquare, 
  Lightbulb, 
  Code, 
  Users, 
  Star, 
  BarChart3 
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "operator": <Briefcase className="w-7 h-7 text-galavanteer-purple" />,
  "founder": <Pencil className="w-7 h-7 text-galavanteer-purple" />,
  "coach": <MessageSquare className="w-7 h-7 text-galavanteer-purple" />,
  "strategist": <Lightbulb className="w-7 h-7 text-galavanteer-purple" />,
  "developer": <Code className="w-7 h-7 text-galavanteer-purple" />,
  "personal": <Users className="w-7 h-7 text-galavanteer-purple" />,
  "impact": <BarChart3 className="w-7 h-7 text-galavanteer-purple" />,
};

interface CaseStoryCardProps {
  archetype: string;
  title: string;
  image: string;
  intro: string;
  story: React.ReactNode;
  outcomes: React.ReactNode[]; // Changed from string[] to React.ReactNode[] to support JSX elements
}

const CaseStoryCard: React.FC<CaseStoryCardProps> = ({
  archetype,
  title,
  image,
  intro,
  story,
  outcomes
}) => (
  <section className="flex flex-col md:flex-row rounded-xl shadow bg-white overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200 animate-fade-in">
    <div className="w-full md:w-2/5 md:max-w-xs">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 md:h-full object-cover" 
        loading="lazy"
      />
    </div>
    <div className="flex-1 flex flex-col p-7">
      <div className="flex items-center gap-2 mb-1">
        {iconMap[archetype] || <Star className="w-7 h-7 text-galavanteer-purple"/>}
        <h2 className="uppercase text-md tracking-widest font-semibold text-galavanteer-purple/80">{title}</h2>
      </div>
      <div className="italic text-galavanteer-purple-dark text-sm mb-2">{intro}</div>
      <div className="mb-3 text-galavanteer-gray/90">{story}</div>
      <ul className="mb-2 space-y-1 list-disc pl-5 text-galavanteer-gray/90 text-sm">
        {outcomes.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  </section>
);

export default CaseStoryCard;
