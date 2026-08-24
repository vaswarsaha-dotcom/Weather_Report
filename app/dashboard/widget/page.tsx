"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { GeoResult } from "@/types/weather";
import { GlassCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CitySearch } from "@/components/dashboard/CitySearch";

interface Branding {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  font: string;
  borderRadius: string;
  theme: "light" | "dark";
}

export default function WidgetBuilderPage() {
  const [branding, setBranding] = useState<Branding>({
    companyName: "WeatherSphere Pro",
    logoUrl: "",
    primaryColor: "#F5A623",
    font: "Inter",
    borderRadius: "1rem",
    theme: "dark"
  });
  const [city, setCity] = useState<GeoResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/user/branding")
      .then((res) => res.json())
      .then((data) => {
        if (data.branding) setBranding(data.branding);
      });
  }, []);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";
  const radiusPx = Math.round(parseFloat(branding.borderRadius || "1") * 16);

  const snippet = city
    ? `<script
  src="${appUrl}/weather-widget.js"
  data-city="${city.name}"
  data-lat="${city.latitude}"
  data-lon="${city.longitude}"
  data-timezone="${city.timezone}"
  data-color="${branding.primaryColor}"
  data-font="${branding.font}"
  data-radius="${radiusPx}"
  data-theme="${branding.theme}"
  async
></script>`
    : "";

  const copySnippet = async () => {
    if (!snippet) return;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cloud">Widget builder</h1>
        <p className="text-sm text-slate">
          Pick a city, then copy a single script tag into any site. It renders live weather, themed to
          your saved branding, and refreshes every 5 minutes on its own.
        </p>
      </div>

      <GlassCard className="p-6">
        <label className="mb-2 block text-sm text-slate-dim dark:text-slate-200/80">Widget city</label>
        <CitySearch onSelect={setCity} current={city} />
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-cloud">Embed code</h2>
            <Button size="sm" variant="outline" onClick={copySnippet} disabled={!snippet}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          {snippet ? (
            <pre className="mt-4 overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-xs leading-relaxed text-cloud">
              {snippet}
            </pre>
          ) : (
            <p className="mt-4 rounded-lg border border-white/10 bg-white/5 p-6 text-center text-sm text-slate">
              Search for a city above to generate your embed code.
            </p>
          )}

          <p className="mt-4 text-xs text-slate/70">
            Branding (color, font, radius, theme) comes from your{" "}
            <a href="/dashboard/branding" className="text-cyan hover:underline">
              Branding settings
            </a>
            . Update it there and regenerate this snippet.
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="font-display text-lg font-medium text-cloud">Live preview</h2>
          <div
            className="mt-4 flex flex-col gap-3 border p-5"
            style={{
              borderRadius: branding.borderRadius,
              borderColor: "rgba(255,255,255,0.1)",
              background: branding.theme === "dark" ? "#161F38" : "#FFFFFF",
              color: branding.theme === "dark" ? "#F4F6FA" : "#161F38",
              fontFamily: branding.font
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{city ? city.name : "Select a city"}</span>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: branding.primaryColor }} />
            </div>
            <p className="text-4xl font-medium leading-none">27°</p>
            <p className="text-xs opacity-70">Feels like 29° · Partly cloudy</p>
            <div className="flex gap-4 text-xs opacity-70">
              <span>💧 68%</span>
              <span>💨 14 km/h</span>
            </div>
            <p className="text-right text-[10px] opacity-50">Powered by {branding.companyName}</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
