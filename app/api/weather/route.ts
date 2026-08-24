import { NextResponse } from "next/server";
import { getWeatherSnapshot } from "@/lib/weather";
import { checkRateLimit, keyFromRequest } from "@/lib/rateLimit";
import type { GeoResult } from "@/types/weather";

export async function GET(req: Request) {
  const rl = checkRateLimit(keyFromRequest(req, "weather"), 60, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const name = searchParams.get("name") ?? "Selected location";
  const country = searchParams.get("country") ?? "";
  const timezone = searchParams.get("timezone") ?? "auto";

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "lat and lon query params are required" }, { status: 400 });
  }

  const location: GeoResult = { id: 0, name, country, latitude: lat, longitude: lon, timezone };

  try {
    const snapshot = await getWeatherSnapshot(location);
    return NextResponse.json(snapshot, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" }
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to fetch weather data right now", detail: (err as Error).message },
      { status: 502 }
    );
  }
}
