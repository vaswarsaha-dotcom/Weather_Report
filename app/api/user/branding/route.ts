// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createServiceClient();
    const [{ count: userCount }, { count: alertCount }, { count: snapshotCount }] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("alerts").select("*", { count: "exact", head: true }).eq("active", true),
      supabase.from("weather_snapshots").select("*", { count: "exact", head: true }),
    ]);
    return NextResponse.json({ stats: { users: userCount || 0, activeAlerts: alertCount || 0, snapshots: snapshotCount || 0 } });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't load stats." }, { status: 500 });
  }
}