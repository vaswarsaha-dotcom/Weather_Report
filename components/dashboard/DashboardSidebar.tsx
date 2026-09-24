"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CloudSun,
  Clock3,
  Info,
  Map,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

const navigation = [
  {
    name: "Current",
    href: "/dashboard",
    icon: CloudSun,
  },
  {
    name: "Hourly",
    href: "/dashboard/hourly",
    icon: Clock3,
  },
  {
    name: "Details",
    href: "/dashboard/details",
    icon: Info,
  },
  {
    name: "Maps",
    href: "/dashboard/maps",
    icon: Map,
  },
  {
    name: "Monthly",
    href: "/dashboard/monthly",
    icon: CalendarDays,
  },
  {
    name: "Trends",
    href: "/dashboard/trends",
    icon: TrendingUp,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full">
      <div
        className="
          rounded-2xl
          border border-white/10
          bg-slate-950/70
          backdrop-blur-xl
          shadow-lg
          p-3
        "
      >
        {/* Navigation title */}
        <div className="mb-2 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  transition-all
                  duration-200

                  ${
                    active
                      ? "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`
                    h-4 w-4 shrink-0 transition-colors
                    ${
                      active
                        ? "text-amber-300"
                        : "text-slate-500 group-hover:text-slate-300"
                    }
                  `}
                  strokeWidth={1.8}
                />

                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}