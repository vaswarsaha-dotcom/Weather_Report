import { NextResponse, type NextRequest } from "next/server";
import { requireSession, AuthError } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { ALERT_CONDITIONS, type AlertCondition } from "@/lib/constants";

export async function GET() {
  try {
    const user = await requireSession();
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ alerts: data || [] });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("ALERTS GET ERROR:", err);
    return NextResponse.json(
      { error: "Couldn't load alerts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireSession();
    const body = await req.json().catch(() => null);

    if (!body || typeof body.label !== "string" || !body.label.trim()) {
      return NextResponse.json(
        { error: "Give the alert a name." },
        { status: 400 }
      );
    }

    if (!ALERT_CONDITIONS.includes(body.condition as AlertCondition)) {
      return NextResponse.json(
        { error: "Invalid alert condition." },
        { status: 400 }
      );
    }

    if (typeof body.lat !== "number" || typeof body.lon !== "number") {
      return NextResponse.json(
        { error: "Pick a location first." },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("alerts")
      .insert({
        user_id: user.id,
        label: body.label.trim(),
        place_name: body.placeName || "Unknown location",
        lat: body.lat,
        lon: body.lon,
        condition: body.condition,
        threshold: Number(body.threshold) || 0,
        active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ alert: data }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("ALERTS POST ERROR:", err);
    return NextResponse.json(
      { error: "Couldn't create alert." },
      { status: 500 }
    );
  }
}