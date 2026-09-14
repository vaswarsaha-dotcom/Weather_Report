// hooks/useGeolocation.ts
"use client";
import { useCallback, useState } from "react";

interface GeoState {
  lat: number | null; lon: number | null;
  status: "idle" | "locating" | "granted" | "denied" | "unsupported";
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ lat: null, lon: null, status: "idle", error: null });

  const locate = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState((s) => ({ ...s, status: "unsupported", error: "Geolocation isn't supported here." }));
      return Promise.resolve(null);
    }
    setState((s) => ({ ...s, status: "locating", error: null }));
    return new Promise<{ lat: number; lon: number } | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude, lon = pos.coords.longitude;
          setState({ lat, lon, status: "granted", error: null });
          resolve({ lat, lon });
        },
        () => { setState({ lat: null, lon: null, status: "denied", error: "Location permission denied." }); resolve(null); },
        { timeout: 6000 }
      );
    });
  }, []);

  return { ...state, locate };
}