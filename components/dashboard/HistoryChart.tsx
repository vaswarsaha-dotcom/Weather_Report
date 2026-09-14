// components/dashboard/HistoryChart.tsx
"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";

interface Snapshot { recorded_at: string; temperature: number; humidity: number | null; }

export default function HistoryChart({ lat, lon }: { lat: number | null; lon: number | null }) {
  const [data, setData] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lat == null || lon == null) return;
    setLoading(true);
    fetch(`/api/history?lat=${lat}&lon=${lon}&days=7`)
      .then((r) => (r.ok ? r.json() : { snapshots: [] }))
      .then((d) => setData(d.snapshots || []))
      .finally(() => setLoading(false));
  }, [lat, lon]);

  // If every snapshot falls on the same calendar day, show time-of-day
  // instead of the date, since the date alone would repeat and look broken.
  const uniqueDays = new Set(
    data.map((s) => new Date(s.recorded_at).toDateString())
  );
  const sameDay = uniqueDays.size <= 1;

  const chartData = data.map((s) => ({
    time: sameDay
      ? new Date(s.recorded_at).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : new Date(s.recorded_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
    temp: Math.round(s.temperature),
  }));

  return (
    <GlassCard>
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate mb-4">7-day temperature trend</h3>
      {loading ? (
        <div className="h-52 flex items-center justify-center text-slate text-sm">Loading history…</div>
      ) : chartData.length === 0 ? (
        <div className="h-52 flex items-center justify-center text-slate text-sm text-center px-6">
          No history yet — snapshots accumulate automatically each time you view a forecast while signed in.
        </div>
      ) : (
        <>
          {sameDay && (
            <p className="text-xs text-slate-dim mb-3">
              Showing today's readings so far — daily history builds up as
              more days pass.
            </p>
          )}
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="time" stroke="#7C89A6" fontSize={11} />
              <YAxis stroke="#7C89A6" fontSize={11} unit="°" />
              <Tooltip contentStyle={{ background: "#161F38", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="temp" stroke="#F5A623" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </GlassCard>
  );
}