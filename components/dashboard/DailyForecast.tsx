import type { WeatherSnapshot } from "@/types/weather";
import { getWeatherIcon, formatWeekday } from "@/lib/weatherIcons";
import { GlassCard } from "@/components/ui/Card";

export function DailyForecast({ snapshot, timezone }: { snapshot: WeatherSnapshot; timezone: string }) {
  const maxTemp = Math.max(...snapshot.daily.map((d) => d.tempMax));
  const minTemp = Math.min(...snapshot.daily.map((d) => d.tempMin));
  const range = Math.max(maxTemp - minTemp, 1);

  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-lg font-medium text-cloud">7-day forecast</h3>
      <div className="mt-4 space-y-1">
        {snapshot.daily.map((d, i) => {
          const Icon = getWeatherIcon(d.weatherCode);
          const leftPct = ((d.tempMin - minTemp) / range) * 100;
          const widthPct = ((d.tempMax - d.tempMin) / range) * 100;
          return (
            <div
              key={d.date}
              className="grid grid-cols-[64px_28px_1fr_auto] items-center gap-4 rounded-lg px-2 py-2.5 transition hover:bg-white/5"
            >
              <span className="text-sm text-slate">{i === 0 ? "Today" : formatWeekday(d.date, timezone)}</span>
              <Icon className="h-4 w-4 text-amber" aria-hidden="true" />
              <div className="relative h-1.5 rounded-full bg-white/10">
                <div
                  className="absolute h-1.5 rounded-full bg-gradient-to-r from-cyan to-amber"
                  style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 6)}%` }}
                />
              </div>
              <span className="font-mono text-sm text-cloud">
                {Math.round(d.tempMax)}° <span className="text-slate">{Math.round(d.tempMin)}°</span>
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
