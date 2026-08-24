import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validation";
import { checkRateLimit, keyFromRequest } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const rl = checkRateLimit(keyFromRequest(req, "forgot-password"), 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findOne({ email: parsed.data.email });

  // Always return success regardless of whether the account exists, so the
  // response can't be used to enumerate registered emails. If a user was
  // found, this is the spot to generate a signed reset token and send it
  // through your email provider (Resend, SES, Postmark, etc.).
  if (user) {
    // TODO: generate a short-lived reset token and email it via your provider.
    // const resetToken = signSession({ userId: user.id, email: user.email, role: user.role });
    // await sendEmail({ to: user.email, template: "reset-password", data: { resetToken } });
  }

  return NextResponse.json({
    message: "If an account exists for that email, a reset link is on its way."
  });
}
