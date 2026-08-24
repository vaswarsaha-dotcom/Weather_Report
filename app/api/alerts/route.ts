import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AlertModel, type AlertType } from "@/models/Alert";

const VALID_TYPES: AlertType[] = ["rain", "heat", "wind", "aqi"];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const alerts = await AlertModel.find({ userId: session.userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ alerts });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { type, cityName, latitude, longitude, threshold } = body ?? {};

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid alert type" }, { status: 400 });
  }
  if (!cityName || typeof latitude !== "number" || typeof longitude !== "number" || typeof threshold !== "number") {
    return NextResponse.json({ error: "Missing or invalid alert fields" }, { status: 400 });
  }

  await connectDB();

  const existingCount = await AlertModel.countDocuments({ userId: session.userId });
  if (existingCount >= 25) {
    return NextResponse.json({ error: "Alert limit reached (25)" }, { status: 400 });
  }

  const alert = await AlertModel.create({
    userId: session.userId,
    type,
    cityName,
    latitude,
    longitude,
    threshold
  });

  return NextResponse.json({ alert }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing alert id" }, { status: 400 });

  await connectDB();
  await AlertModel.deleteOne({ _id: id, userId: session.userId });

  return NextResponse.json({ ok: true });
}
