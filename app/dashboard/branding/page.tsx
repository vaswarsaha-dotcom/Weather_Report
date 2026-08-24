"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Branding {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  font: string;
  borderRadius: string;
  theme: "light" | "dark";
}

const FONT_OPTIONS = ["Inter", "Roboto", "Poppins", "Lato", "Montserrat"];

export default function BrandingPage() {
  const [branding, setBranding] = useState<Branding>({
    companyName: "WeatherSphere Pro",
    logoUrl: "",
    primaryColor: "#F5A623",
    font: "Inter",
    borderRadius: "1rem",
    theme: "dark"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/user/branding")
      .then((res) => res.json())
      .then((data) => {
        if (data.branding) setBranding(data.branding);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/user/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branding)
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-xl2 border border-white/10 bg-white/[0.04]" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cloud">Branding</h1>
        <p className="text-sm text-slate">Applied across your dashboard and the embeddable widget.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <GlassCard className="space-y-4 p-6">
          <Input
            label="Company name"
            value={branding.companyName}
            onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
          />
          <Input
            label="Logo URL"
            placeholder="https://yourcompany.com/logo.png"
            value={branding.logoUrl}
            onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-dim dark:text-slate-200/80">Brand color</label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-white/15 bg-transparent"
                />
                <span className="font-mono text-sm text-slate">{branding.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-dim dark:text-slate-200/80">Font</label>
              <select
                value={branding.font}
                onChange={(e) => setBranding({ ...branding, font: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f} value={f} className="bg-dusk">
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-dim dark:text-slate-200/80">Border radius</label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.125}
              value={parseFloat(branding.borderRadius)}
              onChange={(e) => setBranding({ ...branding, borderRadius: `${e.target.value}rem` })}
              className="mt-2 w-full accent-amber"
            />
            <p className="mt-1 font-mono text-xs text-slate">{branding.borderRadius}</p>
          </div>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setBranding({ ...branding, theme: t })}
                className={`rounded-full px-4 py-1.5 text-sm capitalize transition ${
                  branding.theme === t ? "bg-amber text-ink" : "border border-white/15 text-slate"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={save} loading={saving}>
              Save branding
            </Button>
            {saved && <span className="text-sm text-cyan">Saved</span>}
          </div>
        </GlassCard>

        <div
          className="flex flex-col gap-4 border p-6"
          style={{
            borderRadius: branding.borderRadius,
            borderColor: "rgba(255,255,255,0.1)",
            background: branding.theme === "dark" ? "#161F38" : "#FFFFFF",
            color: branding.theme === "dark" ? "#F4F6FA" : "#161F38",
            fontFamily: branding.font
          }}
        >
          <div className="flex items-center gap-2">
            {branding.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logoUrl} alt="" className="h-6 w-6 rounded" />
            ) : (
              <div className="h-6 w-6 rounded" style={{ background: branding.primaryColor }} />
            )}
            <span className="text-sm font-semibold">{branding.companyName}</span>
          </div>
          <div>
            <p className="text-4xl font-medium">28°</p>
            <p className="text-sm opacity-70">Partly cloudy · Preview</p>
          </div>
          <button
            className="w-fit rounded-full px-4 py-2 text-sm font-medium text-ink"
            style={{ background: branding.primaryColor, borderRadius: branding.borderRadius }}
          >
            View forecast
          </button>
        </div>
      </div>
    </div>
  );
}
