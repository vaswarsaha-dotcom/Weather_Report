import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.userId).select("favoriteCities");
  return NextResponse.json({ favorites: user?.favoriteCities ?? [] });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const city = await req.json().catch(() => null);
  if (!city?.name || typeof city.latitude !== "number" || typeof city.longitude !== "number") {
    return NextResponse.json({ error: "Invalid city payload" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const alreadySaved = user.favoriteCities.some(
    (c) => c.latitude === city.latitude && c.longitude === city.longitude
  );
  if (!alreadySaved) {
    if (user.favoriteCities.length >= 20) {
      return NextResponse.json({ error: "Favorite city limit reached (20)" }, { status: 400 });
    }
    user.favoriteCities.push({
      id: city.id ?? 0,
      name: city.name,
      country: city.country ?? "",
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone ?? "auto"
    });
    await user.save();
  }

  return NextResponse.json({ favorites: user.favoriteCities });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  await connectDB();
  const user = await User.findById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  user.favoriteCities = user.favoriteCities.filter((c) => !(c.latitude === lat && c.longitude === lon));
  await user.save();

  return NextResponse.json({ favorites: user.favoriteCities });
}
