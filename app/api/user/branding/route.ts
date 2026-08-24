import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.userId).select("branding");
  return NextResponse.json({ branding: user?.branding });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { companyName, logoUrl, primaryColor, font, borderRadius, theme } = body;

  await connectDB();
  const user = await User.findById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.branding = {
    companyName: companyName ?? user.branding.companyName,
    logoUrl: logoUrl ?? user.branding.logoUrl,
    primaryColor: primaryColor ?? user.branding.primaryColor,
    font: font ?? user.branding.font,
    borderRadius: borderRadius ?? user.branding.borderRadius,
    theme: theme === "light" || theme === "dark" ? theme : user.branding.theme
  };
  await user.save();

  return NextResponse.json({ branding: user.branding });
}
