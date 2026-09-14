export function celsiusToFahrenheit(
  celsius: number
) {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(
  celsius: number,
  unit: "C" | "F"
) {
  const value =
    unit === "C"
      ? celsius
      : celsiusToFahrenheit(celsius);

  return `${Math.round(value)}°`;
}

export function formatWindSpeed(
  speed: number
) {
  return `${Math.round(speed)} km/h`;
}

export function formatVisibility(
  meters: number
) {
  if (!Number.isFinite(meters)) {
    return "—";
  }

  if (meters >= 10000) {
    return `${Math.round(
      meters / 1000
    )} km`;
  }

  return `${(
    meters / 1000
  ).toFixed(1)} km`;
}