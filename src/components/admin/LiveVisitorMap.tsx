  import React, { useEffect, useState } from 'react';                           
  import { adminSupabase as supabase } from '@/lib/adminBackend';               
  import { MapPin } from 'lucide-react';                                        
                                                                                
  interface VisitorLocation {                                                   
    id: string;                                                                 
    country: string | null;
    city: string | null;
    lat: number;
    lng: number;
  }

  // Simple country coordinates for visualization
  const countryCoords: Record<string, { lat: number; lng: number }> = {
    'United States': { lat: 39.8, lng: -98.5 },
    'United Kingdom': { lat: 54.0, lng: -2.0 },
    'Germany': { lat: 51.2, lng: 10.4 },
    'France': { lat: 46.2, lng: 2.2 },
    'Canada': { lat: 56.1, lng: -106.3 },
    'Australia': { lat: -25.3, lng: 133.8 },
    'India': { lat: 20.6, lng: 79.0 },
    'Brazil': { lat: -14.2, lng: -51.9 },
    'Japan': { lat: 36.2, lng: 138.3 },
    'China': { lat: 35.9, lng: 104.2 },
    'Netherlands': { lat: 52.1, lng: 5.3 },
    'Spain': { lat: 40.5, lng: -3.7 },
    'Italy': { lat: 41.9, lng: 12.6 },
    'Mexico': { lat: 23.6, lng: -102.6 },
    'South Korea': { lat: 35.9, lng: 127.8 },
    'Singapore': { lat: 1.4, lng: 103.8 },
    'Sweden': { lat: 60.1, lng: 18.6 },
    'Norway': { lat: 60.5, lng: 8.5 },
    'Poland': { lat: 51.9, lng: 19.1 },
    'Argentina': { lat: -38.4, lng: -63.6 },
  };

  // Convert lat/lng to SVG coordinates (simple equirectangular projection)
  const toSvgCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  const LiveVisitorMap: React.FC = () => {
    const [visitors, setVisitors] = useState<VisitorLocation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchActiveVisitors = async () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 *
  1000).toISOString();

        const { data, error } = await supabase
          .from('visitor_sessions')
          .select('id, country, city')
          .gte('last_seen', fiveMinutesAgo)
          .not('country', 'is', null);

        if (!error && data) {
          const mapped = data.map((v) => {
            const coords = countryCoords[v.country || ''] || { lat: 0, lng: 0 };
            // Add some jitter to prevent overlap
            return {
              id: v.id,
              country: v.country,
              city: v.city,
              lat: coords.lat + (Math.random() - 0.5) * 5,
              lng: coords.lng + (Math.random() - 0.5) * 5,
            };
          });
          setVisitors(mapped);
        }
        setLoading(false);
      };

      fetchActiveVisitors();
      const interval = setInterval(fetchActiveVisitors, 30000); // Refresh every
   30s

      return () => clearInterval(interval);
    }, []);

    if (loading) {
      return (
        <div className="h-[200px] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#B8956C] border-t-transparent
   rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Simple world map SVG */}
        <svg
          viewBox="0 0 800 400"
          className="w-full h-auto opacity-20"
          style={{ maxHeight: '200px' }}
        >
          {/* Simplified continent outlines */}
          <path
            d="M120,120 Q160,100 200,110 T260,100 T300,120 T280,160 T220,180
  T160,160 Z"
            fill="currentColor"
            className="text-[#8C857A]"
          />
          <path
            d="M320,80 Q380,60 440,70 T520,80 T560,100 T580,140 T560,180
  T500,200 T440,190 T380,160 T340,120 Z"
            fill="currentColor"
            className="text-[#8C857A]"
          />
          <path
            d="M560,100 Q620,80 680,90 T740,110 T760,150 T740,190 T680,200
  T620,180 T580,140 Z"
            fill="currentColor"
            className="text-[#8C857A]"
          />
          <path
            d="M200,200 Q240,220 260,260 T240,320 T180,340 T140,300 T160,240 Z"
            fill="currentColor"
            className="text-[#8C857A]"
          />
          <path
            d="M580,220 Q620,200 660,220 T680,280 T640,340 T580,320 T560,260 Z"
            fill="currentColor"
            className="text-[#8C857A]"
          />
        </svg>

        {/* Visitor pins */}
        <div className="absolute inset-0">
          {visitors.map((visitor) => {
            const { x, y } = toSvgCoords(visitor.lat, visitor.lng);
            const percentX = (x / 800) * 100;
            const percentY = (y / 400) * 100;

            return (
              <div
                key={visitor.id}
                className="absolute group"
                style={{
                  left: `${percentX}%`,
                  top: `${percentY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative">
                  {/* Pulse animation */}
                  <div className="absolute w-4 h-4 rounded-full
  bg-emerald-500/40 animate-ping" />
                  <div className="relative w-3 h-3 rounded-full bg-emerald-500
  border-2 border-white shadow-lg" />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2
   mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
   z-10">
                    <div className="bg-white border border-[#B8956C]/20
  shadow-lg rounded-lg px-3 py-2 text-xs whitespace-nowrap">
                      <p className="text-[#1A1915] font-medium">
                        {visitor.city || visitor.country || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2
  text-xs text-[#1A1915] bg-white/90 px-3 py-1.5 rounded-full border
  border-[#B8956C]/20 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium">{visitors.length} active
  visitor{visitors.length !== 1 ? 's' : ''}</span>
        </div>

        {visitors.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-[#8C857A]">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No active visitors with
  location data</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default LiveVisitorMap;