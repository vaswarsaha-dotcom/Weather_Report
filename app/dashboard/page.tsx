"use client";

import { useEffect, useMemo, useState } from "react";
import type { GeoResult } from "@/types/weather";
import { useWeather } from "@/hooks/useWeather";
import { generateWeatherSummary } from "@/lib/summary";
import { CitySearch } from "@/components/dashboard/CitySearch";
import { CurrentWeatherCard } from "@/components/dashboard/CurrentWeatherCard";
import { StatGrid } from "@/components/dashboard/StatGrid";
import { HourlyForecast } from "@/components/dashboard/HourlyForecast";
import { DailyForecast } from "@/components/dashboard/DailyForecast";
import { DashboardSkeleton, ErrorState, OfflineState, EmptyLocationState } from "@/components/dashboard/States";

const LAST_LOCATION_KEY = "ws-last-location";

export default function DashboardOverviewPage() {
  const [location, setLocation] = useState<GeoResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore the last-viewed city so refreshing the dashboard doesn't lose context.
  useEffect(() => {
    const stored = localStorage.getItem(LAST_LOCATION_KEY);
    if (stored) {
      try {
        setLocation(JSON.parse(stored));
      } catch {
        // ignore malformed cache
      }
    }
    setHydrated(true);
  }, []);

  const handleSelect = (city: GeoResult) => {
    setLocation(city);
    localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(city));
  };

  const { snapshot, loading, error, isOffline, refetch } = useWeather(location);

  // Persist a lightweight snapshot for the historical trend charts. Fires
  // whenever a fresh fetch completes (initial load + every 5-min refresh).
  useEffect(() => {
    if (!snapshot || !location) return;
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cityName: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        temperature: snapshot.current.temperature,
        humidity: snapshot.current.humidity,
        windSpeed: snapshot.current.windSpeed,
        pressure: snapshot.current.pressure,
        weatherCode: snapshot.current.weatherCode
      })
    }).catch(() => {
      // Non-critical — history recording failures shouldn't disrupt the dashboard.
    });
  }, [snapshot, location]);

  const summary = useMemo(() => {
    if (!snapshot || !location) return "";
    return generateWeatherSummary({
      cityName: location.name,
      current: snapshot.current,
      today: snapshot.daily[0]
    });
  }, [snapshot, location]);

  return (
    <div className="space-y-6">
      <CitySearch onSelect={handleSelect} current={location} />

      {!hydrated ? null : !location ? (
        <EmptyLocationState />
      ) : isOffline && !snapshot ? (
        <OfflineState />
      ) : loading && !snapshot ? (
        <DashboardSkeleton />
      ) : error && !snapshot ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : snapshot ? (
        <div className="space-y-6">
          <CurrentWeatherCard location={location} snapshot={snapshot} summary={summary} />
          <StatGrid snapshot={snapshot} timezone={location.timezone} />
          <HourlyForecast snapshot={snapshot} timezone={location.timezone} />
          <DailyForecast snapshot={snapshot} timezone={location.timezone} />
        </div>
      ) : null}
    </div>
  );
}
