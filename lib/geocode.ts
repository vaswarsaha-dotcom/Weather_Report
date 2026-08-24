import type { GeoResult } from "@/types/weather";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_URL = "https://geocoding-api.open-meteo.com/v1/reverse";

interface OpenMeteoGeoResponse {
  results?: Array<{
    id: number;
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
}

/** Search cities by name. Powers the dashboard city search box. */
export async function searchCities(query: string, count = 5): Promise<GeoResult[]> {
  if (!query || query.trim().length < 2) return [];

  const url = new URL(GEOCODE_URL);
  url.searchParams.set("name", query.trim());
  url.searchParams.set("count", String(count));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);

  const data: OpenMeteoGeoResponse = await res.json();
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone
  }));
}

/** Reverse-geocode browser geolocation coordinates into a place name. */
export async function reverseGeocode(lat: number, lon: number): Promise<GeoResult | null> {
  const url = new URL(REVERSE_URL);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) return null;

  const data: OpenMeteoGeoResponse = await res.json();
  const r = data.results?.[0];
  if (!r) {
    // Fall back to raw coordinates if no named place is found.
    return {
      id: 0,
      name: "Current location",
      country: "",
      latitude: lat,
      longitude: lon,
      timezone: "auto"
    };
  }

  return {
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone
  };
}
