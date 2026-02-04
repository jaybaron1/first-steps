import React, { useState } from 'react';
import { useGeoStats, CountryStats } from '@/hooks/useGeoStats';
import { Globe, TrendingUp, Clock, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type TimeRange = 'today' | '7days' | '30days' | 'all';

const timeRangeLabels: Record<TimeRange, string> = {
  today: 'Today',
  '7days': '7 Days',
  '30days': '30 Days',
  all: 'All Time',
};

// Country code to name mapping for display
const countryNames: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  IN: 'India',
  BR: 'Brazil',
  JP: 'Japan',
  MX: 'Mexico',
  ES: 'Spain',
  IT: 'Italy',
  NL: 'Netherlands',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  CH: 'Switzerland',
  AT: 'Austria',
  BE: 'Belgium',
  IE: 'Ireland',
  NZ: 'New Zealand',
  SG: 'Singapore',
  HK: 'Hong Kong',
  KR: 'South Korea',
  TW: 'Taiwan',
  PH: 'Philippines',
  TH: 'Thailand',
  MY: 'Malaysia',
  ID: 'Indonesia',
  VN: 'Vietnam',
  PL: 'Poland',
  CZ: 'Czech Republic',
  RU: 'Russia',
  UA: 'Ukraine',
  ZA: 'South Africa',
  AE: 'UAE',
  SA: 'Saudi Arabia',
  IL: 'Israel',
  EG: 'Egypt',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
  Unknown: 'Unknown',
};

const getCountryDisplayName = (code: string): string => {
  return countryNames[code] || code;
};

// Color scale from light cream to deep gold
const getHeatColor = (percentage: number, maxPercentage: number): string => {
  if (maxPercentage === 0) return 'hsl(40, 30%, 95%)';
  const intensity = percentage / maxPercentage;
  // Interpolate between light cream (40, 30%, 95%) and deep gold (35, 35%, 57%)
  const h = 40 - intensity * 5;
  const s = 30 + intensity * 5;
  const l = 95 - intensity * 38;
  return `hsl(${h}, ${s}%, ${l}%)`;
};

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const GeoHeatMap: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const { stats, loading, error, totalVisitors } = useGeoStats(timeRange);

  const maxPercentage = stats.length > 0 ? Math.max(...stats.map((s) => s.percentage)) : 0;

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[#8C857A]">
          <Globe className="w-4 h-4" />
          <span>{totalVisitors.toLocaleString()} total visitors</span>
        </div>
        <div className="flex gap-2">
          {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                timeRange === range
                  ? 'bg-[#B8956C] text-white shadow-sm'
                  : 'bg-[#F3EDE4] text-[#4A4640] hover:bg-[#E8DFD0]'
              }`}
            >
              {timeRangeLabels[range]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-12 text-[#8C857A]">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No visitor data for this time period</p>
        </div>
      ) : (
        <>
          {/* Country List with Heat Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.slice(0, 10).map((country, index) => (
              <CountryRow
                key={country.country}
                country={country}
                rank={index + 1}
                heatColor={getHeatColor(country.percentage, maxPercentage)}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#B8956C]/10">
            <span className="text-xs text-[#8C857A]">Density:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(40, 30%, 95%)' }} />
              <span className="text-xs text-[#8C857A]">Low</span>
            </div>
            <div
              className="w-20 h-4 rounded"
              style={{
                background: 'linear-gradient(to right, hsl(40, 30%, 95%), hsl(35, 35%, 57%))',
              }}
            />
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(35, 35%, 57%)' }} />
              <span className="text-xs text-[#8C857A]">High</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface CountryRowProps {
  country: CountryStats;
  rank: number;
  heatColor: string;
}

const CountryRow: React.FC<CountryRowProps> = ({ country, rank, heatColor }) => {
  return (
    <div
      className="relative flex items-center gap-4 p-4 rounded-xl border border-[#B8956C]/10 overflow-hidden transition-all hover:shadow-md hover:border-[#B8956C]/30"
      style={{ backgroundColor: heatColor }}
    >
      {/* Rank Badge */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-sm font-semibold text-[#B8956C] shadow-sm">
        {rank}
      </div>

      {/* Country Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[#1A1915] truncate">
          {getCountryDisplayName(country.country)}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#6B6560]">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {country.visitor_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(country.avg_time_on_site)}
          </span>
        </div>
      </div>

      {/* Percentage */}
      <div className="flex-shrink-0 text-right">
        <div className="text-lg font-semibold text-[#B8956C]">{country.percentage}%</div>
        <div className="flex items-center gap-1 text-xs text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          Share
        </div>
      </div>
    </div>
  );
};

export default GeoHeatMap;
