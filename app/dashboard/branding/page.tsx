// app/dashboard/branding/page.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BrandingPanel } from "@/components/dashboard/BrandingPanel";

export default async function BrandingPage() {
  const user = await getSession();
  if (!user) redirect("/login?redirect=/dashboard/branding");

  const branding = (user as any).branding;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-cloud">Branding</h1>
      <BrandingPanel initial={branding} />
    </div>
  );
}