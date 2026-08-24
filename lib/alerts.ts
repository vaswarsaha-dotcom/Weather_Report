import { connectDB } from "@/lib/db";
import { AlertModel, type IAlert } from "@/models/Alert";
import { getWeatherSnapshot } from "@/lib/weather";
import type { GeoResult } from "@/types/weather";

export interface TriggeredAlert {
  alertId: string;
  userId: string;
  type: IAlert["type"];
  cityName: string;
  message: string;
}

function evaluateAlert(alert: IAlert, current: { precipitation: number; temperature: number; windSpeed: number }): boolean {
  switch (alert.type) {
    case "rain":
      return current.precipitation >= alert.threshold;
    case "heat":
      return current.temperature >= alert.threshold;
    case "wind":
      return current.windSpeed >= alert.threshold;
    case "aqi":
      // AQI isn't part of the Open-Meteo forecast endpoint used elsewhere in
      // this app — wire this up to Open-Meteo's separate Air Quality API
      // (air-quality-api.open-meteo.com) when AQI alerts go live.
      return false;
    default:
      return false;
  }
}

/**
 * Evaluates every active alert against current conditions. Designed to be
 * invoked by a scheduler (Vercel Cron, a queue worker, etc.) rather than
 * from user-facing request handlers — see app/api/cron/check-alerts/route.ts
 * for the HTTP entry point this powers.
 */
export async function runAlertCheck(): Promise<TriggeredAlert[]> {
  await connectDB();
  const alerts = await AlertModel.find({ active: true });

  const triggered: TriggeredAlert[] = [];

  // Group by location to avoid redundant weather API calls when multiple
  // alerts (or users) watch the same city.
  const byLocation = new Map<string, IAlert[]>();
  for (const alert of alerts) {
    const key = `${alert.latitude},${alert.longitude}`;
    byLocation.set(key, [...(byLocation.get(key) ?? []), alert]);
  }

  for (const [key, group] of byLocation) {
    const [lat, lon] = key.split(",").map(Number);
    const location: GeoResult = { id: 0, name: group[0].cityName, country: "", latitude: lat, longitude: lon, timezone: "auto" };

    try {
      const snapshot = await getWeatherSnapshot(location);
      for (const alert of group) {
        if (evaluateAlert(alert, snapshot.current)) {
          alert.lastTriggeredAt = new Date();
          await alert.save();
          triggered.push({
            alertId: alert.id,
            userId: String(alert.userId),
            type: alert.type,
            cityName: alert.cityName,
            message: `${alert.type.toUpperCase()} alert triggered for ${alert.cityName}`
          });
        }
      }
    } catch {
      // Skip this location on failure; the next scheduled run will retry.
      continue;
    }
  }

  return triggered;
}
