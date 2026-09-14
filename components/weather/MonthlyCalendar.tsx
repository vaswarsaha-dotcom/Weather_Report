"use client";

import type { WeatherSnapshot } from "@/types/weather";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { formatTemperature } from "@/lib/units";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthlyCalendar({
  snapshot,
  unit,
}: {
  snapshot: WeatherSnapshot;
  unit: "C" | "F";
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dailyByDate = new Map(
    snapshot.daily.map((d) => [d.date, d])
  );

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const monthLabel = firstOfMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-glass backdrop-blur-xl sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
          Monthly
        </p>
        <h2 className="mt-1 font-display text-2xl text-cloud">{monthLabel}</h2>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-[11px] text-slate">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1">
            {w}
          </div>
        ))}

        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;

          const iso = date.toISOString().slice(0, 10);
          const day = dailyByDate.get(iso);
          const isToday = iso === now.toISOString().slice(0, 10);
          const Icon = day ? getWeatherIcon(day.weatherCode, true) : null;

          return (
            <div
              key={iso}
              className={`flex min-h-[92px] flex-col items-center justify-between rounded-2xl border p-2 ${
                isToday
                  ? "border-cyan/40 bg-cyan/10"
                  : day
                  ? "border-white/10 bg-black/10"
                  : "border-white/5 bg-black/5 opacity-40"
              }`}
            >
              <span className="text-xs text-cloud">{date.getDate()}</span>

              {day && Icon ? (
                <>
                  <Icon className="h-5 w-5 text-cloud" strokeWidth={1.5} />
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="font-semibold text-cloud">
                      {formatTemperature(day.tempMax, unit)}
                    </span>
                    <span className="text-slate">
                      {formatTemperature(day.tempMin, unit)}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-[10px] text-slate-dim">No data</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}