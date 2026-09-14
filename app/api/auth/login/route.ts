// app/api/auth/login/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { findUserByEmail, verifyPassword, setSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rl = rateLimit(`login:${ip}`, 10, 60_000);
  if (!rl.allowed) return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  const { email, password } = parsed.data;

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setSessionCookie({ sub: user.id, role: user.role, email: user.email });
  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, branding: user.branding },
  });
}