"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { GeoResult } from "@/types/weather";
import { EmptyLocationState } from "@/components/dashboard/States";

const WeatherMap = dynamic(() => import("@/components/dashboard/WeatherMap").then((m) => m.WeatherMap), {
  ssr: false,
  loading: () => <div className="h-[480px] animate-pulse rounded-xl2 border border-white/10 bg-white/[0.04]" />
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
        // ignore
      }
    }
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  if (!location) return <EmptyLocationState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cloud">Weather maps</h1>
        <p className="text-sm text-slate">
          {location.name}
          {location.admin1 ? `, ${location.admin1}` : ""}
        </p>
      </div>
      <WeatherMap location={location} />
    </div>
  );
}
