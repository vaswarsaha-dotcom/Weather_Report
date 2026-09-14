// app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { StatsCards } from "@/components/admin/StatsCards";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<{ users: number; activeAlerts: number; snapshots: number } | null>(null);
  useEffect(() => { fetch("/api/admin/stats").then((r) => r.json()).then((d) => setStats(d.stats)); }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl font-bold text-cloud">Platform overview</h1>
      {stats ? <StatsCards stats={stats} /> : <p className="text-sm text-slate">Loading…</p>}
    </div>
  );
}