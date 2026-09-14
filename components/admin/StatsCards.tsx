// components/admin/StatsCards.tsx
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Bell, Database } from "lucide-react";

export function StatsCards({ stats }: { stats: { users: number; activeAlerts: number; snapshots: number } }) {
  const items = [
    { label: "Total users", value: stats.users, icon: Users },
    { label: "Active alerts", value: stats.activeAlerts, icon: Bell },
    { label: "History snapshots", value: stats.snapshots, icon: Database },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {items.map((it) => (
        <GlassCard key={it.label}>
          <it.icon size={18} className="text-amber mb-2" />
          <div className="font-display text-3xl font-bold text-cloud">{it.value.toLocaleString()}</div>
          <div className="text-xs text-slate mt-1">{it.label}</div>
        </GlassCard>
      ))}
    </div>
  );
}