import { Wind, Droplets, Gauge, Sun, Eye, Sunrise, Sunset, CloudRain } from "lucide-react";
import type { WeatherSnapshot } from "@/types/weather";
import { formatTime } from "@/lib/weatherIcons";
import { GlassCard } from "@/components/ui/Card";

export function StatGrid({ snapshot, timezone }: { snapshot: WeatherSnapshot; timezone: string }) {
  const { current } = snapshot;

  const stats = [
    { icon: Wind, label: "Wind", value: `${Math.round(current.windSpeed)} km/h` },
    { icon: Droplets, label: "Humidity", value: `${current.humidity}%` },
    { icon: Gauge, label: "Pressure", value: `${Math.round(current.pressure)} hPa` },
    { icon: Sun, label: "UV Index", value: `${Math.round(current.uvIndex)}` },
    { icon: Eye, label: "Visibility", value: `${(current.visibility / 1000).toFixed(1)} km` },
    { icon: CloudRain, label: "Precipitation", value: `${current.precipitation.toFixed(1)} mm` },
    { icon: Sunrise, label: "Sunrise", value: formatTime(current.sunrise, timezone) },
    { icon: Sunset, label: "Sunset", value: formatTime(current.sunset, timezone) }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <GlassCard key={s.label} className="p-4">
          <s.icon className="h-4 w-4 text-cyan" aria-hidden="true" />
          <p className="mt-3 font-mono text-lg text-cloud">{s.value}</p>
          <p className="text-xs text-slate">{s.label}</p>
        </GlassCard>
      ))}
    </div>
  );
}
