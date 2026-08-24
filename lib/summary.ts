import type { CurrentWeather, DailyPoint, WEATHER_CODE_LABELS as _labels } from "@/types/weather";
import { WEATHER_CODE_LABELS } from "@/types/weather";

/**
 * Converts a weather snapshot into a natural-language summary.
 *
 * This is intentionally decoupled from the caller: today it runs a local
 * rule-based generator, but the function signature and output shape are
 * stable so an LLM-backed implementation (OpenAI, Gemini, or Claude via
 * the Anthropic API) can be dropped in later without touching call sites.
 * See `generateSummaryWithLLM` below for the swap-in point.
 */
export interface SummaryInput {
  cityName: string;
  current: CurrentWeather;
  today: DailyPoint | undefined;
}

export function generateWeatherSummary({ cityName, current, today }: SummaryInput): string {
  const condition = WEATHER_CODE_LABELS[current.weatherCode] ?? "changeable conditions";
  const temp = Math.round(current.temperature);
  const feelsLike = Math.round(current.feelsLike);

  const tempPhrase =
    temp >= 30 ? "hot" : temp >= 22 ? "warm" : temp >= 12 ? "mild" : temp >= 0 ? "cool" : "cold";

  const humidityPhrase =
    current.humidity >= 80 ? "high humidity" : current.humidity >= 50 ? "moderate humidity" : "low humidity";

  const windPhrase =
    current.windSpeed >= 40 ? "strong winds" : current.windSpeed >= 20 ? "pleasant winds" : "light winds";

  const rainNote =
    (today?.precipitationSum ?? 0) > 0.5
      ? " Rain is likely later, so keep an umbrella nearby."
      : current.precipitation > 0
        ? " Light rain is possible."
        : "";

  const uvNote = current.uvIndex >= 8 ? " UV is very high — sun protection is worth it." : "";

  return (
    `Expect a ${tempPhrase} day in ${cityName} with ${condition.toLowerCase()}, ` +
    `around ${temp}°C (feels like ${feelsLike}°C), ${humidityPhrase} and ${windPhrase}.` +
    `${rainNote}${uvNote}`
  );
}

/**
 * Swap-in point for a real LLM. Keeps the same input/output contract as
 * `generateWeatherSummary` so the dashboard never needs to change.
 *
 * Example future implementation:
 *   const res = await fetch("https://api.anthropic.com/v1/messages", { ... });
 *   const data = await res.json();
 *   return data.content.find(b => b.type === "text")?.text ?? fallback;
 */
export async function generateSummaryWithLLM(input: SummaryInput): Promise<string> {
  const hasKey = Boolean(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY);
  if (!hasKey) {
    return generateWeatherSummary(input);
  }

  // Placeholder for provider wiring — intentionally left as a clean
  // extension point rather than a fake network call.
  return generateWeatherSummary(input);
}
