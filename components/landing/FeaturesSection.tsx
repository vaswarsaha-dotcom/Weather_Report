// components/landing/FeaturesSection.tsx
import { CloudSun, Bell, Map, Palette, LineChart, Code2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const FEATURES = [
  { icon: CloudSun, title: "Live forecasts", desc: "Current conditions, hourly, and 10-day outlooks from Open-Meteo with automatic fallback." },
  { icon: Bell, title: "Smart alerts", desc: "Temperature, rain, wind, and UV thresholds checked every 15 minutes, grouped by location." },
  { icon: Map, title: "Interactive maps", desc: "Leaflet-powered maps over OpenStreetMap tiles for any location you track." },
  { icon: LineChart, title: "Historical trends", desc: "Every forecast view quietly builds a trend chart — no separate polling worker required." },
  { icon: Palette, title: "White-label branding", desc: "Your logo, color, font, and corner radius — applied across the dashboard and widget." },
  { icon: Code2, title: "Embeddable widget", desc: "One script tag drops a branded live-weather widget into any site." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <GlassCard key={f.title} className="transition-colors hover:border-white/20 hover:bg-white/[0.07]">
            <f.icon size={22} className="text-amber mb-3" />
            <h3 className="font-display text-base font-semibold text-cloud">{f.title}</h3>
            <p className="text-sm text-slate mt-1.5 leading-relaxed">{f.desc}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}