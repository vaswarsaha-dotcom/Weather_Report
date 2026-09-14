// components/landing/HeroSection.tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-isobar-glow pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-mono tracking-wide text-amber border border-amber/30 rounded-full px-3 py-1 mb-6">
          Weather intelligence, white-labeled
        </span>
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-cloud leading-tight animate-fade-up">
          Forecasts your product can call its own.
        </h1>
        <p className="text-slate text-lg mt-6 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Live conditions, 10-day outlooks, smart alerts, and an embeddable widget — branded with your logo and colors, running on your domain.
        </p>
        <div className="flex items-center justify-center gap-3 mt-9 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <Link href="/signup"><Button size="lg">Start free</Button></Link>
          <Link href="/dashboard"><Button size="lg" variant="secondary">View dashboard</Button></Link>
        </div>
      </div>
    </section>
  );
}