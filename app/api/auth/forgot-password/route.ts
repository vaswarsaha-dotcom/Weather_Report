import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const rl = rateLimit(`forgot-password:${ip}`, 5, 60_000);

    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Try again shortly." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = parsed.data.email.toLowerCase().trim();

    const supabase = createServiceClient();

    const { data: user } = await supabase
      .from("users")
      .select("id, email, name, role")
      .eq("email", normalizedEmail)
      .maybeSingle();

    // Always return the same success message regardless of whether the
    // account exists, so this endpoint can't be used to enumerate emails.
    if (user) {
      // TODO: generate a short-lived reset token and email it via your
      // provider (Resend, SES, Postmark, etc.). Example shape:
      // const resetToken = signResetToken({ sub: user.id, email: user.email });
      // await sendEmail({ to: user.email, template: "reset-password", data: { resetToken } });
    }

    return NextResponse.json({
      message:
        "If an account exists for that email, a reset link is on its way.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}