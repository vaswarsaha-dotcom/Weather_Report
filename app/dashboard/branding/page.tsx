// app/dashboard/branding/page.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BrandingPanel } from "@/components/dashboard/BrandingPanel";

export default async function BrandingPage() {
  const user = await getSession();
  if (!user) redirect("/login?redirect=/dashboard/branding");
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl font-bold text-cloud">Branding</h1>
      <BrandingPanel initial={user.branding} />
    </div>
  );
}