import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { WeatherSnapshotModel } from "@/models/WeatherSnapshot";

/**
 * POST — persist a snapshot. Called from the client alongside the regular
 * weather fetch so history accumulates naturally as the user browses,
 * without a separate polling job for the free tier.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { cityName, latitude, longitude, temperature, humidity, windSpeed, pressure, weatherCode } = body ?? {};

  if ([cityName, latitude, longitude, temperature, humidity, windSpeed, pressure, weatherCode].some((v) => v === undefined)) {
    return NextResponse.json({ error: "Missing snapshot fields" }, { status: 400 });
  }

  await connectDB();
  await WeatherSnapshotModel.create({
    userId: session.userId,
    cityName,
    latitude,
    longitude,
    temperature,
    humidity,
    windSpeed,
    pressure,
    weatherCode
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

/**
 * GET — return snapshots for a location over a range (`week` | `month`),
 * used to render the temperature / humidity / wind trend charts.
 */
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const range = searchParams.get("range") === "month" ? "month" : "week";

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const since = new Date();
  since.setDate(since.getDate() - (range === "month" ? 30 : 7));

  await connectDB();
  const snapshots = await WeatherSnapshotModel.find({
    userId: session.userId,
    latitude: lat,
    longitude: lon,
    recordedAt: { $gte: since }
  })
    .sort({ recordedAt: 1 })
    .limit(500)
    .lean();

  return NextResponse.json({
    range,
    points: snapshots.map((s) => ({
      recordedAt: s.recordedAt,
      temperature: s.temperature,
      humidity: s.humidity,
      windSpeed: s.windSpeed,
      pressure: s.pressure
    }))
  });
}
