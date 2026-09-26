// components/dashboard/HistoryChart.tsx
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

type Range = "24H" | "7D" | "30D" | "ALL";

interface Snapshot {
  id?: string;
  recorded_at: string;
  temperature: number;
  humidity: number | null;
}

interface ChartPoint {
  timestamp: number;
  time: string;
  fullTime: string;
  temperature: number;
  humidity: number | null;
}

interface HistoryResponse {
  snapshots?: Snapshot[];
  timezone?: string;
  source?: string;
  error?: string;
}

interface HistoryChartProps {
  lat?: number | null;
  lon?: number | null;
}

function formatTemperature(value: number) {
  return `${value.toFixed(1)}°`;
}

function formatShortTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatFullTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload as ChartPoint | undefined;

  if (!point) return null;

  return (
    <div className="min-w-[190px] rounded-xl border border-emerald-400/30 bg-[#0b1220]/95 p-3 shadow-2xl backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />

        <span className="text-xs font-medium text-slate-400">
          Temperature
        </span>
      </div>

      <div className="text-2xl font-semibold tracking-tight text-white">
        {formatTemperature(point.temperature)}
      </div>

      <div className="mt-1 text-[11px] text-slate-500">
        {point.fullTime}
      </div>

      {typeof point.humidity === "number" && (
        <div className="mt-2 border-t border-white/10 pt-2 text-xs text-slate-400">
          Humidity{" "}
          <span className="font-medium text-slate-200">
            {Math.round(point.humidity)}%
          </span>
        </div>
      )}
    </div>
  );
}

