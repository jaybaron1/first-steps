import React from 'react';
import { Calendar, Monitor, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface VisitorFiltersState {
  dateRange: 'all' | '24h' | '7d' | '30d' | '90d';
  deviceType: 'all' | 'desktop' | 'mobile' | 'tablet';
  country: string;
}

interface VisitorFiltersProps {
  filters: VisitorFiltersState;
  onFiltersChange: (filters: VisitorFiltersState) => void;
  countries: string[];
}

const VisitorFilters: React.FC<VisitorFiltersProps> = ({
  filters,
  onFiltersChange,
  countries,
}) => {
  const hasActiveFilters =
    filters.dateRange !== 'all' ||
    filters.deviceType !== 'all' ||
    filters.country !== '';

  const clearFilters = () => {
    onFiltersChange({
      dateRange: 'all',
      deviceType: 'all',
      country: '',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-[#F9F6F0] rounded-lg border border-[#B8956C]/10">
      {/* Date Range Filter */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#8C857A]" />
        <Select
          value={filters.dateRange}
          onValueChange={(value: VisitorFiltersState['dateRange']) =>
            onFiltersChange({ ...filters, dateRange: value })
          }
        >
          <SelectTrigger className="w-[130px] h-8 text-xs bg-white border-[#B8956C]/20">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Device Type Filter */}
      <div className="flex items-center gap-2">
        <Monitor className="w-4 h-4 text-[#8C857A]" />
        <Select
          value={filters.deviceType}
          onValueChange={(value: VisitorFiltersState['deviceType']) =>
            onFiltersChange({ ...filters, deviceType: value })
          }
        >
          <SelectTrigger className="w-[120px] h-8 text-xs bg-white border-[#B8956C]/20">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All devices</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="tablet">Tablet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Country Filter */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#8C857A]" />
        <Select
          value={filters.country || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, country: value === 'all' ? '' : value })
          }
        >
          <SelectTrigger className="w-[140px] h-8 text-xs bg-white border-[#B8956C]/20">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2 text-xs text-[#8C857A] hover:text-[#1A1915]"
        >
          <X className="w-3 h-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default VisitorFilters;
