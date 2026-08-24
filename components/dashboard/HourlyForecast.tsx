import type { WeatherSnapshot } from "@/types/weather";
import { getWeatherIcon, formatHour } from "@/lib/weatherIcons";
import { GlassCard } from "@/components/ui/Card";

export function HourlyForecast({ snapshot, timezone }: { snapshot: WeatherSnapshot; timezone: string }) {
  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-lg font-medium text-cloud">Hourly forecast</h3>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {snapshot.hourly.map((h) => {
          const Icon = getWeatherIcon(h.weatherCode);
          return (
            <div
              key={h.time}
              className="flex min-w-[72px] flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-4"
            >
              <p className="text-xs text-slate">{formatHour(h.time, timezone)}</p>
              <Icon className="h-5 w-5 text-amber" aria-hidden="true" />
              <p className="font-mono text-sm text-cloud">{Math.round(h.temperature)}°</p>
              <p className="text-[11px] text-cyan">{h.precipitationProbability}%</p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
