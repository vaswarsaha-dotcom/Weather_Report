// components/admin/UsersTable.tsx
"use client";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

interface AdminUser { id: string; email: string; name: string; role: "user" | "admin"; created_at: string; }

export function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers((await res.json()).users);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function changeRole(id: string, role: "user" | "admin") {
    setUpdating(id);
    await fetch("/api/admin/users", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, role }),
    });
    setUpdating(null);
    load();
  }

  if (loading) return <p className="text-sm text-slate">Loading users…</p>;

  return (
    <GlassCard padded={false}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-dim border-b border-white/10">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Email</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-white/5 last:border-0">
              <td className="px-5 py-3 text-cloud">{u.name}</td>
              <td className="px-5 py-3 text-slate">{u.email}</td>
              <td className="px-5 py-3">
                <select value={u.role} disabled={updating === u.id}
                  onChange={(e) => changeRole(u.id, e.target.value as "user" | "admin")}
                  className="bg-ink border border-white/10 rounded-lg px-2 py-1 text-xs text-cloud outline-none focus:border-amber">
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="px-5 py-3 text-slate font-mono text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}
