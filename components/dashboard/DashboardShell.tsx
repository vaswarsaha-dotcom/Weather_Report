"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  History,
  Bell,
  Code2,
  Palette,
  CloudSun,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/maps", label: "Weather maps", icon: Map },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/widget", label: "Widget builder", icon: Code2 },
  { href: "/dashboard/branding", label: "Branding", icon: Palette }
];

export function DashboardShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-cloud text-ink dark:bg-ink dark:text-cloud">
      <div className="flex">
        <aside className="hidden w-64 flex-col border-r border-black/5 bg-white/50 px-4 py-6 dark:border-white/5 dark:bg-white/[0.02] lg:flex">
          <Link href="/" className="mb-8 flex items-center gap-2 px-2 font-display text-lg font-semibold">
            <CloudSun className="h-6 w-6 text-amber" aria-hidden="true" />
            WeatherSphere
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-amber/15 text-amber"
                      : "text-slate-dim hover:bg-black/5 dark:text-slate dark:hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-1 border-t border-black/5 pt-4 dark:border-white/5">
            <p className="truncate px-3 text-xs text-slate">{userEmail}</p>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-dim transition hover:bg-black/5 dark:text-slate dark:hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
            <p className="text-sm text-slate">Dashboard</p>
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-full border border-black/10 p-2 text-slate-dim transition hover:bg-black/5 dark:border-white/10 dark:text-slate dark:hover:bg-white/5"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </header>

          <main className="px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
