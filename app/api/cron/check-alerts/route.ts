import { NextResponse } from "next/server";
import { runAlertCheck } from "@/lib/alerts";

/**
 * Scheduled entry point for alert evaluation. Configure a Vercel Cron Job
 * (vercel.json) or any external scheduler to hit this route periodically,
 * e.g. every 15 minutes:
 *
 *   { "crons": [{ "path": "/api/cron/check-alerts", "schedule": "*\/15 * * * *" }] }
 *
 * Protect it with a shared secret so it can't be triggered by anyone who
 * finds the URL.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (expected && authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const triggered = await runAlertCheck();

  // TODO: dispatch triggered alerts via email/push/webhook here.
  // for (const t of triggered) await notifyUser(t);

  return NextResponse.json({ checkedAt: new Date().toISOString(), triggeredCount: triggered.length, triggered });
}
