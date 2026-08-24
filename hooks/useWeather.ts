"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GeoResult, WeatherSnapshot } from "@/types/weather";

const REFRESH_MS = 5 * 60 * 1000;

export function useWeather(location: GeoResult | null) {
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWeather = useCallback(async (loc: GeoResult) => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
      setError("You're offline. Showing the last data we have.");
      return;
    }
    setIsOffline(false);
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/weather", window.location.origin);
      url.searchParams.set("lat", String(loc.latitude));
      url.searchParams.set("lon", String(loc.longitude));
      url.searchParams.set("name", loc.name);
      url.searchParams.set("country", loc.country ?? "");
      url.searchParams.set("timezone", loc.timezone ?? "auto");

      const res = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load weather");
      setSnapshot(data as WeatherSnapshot);
    } catch (err) {
      setError((err as Error).message || "Something went wrong fetching weather data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!location) return;
    fetchWeather(location);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => fetchWeather(location), REFRESH_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [location, fetchWeather]);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => {
      setIsOffline(false);
      if (location) fetchWeather(location);
    };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [location, fetchWeather]);

  return { snapshot, loading, error, isOffline, refetch: () => location && fetchWeather(location) };
}
