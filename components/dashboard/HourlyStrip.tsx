// components/dashboard/HourlyStrip.tsx
"use client";

import { WeatherIcon } from "@/components/dashboard/WeatherIcon";
import type { WeatherSnapshot } from "@/types/weather";

function toUnit(c: number, unit: "c" | "f") {
  return Math.round(unit === "c" ? c : (c * 9) / 5 + 32);
}
function fmtHour(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
}

function isDayAt(time: string, weather: WeatherSnapshot) {
  const t = new Date(time).getTime();
  const dateKey = time.slice(0, 10);
  const day = weather.daily.find((d) => d.date === dateKey);
  if (!day) return weather.current.isDay;
  const sunrise = new Date(day.sunrise).getTime();
  const sunset = new Date(day.sunset).getTime();
  return t >= sunrise && t <= sunset;
}

export function HourlyStrip({ weather, unit }: { weather: WeatherSnapshot; unit: "c" | "f" }) {
  const { hourly, current } = weather;
  const nowIdx = Math.max(
    0,
    hourly.findIndex((point) => new Date(point.time) >= new Date(current.observedAt))
  );
  const slice = hourly.slice(nowIdx, nowIdx + 24);

  return (
    <div>
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate mb-3">Next 24 hours</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {slice.map((point, i) => {
          const pop = point.precipitationProbability;
          return (
            <div key={point.time} className="shrink-0 w-[74px] bg-dusk2/60 border border-white/10 rounded-xl py-3 text-center">
              <div className="font-mono text-[11px] text-slate-dim mb-2">{i === 0 ? "Now" : fmtHour(point.time)}</div>
              <div className="flex justify-center mb-2">
                <WeatherIcon code={point.weatherCode} isDay={isDayAt(point.time, weather)} size={26} />
              </div>
              <div className="font-display text-base font-bold text-cloud">{toUnit(point.temperature, unit)}°</div>
              <div className="font-mono text-[10.5px] text-cyan mt-1 h-3">{pop >= 15 ? `${pop}%` : ""}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}