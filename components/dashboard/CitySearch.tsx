"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MapPin, Star, Loader2 } from "lucide-react";
import type { GeoResult } from "@/types/weather";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { GlassCard } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function CitySearch({
  onSelect,
  current
}: {
  onSelect: (city: GeoResult) => void;
  current: GeoResult | null;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { detect, detecting } = useGeolocation();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = new URL("/api/geocode", window.location.origin);
        url.searchParams.set("q", query);
        const res = await fetch(url.toString());
        const data = await res.json();
        setResults(data.results ?? []);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const isFavorite = current
    ? favorites.some((f) => f.latitude === current.latitude && f.longitude === current.longitude)
    : false;

  return (
    <GlassCard className="relative p-4">
      <div className="flex items-center gap-3">
        <Search className="h-4 w-4 shrink-0 text-slate" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search any city..."
          aria-label="Search for a city"
          className="w-full bg-transparent text-sm text-cloud placeholder:text-slate/60 focus:outline-none"
        />
        {searching && <Loader2 className="h-4 w-4 animate-spin text-slate" aria-hidden="true" />}
        <button
          onClick={async () => {
            const loc = await detect();
            if (loc) {
              onSelect(loc);
              setOpen(false);
            }
          }}
          disabled={detecting}
          aria-label="Use my current location"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate transition hover:border-cyan/50 hover:text-cyan disabled:opacity-50"
        >
          {detecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
          Locate me
        </button>
        {current && (
          <button
            onClick={() => (isFavorite ? removeFavorite(current) : addFavorite(current))}
            aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
            aria-pressed={isFavorite}
            className="shrink-0"
          >
            <Star
              className={cn("h-4 w-4 transition", isFavorite ? "fill-amber text-amber" : "text-slate")}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {open && (query.length >= 2 ? results.length > 0 : favorites.length > 0) && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-xl border border-white/10 bg-dusk shadow-glass">
          {query.length >= 2
            ? results.map((r) => (
                <ResultRow
                  key={`${r.latitude}-${r.longitude}`}
                  city={r}
                  onClick={() => {
                    onSelect(r);
                    setQuery("");
                    setOpen(false);
                  }}
                />
              ))
            : favorites.map((r) => (
                <ResultRow
                  key={`${r.latitude}-${r.longitude}`}
                  city={r}
                  favorite
                  onClick={() => {
                    onSelect(r);
                    setOpen(false);
                  }}
                />
              ))}
        </div>
      )}
    </GlassCard>
  );
}

function ResultRow({ city, onClick, favorite }: { city: GeoResult; onClick: () => void; favorite?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-cloud transition hover:bg-white/5"
    >
      {favorite ? (
        <Star className="h-3.5 w-3.5 shrink-0 fill-amber text-amber" aria-hidden="true" />
      ) : (
        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate" aria-hidden="true" />
      )}
      <span>
        {city.name}
        {city.admin1 ? `, ${city.admin1}` : ""} {city.country ? `· ${city.country}` : ""}
      </span>
    </button>
  );
}
