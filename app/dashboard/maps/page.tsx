"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { GeoResult } from "@/types/weather";
import { useWeather } from "@/hooks/useWeather";

const WeatherMap = dynamic(() => import("@/components/weather/WeatherMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] animate-pulse rounded-xl2 border border-white/10 bg-white/[0.04]" />
  ),
});

const LAST_LOCATION_KEY = "ws-last-location";

export default function MapsPage() {
  const [location, setLocation] = useState<GeoResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LAST_LOCATION_KEY);
    if (stored) {
      try {
        setLocation(JSON.parse(stored));
      } catch {
        localStorage.removeItem(LAST_LOCATION_KEY);
      }
    }
    setHydrated(true);
  }, []);

  const { snapshot, loading, error } = useWeather(location);

  if (!hydrated) return null;

  if (!location) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
        <p className="font-display text-2xl text-cloud">No location selected</p>
        <p className="mt-2 text-sm text-slate">
          Search for a city on the Overview page first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-cloud">
          Weather maps
        </h1>
        <p className="text-sm text-slate">
          {location.name}
          {location.admin1 ? `, ${location.admin1}` : ""}
        </p>
      </div>

      {loading && !snapshot && (
        <p className="text-sm text-slate">Loading map data…</p>
      )}

      {error && !snapshot && (
        <p className="text-sm text-red-300">{error}</p>
      )}

      {snapshot && (
        <div className="panel isolate overflow-hidden">
          <WeatherMap location={location} snapshot={snapshot} />
        </div>
      )}
    </div>
  );
}