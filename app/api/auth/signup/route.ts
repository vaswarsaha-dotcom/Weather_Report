import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";
import { checkRateLimit, keyFromRequest } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const rl = checkRateLimit(keyFromRequest(req, "signup"), 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    lastLoginAt: new Date()
  });

  const token = signSession({ userId: user.id, email: user.email, role: user.role });
  await setSessionCookie(token);

  return NextResponse.json(
    { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    { status: 201 }
  );
}
