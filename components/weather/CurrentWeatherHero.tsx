"use client";

import { motion } from "framer-motion";

import {
  Cloud,
  Droplets,
  Eye,
  Gauge,
  Navigation,
  Sunrise,
  Sunset,
  Wind
} from "lucide-react";

import type {
  GeoResult,
  WeatherSnapshot
} from "@/types/weather";

import {
  WEATHER_CODE_LABELS
} from "@/types/weather";

import {
  getWeatherIcon,
  formatTime
} from "@/lib/weatherIcons";

import {
  formatTemperature,
  formatWindSpeed,
  formatVisibility
} from "@/lib/units";

interface Props {
  location: GeoResult;
  snapshot: WeatherSnapshot;
  unit: "C" | "F";
  summary: string;
}

export function CurrentWeatherHero({
  location,
  snapshot,
  unit,
  summary
}: Props) {
  const current = snapshot.current;
  const today = snapshot.daily[0];

  const Icon = getWeatherIcon(
    current.weatherCode,
    current.isDay
  );

  const condition =
    WEATHER_CODE_LABELS[current.weatherCode] ??
    "Changeable";

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.5
      }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-glass backdrop-blur-xl sm:p-8"
    >

      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />

      <div className="relative">

        <p className="text-sm text-slate">
          {location.name}
          {location.admin1
            ? `, ${location.admin1}`
            : ""}
          {location.country
            ? ` · ${location.country}`
            : ""}
        </p>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">

          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-white/10">
            <Icon
              className="h-16 w-16 text-cloud"
              strokeWidth={1.4}
            />
          </div>

          <div>

            <motion.p
              key={`${current.temperature}-${unit}`}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="font-display text-7xl font-semibold leading-none tracking-tight text-cloud"
            >
              {formatTemperature(
                current.temperature,
                unit
              )}
            </motion.p>

            <p className="mt-3 text-sm text-slate">
              {condition}
            </p>

            <p className="mt-1 text-sm text-slate">
              Feels like{" "}
              {formatTemperature(
                current.feelsLike,
                unit
              )}
            </p>

          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-3">

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-cloud">
            High{" "}
            {formatTemperature(
              today?.tempMax ??
                current.temperature,
              unit
            )}
          </span>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-cloud">
            Low{" "}
            {formatTemperature(
              today?.tempMin ??
                current.temperature,
              unit
            )}
          </span>

        </div>

        <p className="mt-6 max-w-2xl text-sm leading-6 text-slate">
          {summary}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">

          <MiniStat
            icon={Wind}
            label="Wind"
            value={formatWindSpeed(
              current.windSpeed
            )}
          />

          <MiniStat
            icon={Droplets}
            label="Humidity"
            value={`${current.humidity}%`}
          />

          <MiniStat
            icon={Eye}
            label="Visibility"
            value={formatVisibility(
              current.visibility
            )}
          />

          <MiniStat
            icon={Gauge}
            label="Pressure"
            value={`${Math.round(
              current.pressure
            )} hPa`}
          />

          <MiniStat
            icon={Cloud}
            label="Cloud cover"
            value={`${current.cloudCover}%`}
          />

          <MiniStat
            icon={Navigation}
            label="Wind direction"
            value={`${Math.round(
              current.windDirection
            )}°`}
          />

        </div>

        <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">

          <SunInfo
            icon={Sunrise}
            label="Sunrise"
            value={formatTime(
              current.sunrise,
              location.timezone
            )}
          />

          <SunInfo
            icon={Sunset}
            label="Sunset"
            value={formatTime(
              current.sunset,
              location.timezone
            )}
          />

        </div>

        <p className="mt-5 text-xs text-slate/60">
          Updated{" "}
          {formatTime(
            snapshot.fetchedAt,
            location.timezone
          )}
        </p>

      </div>

    </motion.section>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Wind;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">

      <Icon
        className="h-4 w-4 text-cyan"
      />

      <p className="mt-3 text-xs text-slate">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-cloud">
        {value}
      </p>

    </div>
  );
}

function SunInfo({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Sunrise;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">

      <span className="flex items-center gap-2 text-sm text-slate">
        <Icon className="h-4 w-4 text-amber" />
        {label}
      </span>

      <span className="font-mono text-sm text-cloud">
        {value}
      </span>

    </div>
  );
}