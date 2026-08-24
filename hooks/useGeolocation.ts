"use client";

import { useCallback, useState } from "react";
import type { GeoResult } from "@/types/weather";

export function useGeolocation() {
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async (): Promise<GeoResult | null> => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation isn't supported by this browser.");
      return null;
    }

    setDetecting(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 8000
        })
      );

      const { latitude, longitude } = position.coords;
      const url = new URL("/api/geocode", window.location.origin);
      url.searchParams.set("lat", String(latitude));
      url.searchParams.set("lon", String(longitude));

      const res = await fetch(url.toString());
      const data = await res.json();
      return (data.results?.[0] as GeoResult) ?? null;
    } catch (err) {
      setError(
        (err as GeolocationPositionError)?.message || "Couldn't detect your location. Try searching instead."
      );
      return null;
    } finally {
      setDetecting(false);
    }
  }, []);

  return { detect, detecting, error };
}
