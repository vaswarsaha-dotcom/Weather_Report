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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Alerts</h1>

      {!location ? (
        <p className="text-sm text-slate">
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