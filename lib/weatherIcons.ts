import { CloudSun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Sun, Moon, CloudDrizzle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Maps Open-Meteo WMO weather codes to an icon + tone. Used by the current
 * weather card, hourly strip, and 7-day forecast so the same visual
 * language stays consistent everywhere in the dashboard.
 */
export function getWeatherIcon(code: number, isDay = true): LucideIcon {
  if (code === 0) return isDay ? Sun : Moon;
  if ([1, 2].includes(code)) return CloudSun;
  if (code === 3) return Cloud;
  if ([45, 48].includes(code)) return CloudFog;
  if ([51, 53, 55].includes(code)) return CloudDrizzle;
  if ([61, 63, 65, 80, 81, 82].includes(code)) return CloudRain;
  if ([71, 73, 75].includes(code)) return CloudSnow;
  if ([95, 96, 99].includes(code)) return CloudLightning;
  return Cloud;
}

export function formatTime(iso: string, timeZone?: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone
  });
}

export function formatHour(iso: string, timeZone?: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", timeZone });
}

export function formatWeekday(iso: string, timeZone?: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", timeZone });
}
