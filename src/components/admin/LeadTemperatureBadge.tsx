import React from 'react';
import { Flame, Thermometer, Snowflake, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LeadTemperature = 'hot' | 'warm' | 'cool' | 'cold';

interface LeadTemperatureBadgeProps {
  score: number | null | undefined;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Get temperature classification from lead score
 * Hot: 76-100 (highly engaged, ready to convert)
 * Warm: 51-75 (interested, needs nurturing)
 * Cool: 26-50 (browsing, low engagement)
 * Cold: 0-25 (minimal activity)
 */
export const getTemperature = (score: number | null | undefined): LeadTemperature => {
  if (score === null || score === undefined) return 'cold';
  if (score >= 76) return 'hot';
  if (score >= 51) return 'warm';
  if (score >= 26) return 'cool';
  return 'cold';
};

const temperatureConfig: Record<LeadTemperature, {
  label: string;
  icon: React.FC<{ className?: string }>;
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconColor: string;
}> = {
  hot: {
    label: 'Hot',
    icon: Flame,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
  },
  warm: {
    label: 'Warm',
    icon: Thermometer,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-500',
  },
  cool: {
    label: 'Cool',
    icon: Wind,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
  },
  cold: {
    label: 'Cold',
    icon: Snowflake,
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
    iconColor: 'text-slate-400',
  },
};

const sizeConfig = {
  sm: {
    padding: 'px-1.5 py-0.5',
    text: 'text-xs',
    icon: 'w-3 h-3',
    gap: 'gap-1',
  },
  md: {
    padding: 'px-2 py-1',
    text: 'text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-1.5',
  },
  lg: {
    padding: 'px-3 py-1.5',
    text: 'text-base',
    icon: 'w-5 h-5',
    gap: 'gap-2',
  },
};

const LeadTemperatureBadge: React.FC<LeadTemperatureBadgeProps> = ({
  score,
  showScore = false,
  size = 'md',
  className,
}) => {
  const temperature = getTemperature(score);
  const config = temperatureConfig[temperature];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizes.padding,
        sizes.text,
        sizes.gap,
        className
      )}
    >
      <Icon className={cn(sizes.icon, config.iconColor)} />
      <span>{config.label}</span>
      {showScore && score !== null && score !== undefined && (
        <span className="opacity-70">({score})</span>
      )}
    </div>
  );
};

export default LeadTemperatureBadge;
