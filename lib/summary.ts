// lib/summary.ts
import type { WeatherSnapshot } from "@/types/weather";

export function generateSummary(snap: WeatherSnapshot): string {
  const { current, daily } = snap;

  const temp = Math.round(current.temperature);

  const hi = Math.round(daily[0].tempMax);
  const lo = Math.round(daily[0].tempMin);

  const rainToday = daily[0].precipitationSum > 0.5;

  const uv = daily[0].uvIndexMax;

  const parts: string[] = [];

  parts.push(
    `Currently ${temp}°, with a high of ${hi}° and a low of ${lo}° today.`
  );

  parts.push(
    rainToday
      ? `Expect some precipitation — keep an umbrella handy.`
      : `Dry conditions expected through the day.`
  );

  if (uv >= 8) {
    parts.push(
      `UV is very high — sun protection recommended if you're outside.`
    );
  } else if (uv >= 6) {
    parts.push(`UV is elevated during midday hours.`);
  }

  if (current.windSpeed > 30) {
    parts.push(
      `Winds are brisk at ${Math.round(current.windSpeed)} km/h.`
    );
  }

  return parts.join(" ");
}

export async function generateSummaryWithLLM(
  snap: WeatherSnapshot
): Promise<string> {
  const apiKey =
    process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) return generateSummary(snap);

  return generateSummary(snap);
}