"use client";

import { motion } from "framer-motion";
import type { GeoResult, WeatherSnapshot } from "@/types/weather";
import { getWeatherIcon, formatTime } from "@/lib/weatherIcons";
import { WEATHER_CODE_LABELS } from "@/types/weather";
import { GlassCard } from "@/components/ui/Card";

export function CurrentWeatherCard({
  location,
  snapshot,
  summary
}: {
  location: GeoResult;
  snapshot: WeatherSnapshot;
  summary: string;
}) {
  const Icon = getWeatherIcon(snapshot.current.weatherCode, snapshot.current.isDay);
  const condition = WEATHER_CODE_LABELS[snapshot.current.weatherCode] ?? "Changeable";

  return (
    <GlassCard className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm text-slate">
            {location.name}
            {location.admin1 ? `, ${location.admin1}` : ""} {location.country ? `· ${location.country}` : ""}
          </p>
          <motion.p
            key={snapshot.current.temperature}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-6xl font-medium text-cloud"
          >
            {Math.round(snapshot.current.temperature)}°
          </motion.p>
          <p className="mt-1 text-sm text-slate">
            Feels like {Math.round(snapshot.current.feelsLike)}° · {condition}
          </p>
        </div>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber to-amber-soft">
          <Icon className="h-10 w-10 text-ink" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="font-mono text-xs leading-relaxed text-slate">{summary}</p>
      </div>

      <p className="mt-4 text-xs text-slate/60">
        Updated {formatTime(snapshot.fetchedAt)} · Source: {snapshot.provider === "open-meteo" ? "Open-Meteo" : "OpenWeatherMap"}
      </p>
    </GlassCard>
  );
}
