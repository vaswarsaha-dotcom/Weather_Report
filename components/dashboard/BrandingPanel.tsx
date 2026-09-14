// components/dashboard/BrandingPanel.tsx
"use client";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Branding } from "@/types/user";

const DEFAULT_BRANDING: Branding = {
  primaryColor: "#f59e0b",
  font: "fraunces",
  radius: "soft",
  theme: "dark",
  logoUrl: null,
};

export function BrandingPanel({ initial }: { initial: Branding | null }) {
  const [branding, setBranding] = useState<Branding>(initial ?? DEFAULT_BRANDING);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true); setSaved(false);
    const res = await fetch("/api/user/branding", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(branding),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  return (
    <GlassCard>
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate mb-4">White-label branding</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Primary color" type="color" value={branding.primaryColor}
          onChange={(e) => setBranding((b) => ({ ...b, primaryColor: e.target.value }))} className="h-11 p-1" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate">Display font</label>
          <select value={branding.font}
            onChange={(e) => setBranding((b) => ({ ...b, font: e.target.value as Branding["font"] }))}
            className="bg-ink border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-cloud outline-none focus:border-amber">
            <option value="fraunces">Fraunces (serif)</option>
            <option value="inter">Inter (sans)</option>
            <option value="system">System default</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate">Corner radius</label>
          <select value={branding.radius}
            onChange={(e) => setBranding((b) => ({ ...b, radius: e.target.value as Branding["radius"] }))}
            className="bg-ink border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-cloud outline-none focus:border-amber">
            <option value="sharp">Sharp</option>
            <option value="soft">Soft</option>
            <option value="round">Round</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate">Theme</label>
          <select value={branding.theme}
            onChange={(e) => setBranding((b) => ({ ...b, theme: e.target.value as Branding["theme"] }))}
            className="bg-ink border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-cloud outline-none focus:border-amber">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <Input label="Logo URL" placeholder="https://…" value={branding.logoUrl || ""}
          onChange={(e) => setBranding((b) => ({ ...b, logoUrl: e.target.value || null }))} className="sm:col-span-2" />
      </div>
      <div className="flex items-center gap-3 mt-5">
        <Button onClick={save} loading={saving}>Save branding</Button>
        {saved && <span className="text-xs text-cyan">Saved.</span>}
      </div>
    </GlassCard>
  );
}