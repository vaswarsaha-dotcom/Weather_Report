import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        { error: "Supabase env vars missing. Check .env.local and restart the dev server." },
        { status: 500 }
      );
    }

    const { email, password } = await req.json();
    if (!email || !password || String(password).length < 6) {
      return NextResponse.json(
        { error: "Valid email and a password of 6+ characters required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: String(email).trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error("[signup] supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
        needsConfirmation: !data.session,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[signup] crashed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}