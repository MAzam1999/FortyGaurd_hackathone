"use client";

import { useEffect, useRef } from "react";
import { Map as MapLibreMap, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapStop {
  lat: number;
  lon: number;
  shadePercent: number;
}

export interface MapRoute {
  color: string;
  stops: MapStop[];
}

// MapLibre's public demo style — vector basemap, no API token required.
const STYLE_URL = "https://demotiles.maplibre.org/style.json";

function shadeColor(shadePercent: number): string {
  // more shade -> greener, less shade -> redder
  if (shadePercent >= 50) return "#16a34a";
  if (shadePercent >= 25) return "#f59e0b";
  return "#dc2626";
}

export function RouteMap({ routes }: { routes: MapRoute[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const allStops = routes.flatMap((r) => r.stops);
    const centerLon = allStops.reduce((sum, s) => sum + s.lon, 0) / allStops.length;
    const centerLat = allStops.reduce((sum, s) => sum + s.lat, 0) / allStops.length;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: STYLE_URL,
      center: [centerLon, centerLat],
      zoom: 13,
    });
    mapRef.current = map;

    map.on("load", () => {
      for (const route of routes) {
        if (route.stops.length > 1) {
          map.addSource(`route-${route.color}`, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: route.stops.map((s) => [s.lon, s.lat]),
              },
            },
          });
          map.addLayer({
            id: `route-line-${route.color}`,
            type: "line",
            source: `route-${route.color}`,
            paint: { "line-color": route.color, "line-width": 3 },
          });
        }

        for (const stop of route.stops) {
          new Marker({ color: shadeColor(stop.shadePercent) })
            .setLngLat([stop.lon, stop.lat])
            .setPopup(new Popup().setText(`${stop.shadePercent}% shaded`))
            .addTo(map);
        }
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [routes]);

  return <div ref={containerRef} className="h-80 w-full rounded-lg" />;
}