export default function HistoryChart({
  lat,
  lon,
}: HistoryChartProps) {
  const [range, setRange] = useState<Range>("24H");

  const [snapshots, setSnapshots] = useState<Snapshot[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  /*
   * ---------------------------------------------------------
   * LOAD HISTORY
   * ---------------------------------------------------------
   *
   * We no longer depend on lat/lon being present.
   *
   * The API can determine the user's latest weather location.
   */
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const days =
        range === "24H"
          ? 1
          : range === "7D"
            ? 7
            : range === "30D"
              ? 30
              : 365;

      const params = new URLSearchParams();

      params.set("days", String(days));

      /*
       * If the page supplied coordinates, pass them.
       * Otherwise the API uses the user's latest snapshot.
       */
      if (
        typeof lat === "number" &&
        Number.isFinite(lat)
      ) {
        params.set("lat", String(lat));
      }

      if (
        typeof lon === "number" &&
        Number.isFinite(lon)
      ) {
        params.set("lon", String(lon));
      }

      const response = await fetch(
        `/api/history?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const result =
        (await response.json()) as HistoryResponse;

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to load weather history."
        );
      }

      const nextSnapshots =
        Array.isArray(result.snapshots)
          ? result.snapshots
          : [];

      setSnapshots(nextSnapshots);

      setLastUpdated(new Date());
    } catch (err) {
      console.error(
        "HISTORY CHART ERROR:",
        err
      );

      setSnapshots([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load history."
      );
    } finally {
      setLoading(false);
    }
  }, [range, lat, lon]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /*
   * ---------------------------------------------------------
   * CONVERT DATA
   * ---------------------------------------------------------
   */
  const chartData = useMemo<ChartPoint[]>(() => {
    return snapshots
      .filter(
        (snapshot) =>
          Number.isFinite(snapshot.temperature) &&
          !!snapshot.recorded_at
      )
      .map((snapshot) => {
        const timestamp = new Date(
          snapshot.recorded_at
        ).getTime();

        return {
          timestamp,
          time: formatShortTime(timestamp),
          fullTime: formatFullTime(timestamp),
          temperature:
            Math.round(
              snapshot.temperature * 10
            ) / 10,
          humidity: snapshot.humidity,
        };
      })
      .filter(
        (point) =>
          Number.isFinite(point.timestamp)
      )
      .sort(
        (a, b) =>
          a.timestamp - b.timestamp
      );
  }, [snapshots]);

  /*
   * ---------------------------------------------------------
   * STATS
   * ---------------------------------------------------------
   */
  const stats = useMemo(() => {
    if (!chartData.length) {
      return {
        current: null,
        high: null,
        low: null,
        average: null,
        change: null,
      };
    }

    const temperatures = chartData.map(
      (point) => point.temperature
    );

    const high = Math.max(
      ...temperatures
    );

    const low = Math.min(
      ...temperatures
    );

    const average =
      temperatures.reduce(
        (sum, value) => sum + value,
        0
      ) / temperatures.length;

    const current =
      chartData[chartData.length - 1]
        .temperature;

    const first =
      chartData[0].temperature;

    return {
      current,
      high,
      low,
      average,
      change: current - first,
    };
  }, [chartData]);

  /*
   * ---------------------------------------------------------
   * TIGHT Y AXIS
   * ---------------------------------------------------------
   *
   * This is important.
   *
   * Your old chart used a large minimum padding which made
   * a small temperature change look completely flat.
   */
  const yDomain = useMemo(() => {
    if (!chartData.length) {
      return [0, 30];
    }

    const values = chartData.map(
      (point) => point.temperature
    );

    const min = Math.min(...values);
    const max = Math.max(...values);

    const spread = max - min;

    const padding =
      spread < 1
        ? 0.6
        : Math.max(
            0.5,
            spread * 0.18
          );

    return [
      Math.floor((min - padding) * 2) / 2,
      Math.ceil((max + padding) * 2) / 2,
    ];
  }, [chartData]);

  /*
   * ---------------------------------------------------------
   * X AXIS TICKS
   * ---------------------------------------------------------
   */
  const xTicks = useMemo(() => {
    if (!chartData.length) return [];

    if (range === "24H") {
      /*
       * Display approximately every 2 hours.
       */
      return chartData
        .filter((_, index) => index % 8 === 0)
        .map((point) => point.timestamp);
    }

    if (range === "7D") {
      return chartData
        .filter((_, index) => index % 12 === 0)
        .map((point) => point.timestamp);
    }

    return chartData
      .filter((_, index) => index % 24 === 0)
      .map((point) => point.timestamp);
  }, [chartData, range]);

  /*
   * ---------------------------------------------------------
   * DATE LABEL
   * ---------------------------------------------------------
   */
  const rangeLabel = useMemo(() => {
    if (!chartData.length) {
      return "No readings available";
    }

    const first = new Date(
      chartData[0].timestamp
    );

    const last = new Date(
      chartData[
        chartData.length - 1
      ].timestamp
    );

    if (range === "24H") {
      return first.toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
          day: "numeric",
          month: "short",
        }
      );
    }

    return `${first.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    )} – ${last.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    )}`;
  }, [chartData, range]);

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101827] shadow-[0_18px_60px_rgba(0,0,0,.18)]">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="border-b border-white/[0.07] px-5 pb-4 pt-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Activity
                size={15}
                className="text-emerald-400"
              />

              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Temperature trend
              </span>
            </div>

            <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Weather history
              </h2>

              {stats.current !== null && (
                <div className="pb-0.5 text-2xl font-semibold text-emerald-400">
                  {formatTemperature(
                    stats.current
                  )}
                </div>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays size={13} />

              <span>{rangeLabel}</span>

              {chartData.length > 0 && (
                <>
                  <span>•</span>

                  <span>
                    {chartData.length} readings
                  </span>
                </>
              )}
            </div>
          </div>

          {/* RANGE BUTTONS */}
          <div className="flex w-fit items-center rounded-xl border border-white/[0.08] bg-black/20 p-1">
            {(
              [
                "24H",
                "7D",
                "30D",
                "ALL",
              ] as Range[]
            ).map((item) => {
              const active =
                range === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setRange(item)
                  }
                  className={[
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    active
                      ? "bg-emerald-500 text-[#06130e] shadow-[0_0_18px_rgba(16,185,129,.22)]"
                      : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200",
                  ].join(" ")}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================
          STAT STRIP
      ====================================================== */}
      {stats.current !== null && (
        <div className="grid grid-cols-2 border-b border-white/[0.07] sm:grid-cols-4">
          <div className="border-r border-white/[0.07] px-5 py-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">
              Current
            </div>

            <div className="mt-1 text-xl font-semibold text-white">
              {formatTemperature(
                stats.current
              )}
            </div>
          </div>

          <div className="border-b border-white/[0.07] px-5 py-4 sm:border-b-0 sm:border-r">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-slate-500">
              <ArrowUp
                size={11}
                className="text-emerald-400"
              />
              High
            </div>

            <div className="mt-1 text-xl font-semibold text-emerald-400">
              {formatTemperature(
                stats.high!
              )}
            </div>
          </div>

          <div className="border-r border-white/[0.07] px-5 py-4">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-slate-500">
              <ArrowDown
                size={11}
                className="text-sky-400"
              />
              Low
            </div>

            <div className="mt-1 text-xl font-semibold text-sky-400">
              {formatTemperature(
                stats.low!
              )}
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">
              Average
            </div>

            <div className="mt-1 text-xl font-semibold text-slate-200">
              {formatTemperature(
                stats.average!
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          GRAPH
      ====================================================== */}
      <div className="px-2 pb-3 pt-4 sm:px-4">
        {loading ? (
          <div className="flex h-[320px] sm:h-[430px] items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <RefreshCw
                size={15}
                className="animate-spin"
              />

              Loading weather history...
            </div>
          </div>
        ) : error ? (
          <div className="flex h-[320px] sm:h-[430px] flex-col items-center justify-center px-6 text-center">
            <div className="text-sm font-medium text-red-300">
              Could not load history
            </div>

            <div className="mt-1 max-w-md text-xs text-slate-500">
              {error}
            </div>

            <button
              type="button"
              onClick={loadHistory}
              className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08]"
            >
              Try again
            </button>
          </div>
        ) : chartData.length < 2 ? (
          <div className="flex h-[320px] sm:h-[430px] flex-col items-center justify-center px-6 text-center">
            <Activity
              size={28}
              className="mb-3 text-emerald-400/50"
            />

            <div className="text-sm font-medium text-slate-300">
              Waiting for weather history
            </div>

            <div className="mt-1 max-w-md text-xs leading-5 text-slate-500">
              Weather readings will appear here
              automatically once the history API
              has data for this account.
            </div>
          </div>
        ) : (
          <div className="h-[320px] sm:h-[430px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={chartData}
                margin={{
                  top: 18,
                  right: 24,
                  left: 2,
                  bottom: 12,
                }}
              >
                <defs>
                  {/* Main stock-style gradient */}
                  <linearGradient
                    id="weatherAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#34d399"
                      stopOpacity={0.42}
                    />

                    <stop
                      offset="35%"
                      stopColor="#22c55e"
                      stopOpacity={0.24}
                    />

                    <stop
                      offset="72%"
                      stopColor="#0ea5e9"
                      stopOpacity={0.09}
                    />

                    <stop
                      offset="100%"
                      stopColor="#0ea5e9"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  {/* Glow behind the line */}
                  <filter
                    id="weatherLineGlow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur
                      stdDeviation="3"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode
                        in="blur"
                      />

                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="rgba(148,163,184,0.08)"
                  strokeDasharray="3 7"
                />

                <XAxis
                  dataKey="timestamp"
                  type="number"
                  domain={[
                    "dataMin",
                    "dataMax",
                  ]}
                  ticks={xTicks}
                  tickFormatter={(value) =>
                    formatShortTime(value)
                  }
                  axisLine={{
                    stroke:
                      "rgba(148,163,184,0.16)",
                  }}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                  minTickGap={28}
                />

                <YAxis
                  domain={yDomain}
                  width={48}
                  tickFormatter={(value) =>
                    `${value}°`
                  }
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke:
                      "rgba(52,211,153,.7)",
                    strokeWidth: 1,
                    strokeDasharray:
                      "4 4",
                  }}
                />

                {/* Average reference line */}
                {stats.average !== null && (
                  <ReferenceLine
                    y={stats.average}
                    stroke="rgba(148,163,184,.3)"
                    strokeDasharray="5 5"
                  />
                )}

                <Area
                  type="linear"
                  dataKey="temperature"
                  stroke="#22c55e"
                  strokeWidth={2.4}
                  fill="url(#weatherAreaGradient)"
                  fillOpacity={1}
                  connectNulls
                  isAnimationActive
                  animationDuration={850}
                  animationEasing="ease-out"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#22c55e",
                    stroke: "#ecfdf5",
                    strokeWidth: 2,
                  }}
                  style={{
                    filter:
                      "drop-shadow(0 0 5px rgba(34,197,94,.35))",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <div className="flex flex-col gap-2 border-t border-white/[0.07] px-5 py-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.7)]" />

          <span>
            {chartData.length
              ? `${chartData.length} weather readings`
              : "No readings"}
          </span>
        </div>

        <div>
          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString(
                "en-IN",
                {
                  hour: "numeric",
                  minute: "2-digit",
                }
              )}`
            : "Waiting for data"}
        </div>
      </div>
    </section>
  );
}