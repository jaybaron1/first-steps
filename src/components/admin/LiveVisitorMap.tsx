import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Map, { Source, Layer, Popup, NavigationControl, type MapRef, type MapMouseEvent } from 'react-map-gl/mapbox';
import type { GeoJSONSource } from 'mapbox-gl';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { MapPin, History, Radio } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiamF5YmFyb24xIiwiYSI6ImNtbDhuODdnYjA5OGgzZHB0d2o1NzdrZHYifQ.i_RjDQ3_PTj3KfSnf1bxOw';

type ViewMode = 'live' | 'today' | '7days' | '30days' | 'all';

interface VisitorLocation {
  id: string;
  country: string | null;
  city: string | null;
  latitude: number;
  longitude: number;
  device_type: string | null;
  browser: string | null;
  first_seen?: string;
}

interface PopupInfo {
  longitude: number;
  latitude: number;
  city: string | null;
  country: string | null;
  device_type: string | null;
  count?: number;
  first_seen?: string;
}

const LiveVisitorMap: React.FC = () => {
  const mapRef = useRef<MapRef>(null);
  const [visitors, setVisitors] = useState<VisitorLocation[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('live');
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
  });

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    
    let query = supabase
      .from('visitor_sessions')
      .select('id, country, city, latitude, longitude, device_type, browser, first_seen', { count: 'exact' });

    const now = new Date();
    
    if (viewMode === 'live') {
      // Last 5 minutes for live view
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
      query = query.gte('last_seen', fiveMinutesAgo);
    } else if (viewMode === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      query = query.gte('first_seen', startOfDay);
    } else if (viewMode === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('first_seen', sevenDaysAgo);
    } else if (viewMode === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('first_seen', thirtyDaysAgo);
    }
    // 'all' mode has no date filter

    const { data, error, count } = await query;

    if (!error && data) {
      const withCoords = data.filter(
        (v) => v.latitude !== null && v.longitude !== null
      ) as VisitorLocation[];
      setVisitors(withCoords);
      setTotalVisitors(count || data.length);
    }
    setLoading(false);
  }, [viewMode]);

  useEffect(() => {
    fetchVisitors();
    // Only poll for live mode
    if (viewMode === 'live') {
      const interval = setInterval(fetchVisitors, 15000);
      return () => clearInterval(interval);
    }
  }, [fetchVisitors, viewMode]);

  const geojson = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: visitors.map((v) => ({
      type: 'Feature' as const,
      properties: {
        id: v.id,
        city: v.city,
        country: v.country,
        device_type: v.device_type,
        browser: v.browser,
        first_seen: v.first_seen,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [v.longitude, v.latitude],
      },
    })),
  }), [visitors]);

  const onClick = useCallback((event: MapMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;

    const clusterId = feature.properties?.cluster_id;
    const mapboxSource = mapRef.current?.getSource('visitors') as GeoJSONSource | undefined;

    if (clusterId && mapboxSource) {
      mapboxSource.getClusterExpansionZoom(clusterId, (err: Error | null, zoom: number | null) => {
        if (err || !feature.geometry || feature.geometry.type !== 'Point') return;
        mapRef.current?.easeTo({
          center: feature.geometry.coordinates as [number, number],
          zoom: zoom ?? 4,
          duration: 500,
        });
      });
    } else if (feature.geometry?.type === 'Point') {
      setPopupInfo({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        city: feature.properties?.city,
        country: feature.properties?.country,
        device_type: feature.properties?.device_type,
        first_seen: feature.properties?.first_seen,
      });
    }
  }, []);

  const onMouseEnter = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = 'pointer';
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = '';
    }
  }, []);

  const getModeLabel = () => {
    switch (viewMode) {
      case 'live': return 'Live (5 min)';
      case 'today': return 'Today';
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      case 'all': return 'All Time';
    }
  };

  const getMarkerColor = () => viewMode === 'live' ? '#10b981' : '#B8956C';

  if (loading && visitors.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ height: '300px' }}>
      {/* Mode Selector */}
      <div className="absolute top-3 left-3 z-10 flex gap-1 bg-black/70 backdrop-blur-sm rounded-lg p-1">
        <button
          onClick={() => setViewMode('live')}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
            viewMode === 'live' 
              ? 'bg-emerald-500 text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Radio className="w-3 h-3" />
          Live
        </button>
        <button
          onClick={() => setViewMode('today')}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            viewMode === 'today' 
              ? 'bg-[#B8956C] text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setViewMode('7days')}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            viewMode === '7days' 
              ? 'bg-[#B8956C] text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          7d
        </button>
        <button
          onClick={() => setViewMode('30days')}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            viewMode === '30days' 
              ? 'bg-[#B8956C] text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          30d
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
            viewMode === 'all' 
              ? 'bg-[#B8956C] text-white' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <History className="w-3 h-3" />
          All
        </button>
      </div>

      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        
        <Source
          id="visitors"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          {/* Pulse effect layer - only for live mode */}
          {viewMode === 'live' && (
            <Layer
              id="pulse"
              type="circle"
              filter={['!', ['has', 'point_count']]}
              paint={{
                'circle-color': '#10b981',
                'circle-radius': 16,
                'circle-opacity': 0.3,
              }}
            />
          )}
          
          {/* Cluster circles */}
          <Layer
            id="clusters"
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': viewMode === 'live' ? [
                'step',
                ['get', 'point_count'],
                '#10b981',
                5,
                '#059669',
                15,
                '#047857',
              ] : [
                'step',
                ['get', 'point_count'],
                '#B8956C',
                5,
                '#9A7A5A',
                15,
                '#7C5F48',
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                18,
                5,
                24,
                15,
                30,
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            }}
          />
          
          {/* Cluster count labels */}
          <Layer
            id="cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            layout={{
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,
            }}
            paint={{
              'text-color': '#ffffff',
            }}
          />
          
          {/* Individual points */}
          <Layer
            id="unclustered-point"
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': viewMode === 'live' ? '#10b981' : '#B8956C',
              'circle-radius': 8,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            }}
          />
        </Source>

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2 text-sm">
              <p className="font-semibold text-foreground">
                {popupInfo.city || popupInfo.country || 'Unknown Location'}
              </p>
              {popupInfo.city && popupInfo.country && (
                <p className="text-muted-foreground text-xs">{popupInfo.country}</p>
              )}
              {popupInfo.device_type && (
                <p className="text-muted-foreground text-xs capitalize mt-1">
                  {popupInfo.device_type}
                </p>
              )}
              {popupInfo.first_seen && viewMode !== 'live' && (
                <p className="text-muted-foreground text-xs mt-1">
                  {new Date(popupInfo.first_seen).toLocaleDateString()}
                </p>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-white bg-black/70 px-3 py-1.5 rounded-full backdrop-blur-sm">
        <div className={`w-2 h-2 rounded-full ${viewMode === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-[#B8956C]'}`} />
        <span className="font-medium">
          {totalVisitors} visitor{totalVisitors !== 1 ? 's' : ''} ({getModeLabel()})
        </span>
        {visitors.length < totalVisitors && (
          <span className="text-white/60">
            ({visitors.length} with location)
          </span>
        )}
      </div>

      {/* Loading overlay for mode switches */}
      {loading && visitors.length > 0 && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {visitors.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-center text-white/80">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No visitors with location data</p>
            <p className="text-xs text-white/60 mt-1">for {getModeLabel().toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveVisitorMap;
