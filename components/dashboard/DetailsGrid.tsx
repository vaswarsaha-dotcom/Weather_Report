// components/dashboard/DetailsGrid.tsx
"use client";
import { GlassCard } from "@/components/ui/GlassCard";
import type { WeatherSnapshot } from "@/types/weather";

function compassDir(deg: number) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}
function uvLabel(uv: number) {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
}

export function DetailsGrid({ weather }: { weather: WeatherSnapshot }) {
  const { current, daily } = weather;
  const today = daily[0];
  const items = [
    { label: "Wind", val: `${Math.round(current.windSpeed)} km/h`, sub: compassDir(current.windDirection) },
    { label: "Humidity", val: `${current.humidity}%`, sub: "Relative" },
    { label: "UV index", val: `${Math.round(today?.uvIndexMax ?? current.uvIndex)}`, sub: uvLabel(today?.uvIndexMax ?? current.uvIndex) },
    { label: "Pressure", val: `${Math.round(current.pressure)} hPa`, sub: "Sea level adj." },
    { label: "Precipitation", val: `${(today?.precipitationSum ?? 0).toFixed(1)} mm`, sub: "Today" },
    { label: "Visibility", val: current.visibility ? `${Math.round(current.visibility / 1000)} km` : "—", sub: "Ground level" },
  ];

  return (
    <div>
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate mb-3">Conditions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {items.map((it) => (
          <GlassCard key={it.label} className="bg-dusk2/60">
            <div className="font-mono text-[11px] uppercase tracking-wide text-slate-dim">{it.label}</div>
            <div className="font-display text-xl font-bold text-cloud mt-1.5">{it.val}</div>
            <div className="text-[11.5px] text-slate mt-0.5">{it.sub}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}