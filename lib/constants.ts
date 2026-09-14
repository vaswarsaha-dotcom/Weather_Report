// lib/constants.ts
export const SESSION_COOKIE_NAME = "ws_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const DEFAULT_TIMEZONE = "auto";
export const FORECAST_DAYS = 10;
export const HISTORY_REVALIDATE_SECONDS = 300;

export const ROLES = { USER: "user", ADMIN: "admin" } as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALERT_CONDITIONS = [
  "temp_above", "temp_below", "rain_probability_above",
  "wind_speed_above", "uv_index_above", "aqi_above",
] as const;
export type AlertCondition = (typeof ALERT_CONDITIONS)[number];