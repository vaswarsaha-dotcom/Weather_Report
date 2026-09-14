import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  createServiceClient,
} from "@/lib/supabase/server";
import {
  hashPassword,
  setSessionCookie,
  findUserByEmail,
} from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  try {
    // -----------------------------
    // Rate limiting
    // -----------------------------
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const rl = rateLimit(`signup:${ip}`, 5, 60_000);

    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: "Too many attempts. Try again shortly.",
        },
        { status: 429 }
      );
    }

    // -----------------------------
    // Parse request
    // -----------------------------
    const body = await req.json().catch(() => null);

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    // -----------------------------
    // Check existing user
    // -----------------------------
    const existing = await findUserByEmail(normalizedEmail);

    if (existing) {
      return NextResponse.json(
        {
          error: "An account with that email already exists.",
        },
        { status: 409 }
      );
    }

    // -----------------------------
    // Hash password
    // -----------------------------
    const passwordHash = await hashPassword(password);

    // -----------------------------
    // Supabase
    // -----------------------------
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("users")
      .insert({
        email: normalizedEmail,
        name: normalizedName,
        password_hash: passwordHash,
        role: "user",
      })
      .select("id, email, name, role, branding")
      .single();

    // -----------------------------
    // IMPORTANT:
    // Show the REAL Supabase error
    // in your terminal.
    // -----------------------------
    if (error) {
      console.error("=================================");
      console.error("SUPABASE SIGNUP ERROR");
      console.error("Message:", error.message);
      console.error("Code:", error.code);
      console.error("Details:", error.details);
      console.error("Hint:", error.hint);
      console.error("=================================");

      return NextResponse.json(
        {
          error: "Couldn't create the account.",
          details:
            process.env.NODE_ENV === "development"
              ? error.message
              : undefined,
        },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("SUPABASE SIGNUP ERROR: No data returned");

      return NextResponse.json(
        {
          error: "Account was not created.",
        },
        { status: 500 }
      );
    }

    // -----------------------------
    // Create login session
    // -----------------------------
    await setSessionCookie({
      sub: data.id,
      role: data.role,
      email: data.email,
    });

    // -----------------------------
    // Success
    // -----------------------------
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("=================================");
    console.error("SIGNUP SERVER ERROR");
    console.error(error);
    console.error("=================================");

    return NextResponse.json(
      {
        error: "Internal server error while creating account.",
      },
      { status: 500 }
    );
  }
}