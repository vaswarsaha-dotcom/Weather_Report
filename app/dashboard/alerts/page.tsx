"use client";

import { useEffect, useState } from "react";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import type { GeoResult } from "@/types/weather";

const LAST_LOCATION_KEY = "ws-last-location";

export default function AlertsPage() {
  const [location, setLocation] = useState<GeoResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LAST_LOCATION_KEY);
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch {
        localStorage.removeItem(LAST_LOCATION_KEY);
      }
    }
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className="min-w-0 space-y-5">
      <div>
        <p className="eyebrow">WeatherSphere Pro</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-cloud">Alerts</h1>
      </div>

      {!location ? (
        <p className="panel panel-pad text-sm text-slate">
          Search for a city on the Overview page first — alerts are tied to a
          location.
        </p>
      ) : (
        <AlertsPanel
          lat={location.latitude}
          lon={location.longitude}
          placeName={location.name}
        />
      )}
    </div>
  );
}