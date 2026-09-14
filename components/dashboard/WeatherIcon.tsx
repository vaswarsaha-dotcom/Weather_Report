// components/dashboard/WeatherIcon.tsx
export function weatherCategory(code: number): string {
  if (code === 0) return "clear";
  if ([1, 2].includes(code)) return "partly";
  if (code === 3) return "cloudy";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "thunder";
  return "partly";
}

const LABELS: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
  56: "Freezing drizzle", 57: "Freezing drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
  66: "Freezing rain", 67: "Freezing rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow",
  77: "Snow grains", 80: "Rain showers", 81: "Rain showers", 82: "Violent showers",
  85: "Snow showers", 86: "Snow showers", 95: "Thunderstorm", 96: "Thunderstorm, hail", 99: "Thunderstorm, hail",
};
export function weatherLabel(code: number): string {
  return LABELS[code] || "Unsettled";
}

interface WeatherIconProps {
  code: number;
  isDay: boolean;
  size?: number;
  className?: string;
}

// Hand-built icon set (no external icon dependency for conditions) so it can
// recolor via currentColor/CSS vars and match per-user branding.
export function WeatherIcon({ code, isDay, size = 32, className }: WeatherIconProps) {
  const cat = weatherCategory(code);
  const sunFill = "#F5A623";
  const cloudFill = isDay ? "#9CA9C4" : "#5E6B8A";
  const rainStroke = "#35C5E0";

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      {(cat === "clear" || cat === "partly") && isDay && (
        <>
          <g stroke={sunFill} strokeWidth="2" strokeLinecap="round">
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="16" y1="26" x2="16" y2="30" />
            <line x1="2" y1="16" x2="6" y2="16" />
            <line x1="26" y1="16" x2="30" y2="16" />
            <line x1="6" y1="6" x2="8.8" y2="8.8" />
            <line x1="23.2" y1="23.2" x2="26" y2="26" />
            <line x1="26" y1="6" x2="23.2" y2="8.8" />
            <line x1="6" y1="26" x2="8.8" y2="23.2" />
          </g>
          <circle cx="16" cy="16" r={cat === "partly" ? 5 : 7} fill={sunFill} transform={cat === "partly" ? "translate(3,4)" : ""} />
        </>
      )}
      {(cat === "clear" || cat === "partly") && !isDay && (
        <path d="M20 6a11 11 0 1 0 6 20 9 9 0 0 1-6-20z" fill="#9FB3C2" />
      )}
      {["partly", "cloudy", "drizzle", "rain", "snow", "thunder"].includes(cat) && (
        <path d="M9 23a6 6 0 0 1 1-11.9A7.5 7.5 0 0 1 24 12a5.5 5.5 0 0 1-1 11H9z" fill={cloudFill} />
      )}
      {cat === "fog" && (
        <g stroke="#7C89A6" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="14" x2="27" y2="14" />
          <line x1="4" y1="18" x2="28" y2="18" />
          <line x1="6" y1="22" x2="26" y2="22" />
        </g>
      )}
      {["drizzle", "rain"].includes(cat) && (
        <g stroke={rainStroke} strokeWidth="2" strokeLinecap="round">
          <line x1="11" y1="26" x2="9" y2="30" />
          <line x1="16" y1="26" x2="14" y2="30" />
          <line x1="21" y1="26" x2="19" y2="30" />
        </g>
      )}
      {cat === "snow" && (
        <g fill={rainStroke}>
          <circle cx="10" cy="27" r="1.4" />
          <circle cx="16" cy="29" r="1.4" />
          <circle cx="22" cy="27" r="1.4" />
        </g>
      )}
      {cat === "thunder" && <path d="M17 24l-4 7h4l-2 6 7-9h-4l3-4z" fill={sunFill} />}
    </svg>
  );
}