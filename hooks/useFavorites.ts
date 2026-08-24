"use client";

import { useCallback, useEffect, useState } from "react";
import type { GeoResult } from "@/types/weather";

export function useFavorites() {
  const [favorites, setFavorites] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/favorites");
      const data = await res.json();
      setFavorites(data.favorites ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addFavorite = useCallback(async (city: GeoResult) => {
    const res = await fetch("/api/user/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(city)
    });
    const data = await res.json();
    if (res.ok) setFavorites(data.favorites);
  }, []);

  const removeFavorite = useCallback(async (city: GeoResult) => {
    const url = new URL("/api/user/favorites", window.location.origin);
    url.searchParams.set("lat", String(city.latitude));
    url.searchParams.set("lon", String(city.longitude));
    const res = await fetch(url.toString(), { method: "DELETE" });
    const data = await res.json();
    if (res.ok) setFavorites(data.favorites);
  }, []);

  return { favorites, loading, addFavorite, removeFavorite, refresh };
}
