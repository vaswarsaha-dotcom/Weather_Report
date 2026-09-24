"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from "recharts";

import type {
  WeatherSnapshot
} from "@/types/weather";

import {
  getWeatherIcon,
  formatHour
} from "@/lib/weatherIcons";

import {
  formatTemperature,
  celsiusToFahrenheit
} from "@/lib/units";

export function HourlyTimeline({
  snapshot,
  unit
}: {
  snapshot: WeatherSnapshot;
  unit: "C" | "F";
}) {
  const chartData =
    snapshot.hourly
      .slice(0, 24)
      .map((point) => ({
        label: formatHour(
          point.time,
          snapshot.location.timezone
        ),
        temperature: Math.round(
          unit === "C"
            ? point.temperature
            : celsiusToFahrenheit(
                point.temperature
              )
        )
      }));

  return (
    <section className="panel panel-pad">

      <div className="mb-5">

        <p className="eyebrow">
          Hourly
        </p>

        <h2 className="panel-title">
          Next 24 hours
        </h2>

      </div>

      <div className="h-[240px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 8,
              left: -20,
              bottom: 0
            }}
          >

            <defs>
              <linearGradient
                id="temperatureFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#35c5e0"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#35c5e0"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="label"
              tick={{
                fill: "#7C89A6",
                fontSize: 11
              }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />

            <Tooltip
              contentStyle={{
                background: "#161F38",
                border:
                  "1px solid rgba(255,255,255,.1)",
                borderRadius: 12,
                color: "#F4F6FA"
              }}
              formatter={(value) => [
                `${value}°`,
                "Temperature"
              ]}
            />

            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#35c5e0"
              strokeWidth={3}
              fill="url(#temperatureFill)"
              dot={false}
              activeDot={{ r: 5 }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2">

        {snapshot.hourly
          .slice(0, 24)
          .map((point) => {

            const Icon = getWeatherIcon(
              point.weatherCode,
              true
            );

            return (
              <div
                key={point.time}
                className="tile min-w-[72px] shrink-0 snap-start p-3 text-center"
              >

                <p className="text-[11px] text-slate">
                  {formatHour(
                    point.time,
                    snapshot.location.timezone
                  )}
                </p>

                <Icon
                  className="mx-auto my-2 h-5 w-5 text-cloud"
                  strokeWidth={1.5}
                />

                <p className="text-sm font-semibold text-cloud">
                  {formatTemperature(
                    point.temperature,
                    unit
                  )}
                </p>

                <p className="mt-1 text-[10px] text-cyan">
                  {point.precipitationProbability}%
                </p>

              </div>
            );
          })}

      </div>

    </section>
  );
}