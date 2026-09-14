"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

import type { WeatherSnapshot } from "@/types/weather";
import { celsiusToFahrenheit } from "@/lib/units";

interface TrendPoint {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
}

export function WeatherTrends({
  snapshot,
  unit,
}: {
  snapshot: WeatherSnapshot;
  unit: "C" | "F";
}) {
  const [points, setPoints] = useState<TrendPoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPoints(null);
    setError(null);

    const { latitude, longitude } = snapshot.location;

    fetch(`/api/weather/trends?lat=${latitude}&lon=${longitude}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          if (data.points) setPoints(data.points);
          else setError(data.error || "Unable to load trends.");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load trends.");
      });

    return () => {
      cancelled = true;
    };
  }, [snapshot.location]);

  const chartData = useMemo(() => {
    const conv = (c: number) => (unit === "C" ? c : celsiusToFahrenheit(c));
    const historical = (points || []).map((p) => ({
      date: p.date,
      high: Math.round(conv(p.tempMax)),
      low: Math.round(conv(p.tempMin)),
    }));
    const forecast = snapshot.daily.map((d) => ({
      date: d.date,
      high: Math.round(conv(d.tempMax)),
      low: Math.round(conv(d.tempMin)),
    }));
    return [...historical, ...forecast];
  }, [points, snapshot.daily, unit]);

  const stats = useMemo(() => {
    if (!points || !points.length) return null;
    const highs = points.map((p) => p.tempMax);
    const lows = points.map((p) => p.tempMin);
    const hottest = points.reduce((a, b) => (b.tempMax > a.tempMax ? b : a));
    const coldest = points.reduce((a, b) => (b.tempMin < a.tempMin ? b : a));
    return {
      maxHigh: Math.max(...highs),
      minLow: Math.min(...lows),
      hottestDate: hottest.date,
      coldestDate: coldest.date,
    };
  }, [points]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-glass backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            Trends
          </p>
          <h2 className="mt-1 font-display text-2xl text-cloud">
            Last 12 months
          </h2>
        </div>
        <TrendingUp className="h-6 w-6 text-cyan" />
      </div>

      {error && (
        <p className="text-sm text-red-300">{error}</p>
      )}

      {!error && !points && (
        <p className="text-sm text-slate">Loading historical trends…</p>
      )}

      {chartData.length > 0 && (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5a623" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f5a623" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: "#7C89A6", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={29}
              />
              <YAxis
                tick={{ fill: "#7C89A6", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: "#161F38",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 12,
                  color: "#F4F6FA",
                }}
              />
              <Area
                type="monotone"
                dataKey="high"
                stroke="#f5a623"
                strokeWidth={2}
                fill="url(#trendFill)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="low"
                stroke="#35c5e0"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Highest" value={`${Math.round(stats.maxHigh)}°`} sub={stats.hottestDate} />
          <Stat label="Lowest" value={`${Math.round(stats.minLow)}°`} sub={stats.coldestDate} />
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-black/10 p-4">
      <p className="text-[11px] text-slate">{label}</p>
      <p className="mt-1 text-lg font-semibold text-cloud">{value}</p>
      <p className="mt-1 text-[10px] text-slate-dim">{sub}</p>
    </div>
  );
}