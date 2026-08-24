import type { CurrentWeather, DailyPoint, GeoResult, HourlyPoint, WeatherSnapshot } from "@/types/weather";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const OWM_URL = "https://api.openweathermap.org/data/2.5/onecall";

// Revalidate every 5 minutes to match the dashboard's auto-refresh cadence
// while avoiding redundant upstream calls when multiple users request the
// same location within that window (Next.js fetch cache handles this).
const CACHE_SECONDS = 300;

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    surface_pressure: number;
    uv_index: number;
    visibility: number;
    cloud_cover: number;
    precipitation: number;
    weather_code: number;
    is_day: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

async function fetchFromOpenMeteo(location: GeoResult): Promise<WeatherSnapshot> {
  const url = new URL(OPEN_METEO_URL);
  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set("timezone", location.timezone || "auto");
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "wind_direction_10m",
      "surface_pressure",
      "uv_index",
      "visibility",
      "cloud_cover",
      "precipitation",
      "weather_code",
      "is_day"
    ].join(",")
  );
  url.searchParams.set(
    "hourly",
    ["temperature_2m", "precipitation_probability", "weather_code"].join(",")
  );
  url.searchParams.set(
    "daily",
    [
      "temperature_2m_max",
      "temperature_2m_min",
      "weather_code",
      "precipitation_sum",
      "uv_index_max",
      "sunrise",
      "sunset"
    ].join(",")
  );
  url.searchParams.set("forecast_days", "8");

  const res = await fetch(url.toString(), { next: { revalidate: CACHE_SECONDS } });
  if (!res.ok) throw new Error(`Open-Meteo request failed: ${res.status}`);

  const data: OpenMeteoResponse = await res.json();

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    pressure: data.current.surface_pressure,
    uvIndex: data.current.uv_index,
    visibility: data.current.visibility,
    cloudCover: data.current.cloud_cover,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    observedAt: data.current.time
  };

  const hourly: HourlyPoint[] = data.hourly.time.slice(0, 24).map((time, i) => ({
    time,
    temperature: data.hourly.temperature_2m[i],
    precipitationProbability: data.hourly.precipitation_probability[i],
    weatherCode: data.hourly.weather_code[i]
  }));

  const daily: DailyPoint[] = data.daily.time.slice(0, 7).map((date, i) => ({
    date,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    weatherCode: data.daily.weather_code[i],
    precipitationSum: data.daily.precipitation_sum[i],
    uvIndexMax: data.daily.uv_index_max[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i]
  }));

  return { location, current, hourly, daily, provider: "open-meteo", fetchedAt: new Date().toISOString() };
}

async function fetchFromOpenWeatherMap(location: GeoResult): Promise<WeatherSnapshot> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("OPENWEATHER_API_KEY not configured for fallback provider");

  const url = new URL(OWM_URL);
  url.searchParams.set("lat", String(location.latitude));
  url.searchParams.set("lon", String(location.longitude));
  url.searchParams.set("units", "metric");
  url.searchParams.set("appid", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: CACHE_SECONDS } });
  if (!res.ok) throw new Error(`OpenWeatherMap request failed: ${res.status}`);

  const data = await res.json();

  const current: CurrentWeather = {
    temperature: data.current.temp,
    feelsLike: data.current.feels_like,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_speed,
    windDirection: data.current.wind_deg,
    pressure: data.current.pressure,
    uvIndex: data.current.uvi,
    visibility: data.current.visibility,
    cloudCover: data.current.clouds,
    precipitation: data.current.rain?.["1h"] ?? 0,
    weatherCode: data.current.weather?.[0]?.id ?? 0,
    isDay: true,
    sunrise: new Date(data.current.sunrise * 1000).toISOString(),
    sunset: new Date(data.current.sunset * 1000).toISOString(),
    observedAt: new Date(data.current.dt * 1000).toISOString()
  };

  const hourly: HourlyPoint[] = (data.hourly ?? []).slice(0, 24).map((h: any) => ({
    time: new Date(h.dt * 1000).toISOString(),
    temperature: h.temp,
    precipitationProbability: Math.round((h.pop ?? 0) * 100),
    weatherCode: h.weather?.[0]?.id ?? 0
  }));

  const daily: DailyPoint[] = (data.daily ?? []).slice(0, 7).map((d: any) => ({
    date: new Date(d.dt * 1000).toISOString(),
    tempMax: d.temp.max,
    tempMin: d.temp.min,
    weatherCode: d.weather?.[0]?.id ?? 0,
    precipitationSum: d.rain ?? 0,
    uvIndexMax: d.uvi,
    sunrise: new Date(d.sunrise * 1000).toISOString(),
    sunset: new Date(d.sunset * 1000).toISOString()
  }));

  return { location, current, hourly, daily, provider: "openweathermap", fetchedAt: new Date().toISOString() };
}

/**
 * Fetch a full weather snapshot for a location, preferring Open-Meteo
 * (no API key required) and transparently falling back to OpenWeatherMap
 * if it's configured and Open-Meteo is unavailable.
 */
export async function getWeatherSnapshot(location: GeoResult): Promise<WeatherSnapshot> {
  try {
    return await fetchFromOpenMeteo(location);
  } catch (primaryError) {
    if (process.env.OPENWEATHER_API_KEY) {
      try {
        return await fetchFromOpenWeatherMap(location);
      } catch (fallbackError) {
        throw new Error(
          `Both weather providers failed. Primary: ${(primaryError as Error).message}. Fallback: ${
            (fallbackError as Error).message
          }`
        );
      }
    }
    throw primaryError;
  }
}
