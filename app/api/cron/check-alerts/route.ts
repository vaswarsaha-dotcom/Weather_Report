// app/api/cron/check-alerts/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { checkAllAlerts } from "@/lib/alerts";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await checkAllAlerts();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron/check-alerts]", err);
    return NextResponse.json({ error: "Alert check failed." }, { status: 500 });
  }
}