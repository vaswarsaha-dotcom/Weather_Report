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
    <section className="panel panel-pad">

      <div className="mb-6">

        <p className="eyebrow">
          Forecast
        </p>

        <h2 className="panel-title">
          10-day outlook
        </h2>

      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">

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
                className={`min-w-0 rounded-2xl border p-4 transition-colors hover:border-white/20 ${
                  index === 0
                    ? "border-cyan/30 bg-cyan/10"
                    : "border-white/[0.07] bg-black/15"
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