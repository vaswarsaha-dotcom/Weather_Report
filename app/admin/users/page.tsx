"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { GlassCard } from "@/components/ui/Card";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  lastLoginAt: string | null;
  favoriteCityCount: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = async (q: string) => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/users", window.location.origin);
      if (q) url.searchParams.set("q", q);
      const res = await fetch(url.toString());
      const data = await res.json();
      setUsers(data.users ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => loadUsers(query), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const toggleRole = async (user: AdminUser) => {
    setUpdatingId(user.id);
    const nextRole = user.role === "admin" ? "user" : "admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: nextRole })
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cloud">Users</h1>
        <p className="text-sm text-slate">Search accounts and manage admin access.</p>
      </div>

      <GlassCard className="p-4">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5">
          <Search className="h-4 w-4 text-slate" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            aria-label="Search users"
            className="w-full bg-transparent text-sm text-cloud outline-none placeholder:text-slate/60"
          />
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-slate/70">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Favorites</th>
                <th className="px-6 py-3">Last login</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate">
                    No users match that search.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0">
                    <td className="px-6 py-3 text-cloud">{u.name}</td>
                    <td className="px-6 py-3 text-slate">{u.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs capitalize ${
                          u.role === "admin" ? "bg-amber/15 text-amber" : "bg-white/5 text-slate"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate">{u.favoriteCityCount}</td>
                    <td className="px-6 py-3 text-slate">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-3 text-slate">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => toggleRole(u)}
                        disabled={updatingId === u.id}
                        className="text-xs text-cyan hover:underline disabled:opacity-50"
                      >
                        {u.role === "admin" ? "Revoke admin" : "Make admin"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
