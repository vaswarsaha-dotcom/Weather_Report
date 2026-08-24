"use client";

import { motion } from "framer-motion";
import { CloudRain, MapPinned, History, Bell, Code2, Palette } from "lucide-react";
import { GlassCard } from "@/components/ui/Card";

const features = [
  {
    icon: CloudRain,
    title: "Live, hyperlocal forecasts",
    body: "Current conditions, hourly and 7-day outlooks, sourced from Open-Meteo with automatic fallback so your dashboard never goes dark."
  },
  {
    icon: MapPinned,
    title: "Interactive weather maps",
    body: "Temperature, rain, cloud, and wind layers on a Leaflet map your users can pan and zoom without leaving the dashboard."
  },
  {
    icon: History,
    title: "Historical trends",
    body: "Every snapshot is stored, so weekly and monthly temperature, humidity, and wind trends are one chart away."
  },
  {
    icon: Bell,
    title: "Smart alerts",
    body: "Rain, heat, wind, and air-quality alerts your users configure once and forget — checked on a schedule server-side."
  },
  {
    icon: Palette,
    title: "White-label branding",
    body: "Swap in a logo, brand color, and font per account. Your customers never see WeatherSphere — they see their own product."
  },
  {
    icon: Code2,
    title: "Embeddable widget",
    body: "A single script tag drops a themed, responsive weather widget into any site your clients run."
  }
];

export function Features() {
  return (
    <section id="features" className="bg-ink px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-widest text-cyan">Built for builders</p>
          <h2 className="font-display text-4xl font-medium text-cloud sm:text-5xl">
            Everything a weather product needs, already wired together.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <GlassCard className="h-full p-6 transition hover:border-white/20 hover:bg-white/[0.06]">
                <f.icon className="h-6 w-6 text-amber" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-medium text-cloud">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{f.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
