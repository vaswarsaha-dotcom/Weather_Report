import { NextResponse } from "next/server";
import { searchCities, reverseGeocode } from "@/lib/geocode";
import { checkRateLimit, keyFromRequest } from "@/lib/rateLimit";

export async function GET(req: Request) {
  const rl = checkRateLimit(keyFromRequest(req, "geocode"), 60, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    if (lat && lon) {
      const result = await reverseGeocode(Number(lat), Number(lon));
      return NextResponse.json({ results: result ? [result] : [] });
    }

    if (!query) {
      return NextResponse.json({ error: "Provide a `q` search term or `lat`/`lon`" }, { status: 400 });
    }

    const results = await searchCities(query);
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: "Geocoding lookup failed", detail: (err as Error).message }, { status: 502 });
  }
}
