"use client";

import {
  Droplets,
  Gauge,
  Eye,
  Sun,
  Thermometer,
  Wind
} from "lucide-react";

import type {
  WeatherSnapshot
} from "@/types/weather";

import {
  formatTemperature,
  formatVisibility,
  formatWindSpeed
} from "@/lib/units";

export function WeatherDetails({
  snapshot,
  unit
}: {
  snapshot: WeatherSnapshot;
  unit: "C" | "F";
}) {
  const current = snapshot.current;

  const details = [
    {
      icon: Wind,
      label: "Wind",
      value: formatWindSpeed(
        current.windSpeed
      ),
      description: `${Math.round(
        current.windDirection
      )}° direction`
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${current.humidity}%`,
      description: "Relative humidity"
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${Math.round(
        current.pressure
      )} hPa`,
      description: "Surface pressure"
    },
    {
      icon: Sun,
      label: "UV index",
      value: `${Math.round(
        current.uvIndex
      )}`,
      description: uvLabel(
        current.uvIndex
      )
    },
    {
      icon: Eye,
      label: "Visibility",
      value: formatVisibility(
        current.visibility
      ),
      description: "Viewing distance"
    },
    {
      icon: Thermometer,
      label: "Feels like",
      value: formatTemperature(
        current.feelsLike,
        unit
      ),
      description: "Apparent temperature"
    }
  ];

  return (
    <section className="panel panel-pad">

      <div className="mb-6">

        <p className="eyebrow">
          Details
        </p>

        <h2 className="panel-title">
          Weather metrics
        </h2>

      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

        {details.map(
          ({
            icon: Icon,
            label,
            value,
            description
          }) => (
            <div
              key={label}
              className="tile min-w-0 p-4"
            >

              <div className="flex items-center justify-between gap-3">

                <Icon className="h-5 w-5 shrink-0 text-cyan" />

                <span className="truncate text-xs text-slate">
                  {description}
                </span>

              </div>

              <p className="mt-5 text-xs text-slate">
                {label}
              </p>

              <p className="mt-1 text-xl font-semibold text-cloud">
                {value}
              </p>

            </div>
          )
        )}

      </div>

    </section>
  );
}

function uvLabel(value: number) {
  if (value <= 2) return "Low";
  if (value <= 5) return "Moderate";
  if (value <= 7) return "High";
  if (value <= 10) return "Very high";

  return "Extreme";
}