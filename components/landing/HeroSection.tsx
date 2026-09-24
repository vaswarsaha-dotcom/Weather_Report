// components/landing/HeroSection.tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IsobarField } from "@/components/landing/IsobarField";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-isobar-glow px-6 pb-24 pt-36 sm:pt-40">
      <IsobarField />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-amber/10 blur-3xl" />
      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-block text-xs font-mono tracking-wide text-amber border border-amber/30 rounded-full px-3 py-1 mb-6">
          Weather intelligence, white-labeled
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-cloud animate-fade-up sm:text-6xl">
          Forecasts your product can call its own.
        </h1>
        <p className="text-slate text-lg mt-6 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Live conditions, 10-day outlooks, smart alerts, and an embeddable widget — branded with your logo and colors, running on your domain.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <Link href="/signup"><Button size="lg">Start free</Button></Link>
          <Link href="/dashboard"><Button size="lg" variant="secondary">View dashboard</Button></Link>
        </div>
      </div>
    </section>
  );
}