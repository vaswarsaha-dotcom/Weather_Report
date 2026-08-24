"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, Activity, Bell, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { GlassCard } from "@/components/ui/Card";

interface AdminStats {
  totalUsers: number;
  newThisWeek: number;
  activeToday: number;
  totalAlerts: number;
  activeAlerts: number;
  apiCallsToday: number;
  apiCallsWeek: number;
  recentSignups: { _id: string; name: string; email: string; role: string; createdAt: string }[];
  usageByDay: { date: string; count: number }[];
  alertsByType: { type: string; count: number }[];
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load stats");
        return res.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl2 border border-white/10 bg-white/[0.04]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cloud">Admin overview</h1>
        <p className="text-sm text-slate">User activity, API usage, and alert configuration across the platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total users" value={stats.totalUsers} />
        <StatCard icon={UserPlus} label="New this week" value={stats.newThisWeek} accent="text-cyan" />
        <StatCard icon={Activity} label="Active today" value={stats.activeToday} accent="text-amber" />
        <StatCard icon={Bell} label="Active alerts" value={stats.activeAlerts} sub={`${stats.totalAlerts} total`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-amber" aria-hidden="true" />
            <h2 className="font-display text-lg font-medium text-cloud">Weather API calls, last 7 days</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.usageByDay}>
              <defs>
                <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#35C5E0" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#35C5E0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#7C89A6" fontSize={11} />
              <YAxis stroke="#7C89A6" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#161F38", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
              />
              <Area type="monotone" dataKey="count" stroke="#35C5E0" fill="url(#usageFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="mt-2 text-xs text-slate/70">
            {stats.apiCallsToday} calls today · {stats.apiCallsWeek} this week
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="mb-4 font-display text-lg font-medium text-cloud">Alerts by type</h2>
          <div className="space-y-3">
            {stats.alertsByType.length === 0 && <p className="text-sm text-slate">No alerts configured yet.</p>}
            {stats.alertsByType.map((a) => (
              <div key={a.type} className="flex items-center justify-between text-sm">
                <span className="capitalize text-slate">{a.type}</span>
                <span className="font-mono text-cloud">{a.count}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="mb-4 font-display text-lg font-medium text-cloud">Recent signups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate/70">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Email</th>
                <th className="pb-2 pr-4">Role</th>
                <th className="pb-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSignups.map((u) => (
                <tr key={u._id} className="border-t border-white/5">
                  <td className="py-2.5 pr-4 text-cloud">{u.name}</td>
                  <td className="py-2.5 pr-4 text-slate">{u.email}</td>
                  <td className="py-2.5 pr-4 capitalize text-slate">{u.role}</td>
                  <td className="py-2.5 text-slate">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  sub?: string;
  accent?: string;
}) {
  return (
    <GlassCard className="p-5">
      <Icon className={`h-5 w-5 ${accent ?? "text-slate"}`} aria-hidden="true" />
      <p className="mt-3 font-display text-3xl font-medium text-cloud">{value.toLocaleString()}</p>
      <p className="text-sm text-slate">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-slate/60">{sub}</p>}
    </GlassCard>
  );
}
