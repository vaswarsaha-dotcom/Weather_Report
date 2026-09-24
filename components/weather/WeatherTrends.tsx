"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

import type { WeatherSnapshot } from "@/types/weather";

interface Props {
  snapshot: WeatherSnapshot;
  unit: "C" | "F";
}

interface HistoryPoint {
  recorded_at: string;
  temperature: number;
  humidity: number | null;
}

interface ChartPoint {
  timestamp: number;
  label: string;
  temperature: number;
}

type Range = "24H" | "7D" | "30D";

function convertTemperature(value: number, unit: "C" | "F") {
  if (unit === "F") {
    return value * 9 / 5 + 32;
  }

  return value;
}

function formatTemperature(value: number, unit: "C" | "F") {
  return `${value.toFixed(1)}°${unit}`;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartPoint;
  }>;
}) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-xl border border-white/10 bg-[#101827]/95 px-3.5 py-2.5 shadow-xl backdrop-blur-xl">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {point.label}
      </p>

      <p className="text-base font-semibold text-white">
        {point.temperature.toFixed(1)}°
      </p>
    </div>
  );
}

export function WeatherTrends({ snapshot, unit }: Props) {
  const [range, setRange] = useState<Range>("7D");
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const lat = snapshot?.location?.latitude;
  const lon = snapshot?.location?.longitude;

  /*
   * Load the same Supabase-backed history used by the History chart.
   *
   * This removes the broken:
   * /api/weather/trends
   * request completely.
   */
  useEffect(() => {
    if (lat == null || lon == null) {
      setHistory([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadHistory() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/history?lat=${lat}&lon=${lon}&days=30`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("History request failed");
        }

        const data = await response.json();

        if (!cancelled) {
          setHistory(data.snapshots || []);
        }
      } catch (error) {
        console.error("TRENDS HISTORY ERROR:", error);

        if (!cancelled) {
          setHistory([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  /*
   * Filter according to selected range.
   */
  const chartData = useMemo<ChartPoint[]>(() => {
    const now = Date.now();

    const rangeMs =
      range === "24H"
        ? 24 * 60 * 60 * 1000
        : range === "7D"
          ? 7 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;

    const start = now - rangeMs;

    return history
      .filter((item) => {
        const timestamp = new Date(item.recorded_at).getTime();
        return timestamp >= start;
      })
      .sort(
        (a, b) =>
          new Date(a.recorded_at).getTime() -
          new Date(b.recorded_at).getTime()
      )
      .map((item) => {
        const timestamp = new Date(item.recorded_at).getTime();

        const date = new Date(timestamp);

        const label =
          range === "24H"
            ? date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })
            : date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

        return {
          timestamp,
          label,
          temperature: convertTemperature(item.temperature, unit),
        };
      });
  }, [history, range, unit]);

  /*
   * Temperature statistics.
   */
  const stats = useMemo(() => {
    if (!chartData.length) return null;

    const temperatures = chartData.map((point) => point.temperature);

    const high = Math.max(...temperatures);
    const low = Math.min(...temperatures);

    const average =
      temperatures.reduce((sum, value) => sum + value, 0) /
      temperatures.length;

    const first = temperatures[0];
    const latest = temperatures[temperatures.length - 1];

    const delta = latest - first;

    return {
      high,
      low,
      average,
      delta,
    };
  }, [chartData]);

  /*
   * Tight y-axis just like the History chart.
   */
  const yRange = useMemo(() => {
    if (!chartData.length) {
      const current = convertTemperature(
        snapshot.current.temperature,
        unit
      );

      return {
        min: Math.floor(current - 5),
        max: Math.ceil(current + 5),
      };
    }

    const values = chartData.map((point) => point.temperature);

    const min = Math.min(...values);
    const max = Math.max(...values);

    const spread = max - min;

    const padding = Math.max(
      1.5,
      spread * 0.18
    );

    return {
      min: Math.floor(min - padding),
      max: Math.ceil(max + padding),
    };
  }, [chartData, snapshot.current.temperature, unit]);

  const deltaIcon =
    stats && stats.delta > 0.2
      ? TrendingUp
      : stats && stats.delta < -0.2
        ? TrendingDown
        : Minus;

  const DeltaIcon = deltaIcon;

  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        border border-white/10
        bg-[#0d1524]/90
        shadow-glass
        backdrop-blur-xl
      "
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 p-5 pb-3 sm:p-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Trends
          </p>

          <h2 className="mt-1 font-display text-xl font-semibold text-white">
            Temperature trend
          </h2>

          <p className="mt-1 text-xs text-slate">
            Historical temperature readings for {snapshot.location.name}
          </p>
        </div>

        {/* Range buttons */}
        <div className="flex rounded-xl border border-white/10 bg-black/20 p-1">
          {(["24H", "7D", "30D"] as Range[]).map((item) => {
            const active = range === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setRange(item)}
                className={`
                  rounded-lg
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  transition-all
                  ${
                    active
                      ? "bg-amber/15 text-amber-soft ring-1 ring-amber/20"
                      : "text-slate hover:text-white"
                  }
                `}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-2 px-5 pb-4 sm:px-6">
          <div className="rounded-xl bg-white/[0.025] px-3 py-2.5">
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              High
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {formatTemperature(stats.high, unit)}
            </p>
          </div>

          <div className="rounded-xl bg-white/[0.025] px-3 py-2.5">
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              Low
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {formatTemperature(stats.low, unit)}
            </p>
          </div>

          <div className="rounded-xl bg-white/[0.025] px-3 py-2.5">
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              Average
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {formatTemperature(stats.average, unit)}
            </p>
          </div>

          <div className="rounded-xl bg-white/[0.025] px-3 py-2.5">
            <p className="text-[9px] uppercase tracking-wider text-slate-500">
              Change
            </p>

            <div className="mt-1 flex items-center gap-1.5">
              <DeltaIcon
                className={`h-3.5 w-3.5 ${
                  stats.delta > 0.2
                    ? "text-emerald-400"
                    : stats.delta < -0.2
                      ? "text-red-400"
                      : "text-slate"
                }`}
              />

              <span className="text-sm font-semibold text-white">
                {stats.delta > 0 ? "+" : ""}
                {stats.delta.toFixed(1)}°
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="px-3 pb-5 sm:px-5">
        {loading ? (
          <div className="flex h-[310px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-amber-400" />
              Loading temperature history...
            </div>
          </div>
        ) : chartData.length < 2 ? (
          <div className="flex h-[310px] flex-col items-center justify-center px-6 text-center">
            <TrendingUp className="mb-3 h-6 w-6 text-slate-500" />

            <p className="text-sm font-medium text-white">
              Not enough historical readings yet
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate">
              The chart will become denser as WeatherSphere records more
              temperature readings.
            </p>
          </div>
        ) : (
          <div className="h-[310px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -18,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="trendGreenFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#22c55e"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="55%"
                      stopColor="#22c55e"
                      stopOpacity={0.12}
                    />

                    <stop
                      offset="100%"
                      stopColor="#22c55e"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={35}
                  tick={{
                    fill: "#64748b",
                    fontSize: 10,
                  }}
                />

                <YAxis
                  domain={[yRange.min, yRange.max]}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                  tick={{
                    fill: "#64748b",
                    fontSize: 10,
                  }}
                  tickFormatter={(value) =>
                    `${value}°`
                  }
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "rgba(255,255,255,0.22)",
                    strokeDasharray: "4 4",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#trendGreenFill)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#22c55e",
                    stroke: "#0d1524",
                    strokeWidth: 2,
                  }}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-5 py-3 sm:px-6">
        <p className="text-[10px] text-slate-500">
          Based on recorded weather observations. More readings produce a
          denser chart.
        </p>
      </div>
    </section>
  );
}

export default WeatherTrends;