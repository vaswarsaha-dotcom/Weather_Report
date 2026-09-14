// components/dashboard/DailyList.tsx
"use client";

import { WeatherIcon } from "@/components/dashboard/WeatherIcon";
import type { WeatherSnapshot } from "@/types/weather";

function toUnit(c: number, unit: "c" | "f") {
  return Math.round(unit === "c" ? c : (c * 9) / 5 + 32);
}
function dayName(iso: string, idx: number) {
  if (idx === 0) return "Today";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
  });
}
function dayDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function DailyList({
  weather,
  unit,
}: {
  weather: WeatherSnapshot;
  unit: "c" | "f";
}) {
  const { daily } = weather;

  const allLo = Math.min(...daily.map((d) => d.tempMin));
  const allHi = Math.max(...daily.map((d) => d.tempMax));
  const span = Math.max(1, allHi - allLo);

  return (
    <div>
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate mb-3">
        10-day outlook
      </h2>
      <div className="bg-dusk2/60 border border-white/10 rounded-xl2 divide-y divide-white/10">
        {daily.map((day, i) => {
          const lo = day.tempMin;
          const hi = day.tempMax;
          const leftPct = ((lo - allLo) / span) * 100;
          const widthPct = ((hi - lo) / span) * 100;

          return (
            <div
              key={day.date}
              className="grid grid-cols-[96px_28px_1fr_100px] items-center gap-3 px-4 py-3"
            >
              <div className="text-sm text-cloud">
                {dayName(day.date, i)}
                <span className="block text-[11px] font-mono text-slate-dim">
                  {dayDate(day.date)}
                </span>
              </div>

              <WeatherIcon code={day.weatherCode} isDay={true} size={22} />

              <div className="relative h-1 bg-white/10 rounded-full">
                <div
                  className="absolute h-1 rounded-full bg-gradient-to-r from-cyan to-amber"
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                />
              </div>

              <div className="flex justify-end gap-2.5 font-mono text-sm">
                <span className="text-slate-dim">{toUnit(lo, unit)}°</span>
                <span className="text-cloud font-medium">
                  {toUnit(hi, unit)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}