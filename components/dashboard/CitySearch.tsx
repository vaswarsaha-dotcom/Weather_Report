// components/dashboard/CitySearch.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, MapPin, Star, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { GeoResult } from "@/types/weather";

interface CitySearchProps {
  onSelect: (result: GeoResult) => void;
  onUseLocation?: () => void;
  locating?: boolean;
  current?: GeoResult | null;
}

export function CitySearch({ onSelect, onUseLocation, locating = false }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={boxRef} className="relative z-40 w-full sm:max-w-md">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 shadow-glass backdrop-blur-xl transition focus-within:border-cyan/60 focus-within:bg-white/[0.1] focus-within:ring-4 focus-within:ring-cyan/10">
        <Search size={16} className="text-slate shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search a city…"
          className="bg-transparent outline-none text-base sm:text-sm text-cloud placeholder:text-slate-dim flex-1 min-w-0"
        />
        {searching && <Loader2 size={14} className="animate-spin text-slate shrink-0" />}
        <button
          type="button"
          onClick={() => onUseLocation?.()}
          disabled={locating}
          title="Use current location"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate transition-colors hover:bg-white/10 hover:text-amber disabled:opacity-50"
        >
          {locating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
        </button>
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-[#141d36] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
          {results.map((r) => {
            const label = [r.name, r.admin1, r.country]
              .filter(Boolean)
              .join(", ");
            return (
              <button
                key={r.id}
                onClick={() => {
                  onSelect(r);
                  setQuery(label);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-cloud transition-colors hover:bg-white/[0.06]"
              >
                <MapPin size={13} className="text-slate shrink-0" />
                <span className="min-w-0 truncate">{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface FavoriteChipsProps {
  favorites: { id: string; placeName: string; lat: number; lon: number }[];
  onSelect: (f: { lat: number; lon: number; label: string }) => void;
  onRemove: (id: string) => void;
}

export function FavoriteChips({ favorites, onSelect, onRemove }: FavoriteChipsProps) {
  if (!favorites.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {favorites.map((f) => (
        <div
          key={f.id}
          className="group flex items-center gap-1.5 bg-dusk2 border border-white/10 rounded-full pl-3 pr-1.5 py-1 text-xs text-slate hover:border-amber/40 transition-colors"
        >
          <button onClick={() => onSelect({ lat: f.lat, lon: f.lon, label: f.placeName })} className="hover:text-cloud flex items-center gap-1.5">
            <Star size={11} className="text-amber" fill="currentColor" />
            {f.placeName}
          </button>
          <button
            onClick={() => onRemove(f.id)}
            className="opacity-0 group-hover:opacity-100 text-slate-dim hover:text-red-400 transition-opacity px-1"
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}