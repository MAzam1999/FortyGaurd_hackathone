"use client";

import { useEffect, useRef } from "react";
import { Map as MapLibreMap, Marker, Popup, type StyleSpecification } from "maplibre-gl";
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

/**
 * A self-contained raster style (CARTO's free light basemap, no API key) —
 * not a fetched style.json. demotiles.maplibre.org (tried first) is a
 * coarse, low-zoom-only global demo dataset with no real street-level
 * detail; at New Orleans street zoom it only ever painted its flat ocean
 * background color, and its "load" event — which the route lines and stop
 * markers below are gated on — never reliably fired, so nothing on top of
 * the background ever rendered. Raster PNG tiles from a CDN this widely
 * used are a much smaller failure surface.
 */
const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    basemap: {
      type: "raster",
      tiles: ["https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [{ id: "basemap", type: "raster", source: "basemap" }],
};

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
      style: MAP_STYLE,
      center: [centerLon, centerLat],
      zoom: 13,
    });
    mapRef.current = map;

    map.on("error", (e) => {
      console.error("RouteMap: MapLibre error", e.error);
    });

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
