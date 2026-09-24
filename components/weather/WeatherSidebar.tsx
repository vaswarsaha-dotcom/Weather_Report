"use client";

import {
  CloudSun,
  Clock3,
  Info,
  Map,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

export type ViewKey =
  | "current"
  | "hourly"
  | "details"
  | "maps"
  | "monthly"
  | "trends";

interface WeatherSidebarProps {
  activeView: ViewKey;
  onChange: (view: ViewKey) => void;
}

const items: {
  key: ViewKey;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    key: "current",
    label: "Current",
    icon: CloudSun,
  },
  {
    key: "hourly",
    label: "Hourly",
    icon: Clock3,
  },
  {
    key: "details",
    label: "Details",
    icon: Info,
  },
  {
    key: "maps",
    label: "Maps",
    icon: Map,
  },
  {
    key: "monthly",
    label: "Monthly",
    icon: CalendarDays,
  },
  {
    key: "trends",
    label: "Trends",
    icon: TrendingUp,
  },
];

export function WeatherSidebar({
  activeView,
  onChange,
}: WeatherSidebarProps) {
  return (
    <div className="w-full">
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.05]
          p-2.5
          shadow-glass
          backdrop-blur-xl
        "
      >
        {/* Header */}
        <div className="px-3 pb-3 pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate">
            Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onChange(item.key)}
                className={`
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-2xl
                  px-3.5
                  py-2.5
                  text-left
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    active
                      ? "bg-amber/10 text-amber-soft ring-1 ring-amber/20"
                      : "text-slate hover:bg-white/5 hover:text-cloud"
                  }
                `}
              >
                <Icon
                  className={`
                    h-[18px]
                    w-[18px]
                    shrink-0
                    transition-colors
                    ${
                      active
                        ? "text-amber"
                        : "text-slate group-hover:text-cloud"
                    }
                  `}
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}