"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { CitySearch } from "@/components/dashboard/CitySearch";
import { LocationTabs } from "@/components/weather/LocationTabs";
import { WeatherShell } from "@/components/weather/WeatherShell";
import { WeatherTopBar } from "@/components/weather/WeatherTopBar";
import { CurrentWeatherHero } from "@/components/weather/CurrentWeatherHero";
import { Forecast10Day } from "@/components/weather/Forecast10Day";
import { HourlyTimeline } from "@/components/weather/HourlyTimeline";
import { WeatherDetails } from "@/components/weather/WeatherDetails";
import { AirQualityCard } from "@/components/weather/AirQualityCard";
import { SunMoonCard } from "@/components/weather/SunMoonCard";
import { WeatherWarnings } from "@/components/weather/WeatherWarnings";
import { WeatherBackground } from "@/components/weather/WeatherBackground";
import { MonthlyCalendar } from "@/components/weather/MonthlyCalendar";
import { WeatherTrends } from "@/components/weather/WeatherTrends";
import { useWeather } from "@/hooks/useWeather";

import type { GeoResult } from "@/types/weather";

const WeatherMap = dynamic(() => import("@/components/weather/WeatherMap"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[360px] items-center justify-center text-sm text-slate">
      Loading map...
    </div>
  ),
});

const LAST_LOCATION_KEY = "ws-last-location";
const RECENT_LOCATIONS_KEY = "ws-recent-locations";
const UNIT_KEY = "ws-temperature-unit";
const MAX_RECENTS = 6;

function keyOf(loc: GeoResult) {
  return `${loc.latitude.toFixed(2)}-${loc.longitude.toFixed(2)}`;
}

export default function DashboardOverviewPage() {
  const [location, setLocation] = useState<GeoResult | null>(null);
  const [recents, setRecents] = useState<GeoResult[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [unit, setUnit] = useState<"C" | "F">("C");

  const [airQuality, setAirQuality] = useState<{
    aqi: number;
    pm2_5: number;
    pm10: number;
    ozone: number;
    status: string;
  } | null>(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem(LAST_LOCATION_KEY);
    const savedRecents = localStorage.getItem(RECENT_LOCATIONS_KEY);
    const savedUnit = localStorage.getItem(UNIT_KEY);

    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        if (parsed && typeof parsed.latitude === "number") {
          setLocation(parsed);
        } else {
          localStorage.removeItem(LAST_LOCATION_KEY);
        }
      } catch {
        localStorage.removeItem(LAST_LOCATION_KEY);
      }
    }

    if (savedRecents) {
      try {
        const parsed = JSON.parse(savedRecents);
        if (Array.isArray(parsed)) setRecents(parsed);
      } catch {
        localStorage.removeItem(RECENT_LOCATIONS_KEY);
      }
    }

    if (savedUnit === "F") setUnit("F");

    setHydrated(true);
  }, []);

  const selectLocation = (city: GeoResult) => {
    setLocation(city);
    localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(city));

    setRecents((prev) => {
      const withoutDup = prev.filter((l) => keyOf(l) !== keyOf(city));
      const next = [city, ...withoutDup].slice(0, MAX_RECENTS);
      localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeRecent = (city: GeoResult) => {
    setRecents((prev) => {
      const next = prev.filter((l) => keyOf(l) !== keyOf(city));
      localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const changeUnit = (value: "C" | "F") => {
    setUnit(value);
    localStorage.setItem(UNIT_KEY, value);
  };

  const { snapshot, loading, error, isOffline, refetch } = useWeather(location);

  useEffect(() => {
    if (!location) {
      setAirQuality(null);
      return;
    }

    let cancelled = false;

    async function loadAirQuality() {
      try {
        const url = new URL("/api/air-quality", window.location.origin);
        url.searchParams.set("lat", String(location!.latitude));
        url.searchParams.set("lon", String(location!.longitude));

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!cancelled && response.ok) setAirQuality(data);
      } catch {
        if (!cancelled) setAirQuality(null);
      }
    }

    loadAirQuality();
    return () => {
      cancelled = true;
    };
  }, [location]);

  const summary = useMemo(() => {
    if (!snapshot || !location) return "";
    const current = snapshot.current;
    const today = snapshot.daily[0];
    return `${location.name} is currently ${Math.round(
      current.temperature
    )}°. Humidity is ${current.humidity}%. It feels like ${Math.round(
      current.feelsLike
    )}°. Today's high is ${Math.round(
      today?.tempMax ?? current.temperature
    )}° and the low is ${Math.round(today?.tempMin ?? current.temperature)}°.`;
  }, [snapshot, location]);

  if (!hydrated) return null;

  const topBar = (
    <WeatherTopBar
      eyebrow="WeatherSphere Pro"
      title="Weather at a glance"
      unit={unit}
      onChangeUnit={changeUnit}
      onRefresh={() => refetch()}
      loading={loading}
      disabled={!location}
    />
  );

  const locationTabs = (
    <LocationTabs
      locations={recents}
      active={location}
      onSelect={selectLocation}
      onRemove={removeRecent}
    />
  );

  return (
    <WeatherBackground snapshot={snapshot}>
      <div className="w-full space-y-5">
        <CitySearch onSelect={selectLocation} current={location} />

        {!location && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
            <p className="font-display text-3xl text-cloud">Search for a city</p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate">
              Search for any city or use your current location to see live
              weather conditions, hourly forecasts, maps and detailed weather
              information.
            </p>
          </div>
        )}

        {location && isOffline && !snapshot && (
          <div className="rounded-3xl border border-amber/20 bg-amber/10 p-8 text-center text-amber-soft">
            You are offline and no cached weather data is available.
          </div>
        )}

        {location && error && !snapshot && (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-8 text-center text-red-200">
            <p>{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink"
            >
              Try again
            </button>
          </div>
        )}

        {snapshot && location && (
          <WeatherShell
            topBar={topBar}
            locationTabs={locationTabs}
            defaultView="current"
            views={{
              current: (
                <>
                  <CurrentWeatherHero
                    location={location}
                    snapshot={snapshot}
                    unit={unit}
                    summary={summary}
                  />
                  <Forecast10Day snapshot={snapshot} unit={unit} />
                  <WeatherWarnings snapshot={snapshot} />
                </>
              ),
              hourly: <HourlyTimeline snapshot={snapshot} unit={unit} />,
              details: (
                <div className="space-y-5">
                  <WeatherDetails snapshot={snapshot} unit={unit} />
                  <div className="grid gap-5 lg:grid-cols-2">
                    <SunMoonCard snapshot={snapshot} />
                    <AirQualityCard data={airQuality} />
                  </div>
                </div>
              ),
              maps: (
                <div className="min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/10 shadow-glass backdrop-blur-xl">
                  <WeatherMap location={location} snapshot={snapshot} />
                </div>
              ),
              monthly: <MonthlyCalendar snapshot={snapshot} unit={unit} />,
              trends: <WeatherTrends snapshot={snapshot} unit={unit} />,
            }}
          />
        )}
      </div>
    </WeatherBackground>
  );
}