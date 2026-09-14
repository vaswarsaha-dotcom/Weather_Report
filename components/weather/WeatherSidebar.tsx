"use client";

import {
  Home,
  Clock,
  ListChecks,
  Map as MapIcon,
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

const ITEMS: { key: ViewKey; label: string; icon: typeof Home }[] = [
  { key: "current", label: "Current", icon: Home },
  { key: "hourly", label: "Hourly", icon: Clock },
  { key: "details", label: "Details", icon: ListChecks },
  { key: "maps", label: "Maps", icon: MapIcon },
  { key: "monthly", label: "Monthly", icon: CalendarDays },
  { key: "trends", label: "Trends", icon: TrendingUp },
];

interface Props {
  activeView: ViewKey;
  onChange: (view: ViewKey) => void;
}

export function WeatherSidebar({ activeView, onChange }: Props) {
  return (
    <nav className="flex shrink-0 flex-col gap-1 rounded-3xl border border-white/10 bg-white/[0.05] p-2 shadow-glass backdrop-blur-xl">
      {ITEMS.map(({ key, label, icon: Icon }) => {
        const active = key === activeView;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            title={label}
            className={`group flex flex-col items-center gap-1 rounded-2xl px-3 py-3 text-[10px] font-medium transition-colors ${
              active
                ? "bg-cyan/15 text-cyan"
                : "text-slate hover:bg-white/5 hover:text-cloud"
            }`}
          >
            <Icon
              className="h-5 w-5"
              strokeWidth={active ? 2 : 1.6}
            />
            <span className="hidden sm:block">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}