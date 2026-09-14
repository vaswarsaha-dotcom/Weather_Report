"use client";

import { useEffect, useState } from "react";
import HistoryChart from "@/components/dashboard/HistoryChart";
import type { GeoResult } from "@/types/weather";

const LAST_LOCATION_KEY = "ws-last-location";

export default function HistoryPage() {
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
      <h1 className="text-2xl font-bold mb-4">History</h1>

      {!location ? (
        <p className="text-sm text-slate">
          Search for a city on the Overview page first — history is tied to a
          location.
        </p>
      ) : (
        <HistoryChart lat={location.latitude} lon={location.longitude} />
      )}
    </div>
  );
}