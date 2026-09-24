import {
  AlertTriangle,
  CloudRain,
  Zap
} from "lucide-react";

import type {
  WeatherSnapshot
} from "@/types/weather";

export function WeatherWarnings({
  snapshot
}: {
  snapshot: WeatherSnapshot;
}) {
  const thunderstorm =
    [95, 96, 99].includes(
      snapshot.current.weatherCode
    );

  const heavyRain =
    snapshot.hourly
      .slice(0, 12)
      .some(
        (point) =>
          point.precipitationProbability >= 75
      );

  if (!thunderstorm && !heavyRain) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-amber/25 bg-amber/10 p-5 shadow-glass backdrop-blur-xl sm:p-6">

      <div className="flex items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber/15">

          {thunderstorm ? (
            <Zap className="h-5 w-5 text-amber" />
          ) : (
            <CloudRain className="h-5 w-5 text-amber" />
          )}

        </div>

        <div>

          <div className="flex items-center gap-2">

            <AlertTriangle className="h-4 w-4 text-amber" />

            <p className="font-semibold text-cloud">
              Weather heads-up
            </p>

          </div>

          <p className="mt-1 text-sm leading-6 text-amber-soft">

            {thunderstorm
              ? "Thunderstorm conditions are currently reported. Check local conditions before travelling."
              : "There is a high chance of precipitation during the next several hours."}

          </p>

        </div>

      </div>

    </section>
  );
}