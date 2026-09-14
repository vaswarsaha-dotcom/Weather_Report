// app/api/admin/users/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = 25;
    const supabase = createServiceClient();
    const { data, error, count } = await supabase.from("users").select("id, email, name, role, created_at", { count: "exact" })
      .order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);
    if (error) throw error;
    return NextResponse.json({ users: data, total: count, page, pageSize });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't load users." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const { id, role } = await req.json();
    if (!id || !["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "id and a valid role are required." }, { status: 400 });
    }
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("users").update({ role }).eq("id", id).select("id, email, name, role").single();
    if (error) throw error;
    return NextResponse.json({ user: data });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't update user." }, { status: 500 });
  }
}