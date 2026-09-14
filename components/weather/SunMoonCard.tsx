"use client";

import {
  Moon,
  Sunrise,
  Sunset
} from "lucide-react";

import type {
  WeatherSnapshot
} from "@/types/weather";

import {
  formatTime
} from "@/lib/weatherIcons";

export function SunMoonCard({
  snapshot
}: {
  snapshot: WeatherSnapshot;
}) {
  const today = snapshot.daily[0];

  const sunrise =
    today?.sunrise ??
    snapshot.current.sunrise;

  const sunset =
    today?.sunset ??
    snapshot.current.sunset;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-glass backdrop-blur-xl">

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
        Sun & sky
      </p>

      <h2 className="mt-1 font-display text-2xl text-cloud">
        Daylight
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-3">

        <TimeCard
          icon={Sunrise}
          label="Sunrise"
          value={formatTime(
            sunrise,
            snapshot.location.timezone
          )}
        />

        <TimeCard
          icon={Sunset}
          label="Sunset"
          value={formatTime(
            sunset,
            snapshot.location.timezone
          )}
        />

      </div>

      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-black/10 p-4">

        <Moon className="h-5 w-5 text-cloud" />

        <div>

          <p className="text-xs text-slate">
            Daylight window
          </p>

          <p className="text-sm font-semibold text-cloud">
            {dayLength(
              sunrise,
              sunset
            )}
          </p>

        </div>

      </div>

    </section>
  );
}

function TimeCard({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Sunrise;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-black/10 p-4">

      <Icon className="h-5 w-5 text-amber" />

      <p className="mt-4 text-xs text-slate">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm text-cloud">
        {value}
      </p>

    </div>
  );
}

function dayLength(
  start: string,
  end: string
) {
  const difference = Math.max(
    0,
    new Date(end).getTime() -
      new Date(start).getTime()
  );

  const hours = Math.floor(
    difference / 3600000
  );

  const minutes = Math.floor(
    (difference % 3600000) / 60000
  );

  return `${hours}h ${minutes}m`;
}