"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { GeoResult } from "@/types/weather";
import { cn } from "@/lib/cn";

// Leaflet's default marker icons reference image paths that don't resolve
// under Next.js bundling — point them at a CDN instead of shipping our own.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

type Layer = "temperature" | "rain" | "clouds" | "wind";

const OWM_LAYER_PATH: Record<Layer, string> = {
  temperature: "temp_new",
  rain: "precipitation_new",
  clouds: "clouds_new",
  wind: "wind_new"
};

const layerLabels: Record<Layer, string> = {
  temperature: "Temperature",
  rain: "Rain",
  clouds: "Clouds",
  wind: "Wind"
};

export function WeatherMap({ location }: { location: GeoResult }) {
  const [activeLayer, setActiveLayer] = useState<Layer>("temperature");
  const owmKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  return (
    <div className="overflow-hidden rounded-xl2 border border-white/10">
      <div className="flex flex-wrap gap-2 border-b border-white/10 bg-white/5 p-3">
        {(Object.keys(layerLabels) as Layer[]).map((layer) => (
          <button
            key={layer}
            onClick={() => setActiveLayer(layer)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs transition",
              activeLayer === layer ? "bg-amber text-ink" : "text-slate hover:bg-white/10"
            )}
          >
            {layerLabels[layer]}
          </button>
        ))}
      </div>

      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={7}
        scrollWheelZoom
        style={{ height: "480px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {owmKey && (
          <TileLayer
            url={`https://tile.openweathermap.org/map/${OWM_LAYER_PATH[activeLayer]}/{z}/{x}/{y}.png?appid=${owmKey}`}
            opacity={0.6}
          />
        )}
        <Marker position={[location.latitude, location.longitude]} icon={markerIcon}>
          <Popup>{location.name}</Popup>
        </Marker>
      </MapContainer>

      {!owmKey && (
        <p className="border-t border-white/10 bg-white/5 px-4 py-2 text-xs text-slate">
          Weather overlay layers require an OpenWeatherMap key set as{" "}
          <code className="font-mono">NEXT_PUBLIC_OPENWEATHER_API_KEY</code>. The base map works without one.
        </p>
      )}
    </div>
  );
}
