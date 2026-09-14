import "server-only";
import type {
  WeatherSnapshot,
  CurrentWeather,
  HourlyPoint,
  DailyPoint,
  GeoResult,
} from "@/types/weather";

export async function getWeather(
  lat: number,
  lon: number,
  timezone: string = "auto"
): Promise<WeatherSnapshot> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("timezone", timezone);
  url.searchParams.set("forecast_days", "10");
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(",")
  );
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
      "visibility",
      "uv_index",
    ].join(",")
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
      "sunset",
    ].join(",")
  );

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch weather data.");
  }

  const data = await res.json();

  const hourlyTimes: string[] = data.hourly?.time || [];
  const currentTime: string = data.current?.time;
  let hourlyIndex = hourlyTimes.indexOf(currentTime);
  if (hourlyIndex === -1) hourlyIndex = 0;

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    pressure: data.current.pressure_msl,
    uvIndex: data.hourly?.uv_index?.[hourlyIndex] ?? 0,
    visibility: data.hourly?.visibility?.[hourlyIndex] ?? 0,
    cloudCover: data.current.cloud_cover,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    sunrise: data.daily?.sunrise?.[0] ?? "",
    sunset: data.daily?.sunset?.[0] ?? "",
    observedAt: data.current.time,
  };

  const hourly: HourlyPoint[] = hourlyTimes.map((time: string, i: number) => ({
    time,
    temperature: data.hourly.temperature_2m[i],
    precipitationProbability: data.hourly.precipitation_probability[i],
    weatherCode: data.hourly.weather_code[i],
  }));

  const dailyTimes: string[] = data.daily?.time || [];
  const daily: DailyPoint[] = dailyTimes.map((date: string, i: number) => ({
    date,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    weatherCode: data.daily.weather_code[i],
    precipitationSum: data.daily.precipitation_sum[i],
    uvIndexMax: data.daily.uv_index_max[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
  }));

  const location: GeoResult = {
    id: 0,
    name: "",
    country: "",
    latitude: lat,
    longitude: lon,
    timezone: data.timezone || timezone,
  };

  return {
    location,
    current,
    hourly,
    daily,
    provider: "open-meteo",
    fetchedAt: new Date().toISOString(),
  };
}