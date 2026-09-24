"use client";

import { X } from "lucide-react";
import type { GeoResult } from "@/types/weather";

interface Props {
  locations: GeoResult[];
  active: GeoResult | null;
  onSelect: (loc: GeoResult) => void;
  onRemove: (loc: GeoResult) => void;
}

function keyOf(loc: GeoResult) {
  return `${loc.latitude.toFixed(2)}-${loc.longitude.toFixed(2)}`;
}

export function LocationTabs({ locations, active, onSelect, onRemove }: Props) {
  if (!locations.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
      {locations.map((loc) => {
        const isActive = active ? keyOf(active) === keyOf(loc) : false;
        return (
          <div
            key={keyOf(loc)}
            className={`group flex shrink-0 items-center gap-1 rounded-full border py-1.5 pl-4 pr-1.5 text-sm backdrop-blur transition-colors ${
              isActive
                ? "border-cyan/40 bg-cyan/10 text-cloud"
                : "border-white/10 bg-white/[0.05] text-slate hover:border-white/20 hover:text-cloud"
            }`}
          >
            <button onClick={() => onSelect(loc)} className="flex items-center gap-1.5 whitespace-nowrap">
              {loc.name}
            </button>
            <button
              onClick={() => onRemove(loc)}
              title="Remove"
              className="rounded-full p-1 text-slate opacity-100 transition hover:bg-white/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}