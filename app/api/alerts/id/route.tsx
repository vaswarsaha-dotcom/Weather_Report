// app/api/alerts/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireSession, AuthError } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSession();
    const { id } = await params;
    const body = await req.json();
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("alerts")
      .update({ active: body.active, label: body.label, threshold: body.threshold })
      .eq("id", id).eq("user_id", user.id).select().single();
    if (error || !data) return NextResponse.json({ error: "Alert not found." }, { status: 404 });
    return NextResponse.json({ alert: data });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't update alert." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireSession();
    const { id } = await params;
    const supabase = createServiceClient();
    const { error } = await supabase.from("alerts").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't delete alert." }, { status: 500 });
  }
}