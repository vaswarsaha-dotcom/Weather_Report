// components/admin/AdminNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import clsx from "clsx";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="w-56 shrink-0 border-r border-white/10 min-h-screen py-8 px-4">
      <div className="font-display text-lg font-bold text-cloud mb-8 px-2">Admin</div>
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link key={l.href} href={l.href}
            className={clsx("flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors",
              active ? "bg-amber/15 text-amber" : "text-slate hover:text-cloud hover:bg-white/5")}>
            <l.icon size={16} />{l.label}
          </Link>
        );
      })}
    </nav>
  );
}