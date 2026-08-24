"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { GeoResult } from "@/types/weather";
import { GlassCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyLocationState } from "@/components/dashboard/States";

interface TrendPoint {
  recordedAt: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

const LAST_LOCATION_KEY = "ws-last-location";

export default function HistoryPage() {
  const [location, setLocation] = useState<GeoResult | null>(null);
  const [range, setRange] = useState<"week" | "month">("week");
  const [points, setPoints] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(LAST_LOCATION_KEY);
    if (stored) {
      try {
        setLocation(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (!location) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const url = new URL("/api/history", window.location.origin);
    url.searchParams.set("lat", String(location.latitude));
    url.searchParams.set("lon", String(location.longitude));
    url.searchParams.set("range", range);

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => setPoints(data.points ?? []))
      .finally(() => setLoading(false));
  }, [location, range]);

  const chartData = points.map((p) => ({
    ...p,
    label: new Date(p.recordedAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric"
    })
  }));

  if (!location) return <EmptyLocationState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-cloud">Historical trends</h1>
          <p className="text-sm text-slate">
            {location.name}
            {location.admin1 ? `, ${location.admin1}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={range === "week" ? "primary" : "outline"} onClick={() => setRange("week")}>
            Weekly
          </Button>
          <Button size="sm" variant={range === "month" ? "primary" : "outline"} onClick={() => setRange("month")}>
            Monthly
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-72 animate-pulse rounded-xl2 border border-white/10 bg-white/[0.04]" />
      ) : chartData.length < 2 ? (
        <GlassCard className="p-10 text-center">
          <p className="text-sm text-slate">
            Not enough history yet for this city. Trend charts fill in automatically as the dashboard
            refreshes over time — check back after a few visits.
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <TrendChart title="Temperature (°C)" data={chartData} dataKey="temperature" color="#F5A623" />
          <TrendChart title="Humidity (%)" data={chartData} dataKey="humidity" color="#35C5E0" />
          <TrendChart title="Wind speed (km/h)" data={chartData} dataKey="windSpeed" color="#9FE8F2" />
          <TrendChart title="Pressure (hPa)" data={chartData} dataKey="pressure" color="#FFD187" />
        </div>
      )}
    </div>
  );
}

function TrendChart({
  title,
  data,
  dataKey,
  color
}: {
  title: string;
  data: Array<Record<string, string | number>>;
  dataKey: string;
  color: string;
}) {
  return (
    <GlassCard className="p-6">
      <h3 className="font-display text-lg font-medium text-cloud">{title}</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#7C89A6" }} minTickGap={30} />
            <YAxis tick={{ fontSize: 11, fill: "#7C89A6" }} width={40} />
            <Tooltip
              contentStyle={{
                background: "#161F38",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12
              }}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
