"use client";

import { useEffect, useState } from "react";
import { Trash2, CloudRain, Thermometer, Wind, Factory } from "lucide-react";
import type { GeoResult } from "@/types/weather";
import { GlassCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyLocationState } from "@/components/dashboard/States";

type AlertType = "rain" | "heat" | "wind" | "aqi";

interface Alert {
  _id: string;
  type: AlertType;
  cityName: string;
  latitude: number;
  longitude: number;
  threshold: number;
  active: boolean;
  lastTriggeredAt: string | null;
}

const ALERT_META: Record<AlertType, { label: string; unit: string; defaultThreshold: number; icon: typeof CloudRain }> = {
  rain: { label: "Rain Alert", unit: "mm/h", defaultThreshold: 2, icon: CloudRain },
  heat: { label: "Heat Alert", unit: "°C", defaultThreshold: 35, icon: Thermometer },
  wind: { label: "Wind Alert", unit: "km/h", defaultThreshold: 40, icon: Wind },
  aqi: { label: "AQI Alert", unit: "AQI", defaultThreshold: 150, icon: Factory }
};

const LAST_LOCATION_KEY = "ws-last-location";

export default function AlertsPage() {
  const [location, setLocation] = useState<GeoResult | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<AlertType>("rain");
  const [threshold, setThreshold] = useState(ALERT_META.rain.defaultThreshold);
  const [creating, setCreating] = useState(false);

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

  const refresh = async () => {
    setLoading(true);
    const res = await fetch("/api/alerts");
    const data = await res.json();
    setAlerts(data.alerts ?? []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const createAlert = async () => {
    if (!location) return;
    setCreating(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          cityName: location.name,
          latitude: location.latitude,
          longitude: location.longitude,
          threshold
        })
      });
      if (res.ok) await refresh();
    } finally {
      setCreating(false);
    }
  };

  const removeAlert = async (id: string) => {
    await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
    setAlerts((prev) => prev.filter((a) => a._id !== id));
  };

  if (!location) return <EmptyLocationState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cloud">Smart alerts</h1>
        <p className="text-sm text-slate">
          Checked on a schedule server-side — see <code className="font-mono">lib/alerts.ts</code>.
        </p>
      </div>

      <GlassCard className="p-6">
        <h3 className="font-display text-lg font-medium text-cloud">New alert for {location.name}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="text-sm text-slate">Alert type</label>
            <select
              value={selectedType}
              onChange={(e) => {
                const type = e.target.value as AlertType;
                setSelectedType(type);
                setThreshold(ALERT_META[type].defaultThreshold);
              }}
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            >
              {(Object.keys(ALERT_META) as AlertType[]).map((t) => (
                <option key={t} value={t} className="bg-dusk">
                  {ALERT_META[t].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate">Threshold ({ALERT_META[selectedType].unit})</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={createAlert} loading={creating} className="w-full">
              Create alert
            </Button>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-3">
        {loading ? (
          <div className="h-20 animate-pulse rounded-xl2 border border-white/10 bg-white/[0.04]" />
        ) : alerts.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-slate">No alerts configured yet.</GlassCard>
        ) : (
          alerts.map((alert) => {
            const meta = ALERT_META[alert.type];
            const Icon = meta.icon;
            return (
              <GlassCard key={alert._id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-amber" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-cloud">
                      {meta.label} · {alert.cityName}
                    </p>
                    <p className="text-xs text-slate">
                      Triggers at {alert.threshold} {meta.unit}
                      {alert.lastTriggeredAt && ` · last triggered ${new Date(alert.lastTriggeredAt).toLocaleString()}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeAlert(alert._id)}
                  aria-label={`Delete ${meta.label} for ${alert.cityName}`}
                  className="text-slate transition hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
