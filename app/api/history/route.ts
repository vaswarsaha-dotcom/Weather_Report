import { NextResponse, type NextRequest } from "next/server";
import { requireSession, AuthError } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const user = await requireSession();
    const { searchParams } = new URL(req.url);

    const lat = parseFloat(searchParams.get("lat") || "");
    const lon = parseFloat(searchParams.get("lon") || "");
    const days = Math.min(30, Math.max(1, Number(searchParams.get("days")) || 7));

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return NextResponse.json(
        { error: "Missing or invalid coordinates." },
        { status: 400 }
      );
    }

    const since = new Date();
    since.setDate(since.getDate() - days);

    const supabase = createServiceClient();

    // Match locations within roughly a ~5km box to tolerate small float drift.
    const tolerance = 0.05;

    const { data, error } = await supabase
      .from("weather_snapshots")
      .select("recorded_at, temperature, humidity")
      .eq("user_id", user.id)
      .gte("lat", lat - tolerance)
      .lte("lat", lat + tolerance)
      .gte("lon", lon - tolerance)
      .lte("lon", lon + tolerance)
      .gte("recorded_at", since.toISOString())
      .order("recorded_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ snapshots: data || [] });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("HISTORY GET ERROR:", err);
    return NextResponse.json(
      { error: "Couldn't load history." },
      { status: 500 }
    );
  }
}