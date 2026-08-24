"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Droplets, Wind, Gauge } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { IsobarField } from "./IsobarField";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink pt-24">
      <div className="absolute inset-0 bg-isobar-glow" aria-hidden="true" />
      <IsobarField />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-cyan"
          >
            Now white-label ready
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl font-medium leading-[1.05] text-cloud sm:text-6xl lg:text-7xl"
          >
            Weather intelligence,
            <br />
            <span className="italic text-amber">branded as your own.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-slate"
          >
            Live forecasts, historical trends, smart alerts, and an embeddable widget your
            clients can drop into any site — under your logo, your colors, your domain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg">
                Start free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 text-sm text-slate/70"
          >
            No credit card required · 5-minute setup
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate">Bhātpāra, IN</p>
                <p className="font-display text-5xl font-medium text-cloud">31°</p>
                <p className="text-sm text-slate">Feels like 34° · Partly cloudy</p>
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber to-amber-soft" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <StatPill icon={<Droplets className="h-4 w-4 text-cyan" />} label="Humidity" value="75%" />
              <StatPill icon={<Wind className="h-4 w-4 text-cyan" />} label="Wind" value="18 km/h" />
              <StatPill icon={<Gauge className="h-4 w-4 text-cyan" />} label="Pressure" value="1012 hPa" />
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 font-mono text-xs leading-relaxed text-slate">
              Expect a warm afternoon with moderate humidity and pleasant winds. Light rain is
              possible later today.
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
      <div className="mx-auto mb-1 flex justify-center">{icon}</div>
      <p className="font-mono text-sm text-cloud">{value}</p>
      <p className="text-[11px] text-slate/70">{label}</p>
    </div>
  );
}
