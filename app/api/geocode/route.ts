import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing search query" },
        { status: 400 }
      );
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=5&language=en&format=json`;

    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch locations" },
        { status: 502 }
      );
    }

    const data = await res.json();

    const results = (data.results || []).map((place: any) => ({
      id: place.id,
      name: place.name,
      country: place.country,
      admin1: place.admin1,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: place.timezone,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("GEOCODE ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error while searching for location." },
      { status: 500 }
    );
  }
}