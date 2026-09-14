// lib/geocode.ts
import "server-only";
import type { GeocodeResult } from "@/types/weather";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";

export function coordLabel(lat: number, lon: number): string {
  return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
}

export async function searchCity(query: string): Promise<GeocodeResult[]> {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  if (!data.results?.length) return [];
  return data.results.map((r: any) => ({
    lat: r.latitude, lon: r.longitude, name: r.name, admin1: r.admin1, country: r.country,
    label: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
  }));
}