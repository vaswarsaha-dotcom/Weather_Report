"use client";

import { motion } from "framer-motion";
import { Droplets } from "lucide-react";

import type { WeatherSnapshot } from "@/types/weather";

import {
  getWeatherIcon,
  formatWeekday
} from "@/lib/weatherIcons";

import {
  formatTemperature
} from "@/lib/units";

export function Forecast10Day({
  snapshot,
  unit
}: {
  snapshot: WeatherSnapshot;
  unit: "C" | "F";
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-glass backdrop-blur-xl sm:p-6">

      <div className="mb-6">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
          Forecast
        </p>

        <h2 className="mt-1 font-display text-2xl text-cloud">
          10-day outlook
        </h2>

      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">

        {snapshot.daily
          .slice(0, 10)
          .map((day, index) => {

            const Icon = getWeatherIcon(
              day.weatherCode,
              true
            );

            return (
              <motion.div
                key={day.date}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.04
                }}
                className={`min-w-[125px] flex-1 rounded-2xl border p-4 ${
                  index === 0
                    ? "border-cyan/30 bg-cyan/10"
                    : "border-white/10 bg-black/10"
                }`}
              >

                <p className="text-xs font-semibold text-cloud">
                  {index === 0
                    ? "Today"
                    : formatWeekday(
                        day.date,
                        snapshot.location.timezone
                      )}
                </p>

                <Icon
                  className="my-5 h-8 w-8 text-cloud"
                  strokeWidth={1.5}
                />

                <div className="flex items-center justify-between">

                  <span className="text-sm font-semibold text-cloud">
                    {formatTemperature(
                      day.tempMax,
                      unit
                    )}
                  </span>

                  <span className="text-sm text-slate">
                    {formatTemperature(
                      day.tempMin,
                      unit
                    )}
                  </span>

                </div>

                <div className="mt-3 flex items-center gap-1 text-xs text-slate">

                  <Droplets className="h-3.5 w-3.5 text-cyan" />

                  {Math.round(
                    day.precipitationSum
                  )} mm

                </div>

              </motion.div>
            );
          })}

      </div>

    </section>
  );
}