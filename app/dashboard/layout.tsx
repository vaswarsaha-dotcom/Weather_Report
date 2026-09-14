// app/dashboard/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/history", label: "History" },
  { href: "/dashboard/alerts", label: "Alerts" },
  { href: "/dashboard/widget", label: "Widget" },
  { href: "/dashboard/branding", label: "Branding" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login?redirect=/dashboard");

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="font-display font-bold text-cloud">{process.env.NEXT_PUBLIC_APP_NAME}</div>
          <nav className="flex gap-1 text-sm">
            {NAV.map((l) => <Link key={l.href} href={l.href} className="px-3 py-1.5 rounded-lg text-slate hover:text-cloud hover:bg-white/5">{l.label}</Link>)}
          </nav>
          <div className="flex items-center gap-3 text-sm text-slate">
            {user.name}
            {user.role === "admin" && <Link href="/admin" className="text-amber">Admin</Link>}
          </div>
        </div>
      </header>
      <main className="w-full px-6 py-8">{children}</main>
    </div>
  );
}