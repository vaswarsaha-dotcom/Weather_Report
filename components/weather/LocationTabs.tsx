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
    <div className="flex flex-wrap gap-2">
      {locations.map((loc) => {
        const isActive = active ? keyOf(active) === keyOf(loc) : false;
        return (
          <div
            key={keyOf(loc)}
            className={`group flex items-center gap-1.5 rounded-full border pl-4 pr-1.5 py-1.5 text-sm transition-colors ${
              isActive
                ? "border-cyan/40 bg-cyan/10 text-cloud"
                : "border-white/10 bg-black/20 text-slate hover:text-cloud"
            }`}
          >
            <button onClick={() => onSelect(loc)} className="flex items-center gap-1.5">
              {loc.name}
            </button>
            <button
              onClick={() => onRemove(loc)}
              title="Remove"
              className="opacity-0 group-hover:opacity-100 rounded-full p-1 text-slate-dim hover:text-red-400 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}