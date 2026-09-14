// hooks/useAuth.ts
"use client";
import { useCallback, useEffect, useState } from "react";
import type { PublicUser } from "@/types/user";

interface AuthState { user: PublicUser | null; loading: boolean; error: string | null; }

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) { setState({ user: null, loading: false, error: null }); return; }
      const data = await res.json();
      setState({ user: data.user, loading: false, error: null });
    } catch {
      setState({ user: null, loading: false, error: "Couldn't reach the server." });
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setState({ user: data.user, loading: false, error: null });
    return data.user as PublicUser;
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    setState({ user: data.user, loading: false, error: null });
    return data.user as PublicUser;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setState({ user: null, loading: false, error: null });
  }, []);

  return { ...state, login, signup, logout, refresh };
}