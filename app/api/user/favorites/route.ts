// app/api/user/favorites/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireSession, AuthError } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await requireSession();
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("favorites").select("id, place_name, lat, lon").eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ favorites: data.map((f: any) => ({ id: f.id, placeName: f.place_name, lat: f.lat, lon: f.lon })) });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't load favorites." }, { status: 500 });
  }
}

const schema = z.object({ placeName: z.string().min(1), lat: z.number(), lon: z.number() });

export async function POST(req: NextRequest) {
  try {
    const user = await requireSession();
    const body = schema.parse(await req.json());
    const supabase = createServiceClient();
    const { error } = await supabase.from("favorites").upsert(
      { user_id: user.id, place_name: body.placeName, lat: body.lat, lon: body.lon }, { onConflict: "user_id,lat,lon" }
    );
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't save favorite." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireSession();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
    const supabase = createServiceClient();
    const { error } = await supabase.from("favorites").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't remove favorite." }, { status: 500 });
  }
}