import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { checkRateLimit, keyFromRequest } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const rl = checkRateLimit(keyFromRequest(req, "login"), 15, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  await connectDB();

  const user = await User.findOne({ email });
  // Use a generic error for both "no user" and "wrong password" to avoid
  // leaking which emails are registered.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signSession({ userId: user.id, email: user.email, role: user.role });
  await setSessionCookie(token);

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
