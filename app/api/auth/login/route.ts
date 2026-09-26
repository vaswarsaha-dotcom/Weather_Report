import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();

    // Password is intentionally NOT modified.
    const password = String(body?.password ?? "");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    /*
     * DEVELOPMENT DEMO LOGIN
     *
     * Enable with:
     * NEXT_PUBLIC_DEMO_LOGIN=true
     *
     * This allows arbitrary credentials ONLY during development.
     */
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.DEMO_LOGIN === "true"
    ) {
      return NextResponse.json(
        {
          user: {
            id: "demo-user",
            email,
            name: email.split("@")[0] || "Demo User",
            role: "user",
          },
          demo: true,
        },
        { status: 200 }
      );
    }

    // Normal Supabase authentication.
    const supabase = await createClient();

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error("SUPABASE LOGIN ERROR:", {
        message: error.message,
        status: error.status,
        code: error.code,
      });

      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Unable to sign in." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: data.user.id,
          email: data.user.email ?? email,
          name:
            (data.user.user_metadata?.name as string) ||
            data.user.email?.split("@")[0] ||
            "User",
          role:
            data.user.app_metadata?.role === "admin"
              ? "admin"
              : "user",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("LOGIN SERVER ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong while signing in." },
      { status: 500 }
    );
  }
}