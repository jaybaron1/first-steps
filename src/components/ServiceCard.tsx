
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon,
  className,
  children 
}: ServiceCardProps) => {
  return (
    <div className={cn("card group hover:border-galavanteer-purple/20", className)}>
      <div className="mb-4 p-3 inline-flex items-center justify-center rounded-md bg-galavanteer-purple-light text-galavanteer-purple group-hover:bg-galavanteer-purple group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold mb-2 text-galavanteer-gray">{title}</h3>
      <p className="text-galavanteer-gray/80">{description}</p>
      {children}
    </div>
  );
};

export default ServiceCard;
