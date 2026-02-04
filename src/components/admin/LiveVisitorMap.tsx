import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Map, { Source, Layer, Popup, NavigationControl, type MapRef, type MapMouseEvent } from 'react-map-gl/mapbox';
import type { GeoJSONSource } from 'mapbox-gl';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiamF5YmFyb24xIiwiYSI6ImNtbDhuODdnYjA5OGgzZHB0d2o1NzdrZHYifQ.i_RjDQ3_PTj3KfSnf1bxOw';

interface VisitorLocation {
  id: string;
  country: string | null;
  city: string | null;
  latitude: number;
  longitude: number;
  device_type: string | null;
  browser: string | null;
}

interface PopupInfo {
  longitude: number;
  latitude: number;
  city: string | null;
  country: string | null;
  device_type: string | null;
  count?: number;
}

const LiveVisitorMap: React.FC = () => {
  const mapRef = useRef<MapRef>(null);
  const [visitors, setVisitors] = useState<VisitorLocation[]>([]);
  const [totalActiveVisitors, setTotalActiveVisitors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
  });

  const fetchActiveVisitors = useCallback(async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data, error, count } = await supabase
      .from('visitor_sessions')
      .select('id, country, city, latitude, longitude, device_type, browser', { count: 'exact' })
      .gte('last_seen', fiveMinutesAgo);

    if (!error && data) {
      const withCoords = data.filter(
        (v) => v.latitude !== null && v.longitude !== null
      ) as VisitorLocation[];
      setVisitors(withCoords);
      setTotalActiveVisitors(count || data.length);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchActiveVisitors();
    const interval = setInterval(fetchActiveVisitors, 15000);
    return () => clearInterval(interval);
  }, [fetchActiveVisitors]);

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

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ height: '300px' }}>
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
          {/* Pulse effect layer */}
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
          
          {/* Cluster circles */}
          <Layer
            id="clusters"
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#10b981',
                5,
                '#059669',
                15,
                '#047857',
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
              'circle-color': '#10b981',
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
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-white bg-black/70 px-3 py-1.5 rounded-full backdrop-blur-sm">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium">
          {totalActiveVisitors} active visitor{totalActiveVisitors !== 1 ? 's' : ''}
        </span>
        {visitors.length < totalActiveVisitors && (
          <span className="text-white/60">
            ({visitors.length} with location)
          </span>
        )}
      </div>

      {/* Empty state */}
      {visitors.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-center text-white/80">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No active visitors with location data</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveVisitorMap;
