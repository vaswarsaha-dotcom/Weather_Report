// components/dashboard/AlertsPanel.tsx
"use client";
import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ALERT_CONDITIONS, type AlertCondition } from "@/lib/constants";

interface Alert {
  id: string; label: string; place_name: string;
  condition: AlertCondition; threshold: number; active: boolean;
}

const CONDITION_LABELS: Record<AlertCondition, string> = {
  temp_above: "Temperature above (°C)",
  temp_below: "Temperature below (°C)",
  rain_probability_above: "Rain probability above (%)",
  wind_speed_above: "Wind speed above (km/h)",
  uv_index_above: "UV index above",
  aqi_above: "AQI above (coming soon)",
};

export default function AlertsPanel({ lat, lon, placeName }: { lat: number | null; lon: number | null; placeName: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ label: "", condition: "temp_above" as AlertCondition, threshold: 30 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/alerts");
    if (res.ok) setAlerts((await res.json()).alerts);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function createAlert() {
    if (lat == null || lon == null) { setError("Pick a location first."); return; }
    if (!form.label.trim()) { setError("Give the alert a name."); return; }
    setSaving(true); setError(null);
    const res = await fetch("/api/alerts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, lat, lon, placeName }),
    });
    setSaving(false);
    if (!res.ok) { setError((await res.json()).error || "Couldn't create alert."); return; }
    setForm({ label: "", condition: "temp_above", threshold: 30 });
    load();
  }

  async function toggleActive(a: Alert) {
    setAlerts((prev) => prev.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x)));
    await fetch(`/api/alerts/${a.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !a.active }),
    });
  }

  async function remove(id: string) {
    setAlerts((prev) => prev.filter((x) => x.id !== id));
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
  }

  return (
    <GlassCard>
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate mb-4">Smart alerts</h3>
      <div className="flex flex-wrap gap-2 items-end mb-5 pb-5 border-b border-white/10">
        <Input label="Name" placeholder="e.g. Heat warning" value={form.label}
          onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} className="w-40" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate">Condition</label>
          <select value={form.condition}
            onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value as AlertCondition }))}
            className="bg-ink border border-white/10 rounded-xl px-3 py-2.5 text-sm text-cloud outline-none focus:border-amber">
            {ALERT_CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
          </select>
        </div>
        <Input label="Threshold" type="number" value={form.threshold}
          onChange={(e) => setForm((f) => ({ ...f, threshold: parseFloat(e.target.value) || 0 }))} className="w-24" />
        <Button onClick={createAlert} loading={saving} size="md"><Plus size={14} /> Add</Button>
      </div>
      {error && <p className="text-xs text-red-400 -mt-3 mb-3">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate">Loading alerts…</p>
      ) : alerts.length === 0 ? (
        <p className="text-sm text-slate">No alerts yet. Create one above — it's checked automatically every 15 minutes.</p>
      ) : (
        <div className="space-y-2">
          {alerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between bg-ink/60 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm text-cloud">{a.label}</div>
                <div className="text-xs text-slate mt-0.5">{CONDITION_LABELS[a.condition]} {a.threshold} · {a.place_name}</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleActive(a)}
                  className={`text-xs px-2.5 py-1 rounded-full border ${a.active ? "border-amber/40 text-amber" : "border-white/10 text-slate-dim"}`}>
                  {a.active ? "Active" : "Paused"}
                </button>
                <button onClick={() => remove(a.id)} className="text-slate-dim hover:text-red-400"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}