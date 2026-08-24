import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { WeatherSnapshotModel } from "@/models/WeatherSnapshot";
import { AlertModel } from "@/models/Alert";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  await connectDB();

  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, newThisWeek, activeToday, totalAlerts, activeAlerts, apiCallsToday, apiCallsWeek, recentSignups] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      User.countDocuments({ lastLoginAt: { $gte: dayAgo } }),
      AlertModel.countDocuments(),
      AlertModel.countDocuments({ active: true }),
      WeatherSnapshotModel.countDocuments({ recordedAt: { $gte: dayAgo } }),
      WeatherSnapshotModel.countDocuments({ recordedAt: { $gte: weekAgo } }),
      User.find().sort({ createdAt: -1 }).limit(8).select("name email createdAt role").lean()
    ]);

  // Daily API usage over the last 7 days, for a simple trend chart.
  const usageByDay = await WeatherSnapshotModel.aggregate([
    { $match: { recordedAt: { $gte: weekAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$recordedAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const alertsByType = await AlertModel.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]);

  return NextResponse.json({
    totalUsers,
    newThisWeek,
    activeToday,
    totalAlerts,
    activeAlerts,
    apiCallsToday,
    apiCallsWeek,
    recentSignups,
    usageByDay: usageByDay.map((d) => ({ date: d._id, count: d.count })),
    alertsByType: alertsByType.map((a) => ({ type: a._id, count: a.count }))
  });
}
