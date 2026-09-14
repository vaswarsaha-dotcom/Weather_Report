// components/dashboard/ForecastHero.tsx
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { WeatherIcon, weatherLabel } from "@/components/dashboard/WeatherIcon";
import type { WeatherSnapshot } from "@/types/weather";

function fmtClock(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
}

interface ForecastHeroProps {
  weather: WeatherSnapshot & { placeName: string };
  unit: "c" | "f";
  summary?: string;
}

function toUnit(c: number, unit: "c" | "f") {
  return Math.round(unit === "c" ? c : (c * 9) / 5 + 32);
}

export function ForecastHero({ weather, unit, summary }: ForecastHeroProps) {
  const { current, daily, placeName } = weather;
  const today = daily[0];
  const sunrise = new Date(today.sunrise);
  const sunset = new Date(today.sunset);
  const now = new Date(current.observedAt);
  const isDay = current.isDay;

  let frac = 0.5;
  if (isDay) frac = Math.min(1, Math.max(0, (now.getTime() - sunrise.getTime()) / (sunset.getTime() - sunrise.getTime())));

  const baseY = 78, topY = 14;
  const t = frac;
  const dotX = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 200 + t * t * 390;
  const dotY = (1 - t) * (1 - t) * baseY + 2 * (1 - t) * t * topY + t * t * baseY;

  const skyClass = !isDay
    ? "from-ink via-dusk to-dusk2"
    : frac < 0.12 || frac > 0.88
    ? "from-[#2B2140] via-[#6B3A3A] to-[#C97A45]"
    : "from-[#123049] via-[#16405F] to-[#1C5578]";

  return (
    <GlassCard className={`bg-gradient-to-br ${skyClass} border-white/10`} padded={false}>
      <div className="p-7">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="font-display text-2xl text-cloud">{placeName}</h1>
            <p className="font-mono text-xs text-cloud/70 mt-1">
              {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <WeatherIcon code={current.weatherCode} isDay={isDay} size={56} />
        </div>

        <div className="flex items-end gap-5 mt-5 flex-wrap">
          <div className="font-display text-7xl font-bold text-cloud leading-none">
            {toUnit(current.temperature, unit)}
            <sup className="text-3xl font-medium ml-0.5">°{unit.toUpperCase()}</sup>
          </div>
          <div className="pb-2">
            <div className="text-cloud text-base">{weatherLabel(current.weatherCode)}</div>
            <div className="font-mono text-xs text-cloud/70 mt-1">
              Feels like {toUnit(current.feelsLike, unit)}°{unit.toUpperCase()}
            </div>
          </div>
          <div className="ml-auto pb-2 font-mono text-sm text-cloud/70 flex gap-3">
            <span>H <b className="text-cloud font-medium">{toUnit(today.tempMax, unit)}°</b></span>
            <span>L <b className="text-cloud font-medium">{toUnit(today.tempMin, unit)}°</b></span>
          </div>
        </div>

        {summary && <p className="text-sm text-cloud/80 mt-4 max-w-xl leading-relaxed">{summary}</p>}

        <div className="mt-6">
          <svg viewBox="0 0 400 90" width="100%" height="64" preserveAspectRatio="xMidYMid meet">
            <path d="M 10 78 Q 200 14 390 78" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="2 5" />
            <line x1="10" y1="78" x2="390" y2="78" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            {isDay ? (
              <>
                <circle cx={dotX} cy={dotY} r="7" fill="#F5A623" />
                <circle cx={dotX} cy={dotY} r="12" fill="#F5A623" opacity="0.2" />
              </>
            ) : (
              <circle cx="200" cy="24" r="6" fill="#9FB3C2" opacity="0.7" />
            )}
          </svg>
          <div className="flex justify-between font-mono text-[11px] text-cloud/60 -mt-1">
            <span>sunrise {fmtClock(today.sunrise)}</span>
            <span>{isDay ? `now ${fmtClock(current.observedAt)}` : "night"}</span>
            <span>sunset {fmtClock(today.sunset)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}