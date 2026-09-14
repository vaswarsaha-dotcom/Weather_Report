// app/dashboard/widget/page.tsx
"use client";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";

export default function WidgetBuilderPage() {
  const [lat, setLat] = useState("22.5726");
  const [lon, setLon] = useState("88.3639");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const snippet = [
    "<script",
    `  src="${process.env.NEXT_PUBLIC_APP_URL}/weather-widget.js"`,
    `  data-lat="${lat}"`,
    `  data-lon="${lon}"`,
    `  data-theme="${theme}"`,
    "  async",
    '></script>',
    '<div id="weathersphere-widget"></div>',
  ].join("\n");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl font-bold text-cloud">Embeddable widget</h1>
      <GlassCard>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <Input label="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
          <Input label="Longitude" value={lon} onChange={(e) => setLon(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="widget-theme" className="text-xs font-medium text-slate">
              Theme
            </label>
            <select
              id="widget-theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as "dark" | "light")}
              className="bg-ink border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-cloud outline-none focus:border-amber"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
        <label className="text-xs font-medium text-slate">Embed code</label>
        <pre className="bg-ink border border-white/10 rounded-xl p-4 text-xs font-mono text-cloud mt-1.5 overflow-x-auto whitespace-pre-wrap">
          {snippet}
        </pre>
      </GlassCard>
    </div>
  );
}