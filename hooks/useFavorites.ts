// hooks/useFavorites.ts
"use client";
import { useCallback, useEffect, useState } from "react";

export interface Favorite { id: string; placeName: string; lat: number; lon: number; }

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/favorites");
      if (!res.ok) { setFavorites([]); return; }
      const data = await res.json();
      setFavorites(data.favorites || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addFavorite = useCallback(async (placeName: string, lat: number, lon: number) => {
    const res = await fetch("/api/user/favorites", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeName, lat, lon }),
    });
    if (!res.ok) throw new Error("Couldn't save that city.");
    await load();
  }, [load]);

  const removeFavorite = useCallback(async (id: string) => {
    setFavorites((f) => f.filter((fav) => fav.id !== id));
    const res = await fetch(`/api/user/favorites?id=${id}`, { method: "DELETE" });
    if (!res.ok) await load();
  }, [load]);

  return { favorites, loading, addFavorite, removeFavorite, refresh: load };
}