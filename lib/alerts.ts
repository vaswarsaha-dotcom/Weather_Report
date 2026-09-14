// lib/alerts.ts
import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import { getWeather } from "@/lib/weather";
import type { AlertCondition, AlertRecord } from "@/types/alert";

type AlertCheckResult = {
  checked: number;
  triggered: number;
  errors: number;
};

type DbAlert = {
  id: string;
  user_id: string;
  label: string;
  lat: number;
  lon: number;
  place_name: string | null;
  condition: AlertCondition;
  threshold: number;
  active: boolean;
  last_triggered_at: string | null;
  created_at: string;
};

function isTriggered(
  condition: AlertCondition,
  threshold: number,
  weather: Awaited<ReturnType<typeof getWeather>>
): boolean {
  switch (condition) {
    case "temp_above":
      return weather.current.temperature > threshold;

    case "temp_below":
      return weather.current.temperature < threshold;

    case "rain_probability_above":
      return (
        Math.max(
          ...weather.hourly
            .slice(0, 24)
            .map((h) => h.precipitationProbability)
        ) > threshold
      );

    case "wind_speed_above":
      return weather.current.windSpeed > threshold;

    case "uv_index_above":
      return (weather.daily[0]?.uvIndexMax ?? weather.current.uvIndex) > threshold;

    case "aqi_above":
      // AQI isn't currently supplied by the Open-Meteo weather request.
      return false;

    default:
      return false;
  }
}

function mapDbAlert(row: DbAlert): AlertRecord {
  return {
    id: row.id,
    userId: row.user_id,
    label: row.label,
    lat: Number(row.lat),
    lon: Number(row.lon),
    placeName: row.place_name,
    condition: row.condition,
    threshold: Number(row.threshold),
    active: Boolean(row.active),
    lastTriggeredAt: row.last_triggered_at,
    createdAt: row.created_at,
  };
}

/**
 * Checks all active weather alerts.
 *
 * This function is called by:
 * app/api/cron/check-alerts/route.ts
 */
export async function checkAllAlerts(): Promise<AlertCheckResult> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("alerts")
    .select(
      "id, user_id, label, lat, lon, place_name, condition, threshold, active, last_triggered_at, created_at"
    )
    .eq("active", true);

  if (error) {
    throw new Error(`Failed to load alerts: ${error.message}`);
  }

  const alerts = (data ?? []) as DbAlert[];

  let triggered = 0;
  let errors = 0;

  for (const row of alerts) {
    try {
      const alert = mapDbAlert(row);

      const weather = await getWeather(
        alert.lat,
        alert.lon,
        "auto"
      );

      const shouldTrigger = isTriggered(
        alert.condition,
        alert.threshold,
        weather
      );

      if (!shouldTrigger) {
        continue;
      }

      triggered++;

      await supabase
        .from("alerts")
        .update({
          last_triggered_at: new Date().toISOString(),
        })
        .eq("id", alert.id);
    } catch (error) {
      errors++;

      console.error(
        `[alerts] Failed to check alert ${row.id}:`,
        error
      );
    }
  }

  return {
    checked: alerts.length,
    triggered,
    errors,
  };
}