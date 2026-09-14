"use client";

import type { ReactNode } from "react";
import type { WeatherSnapshot } from "@/types/weather";

interface Props {
  snapshot: WeatherSnapshot | null;
  children: ReactNode;
}

export function WeatherBackground({
  snapshot,
  children
}: Props) {
  const code =
    snapshot?.current.weatherCode ?? 0;

  const isDay =
    snapshot?.current.isDay ?? true;

  let background =
    "from-sky-950 via-slate-950 to-ink";

  if ([95, 96, 99].includes(code)) {
    background =
      "from-slate-950 via-indigo-950 to-ink";
  } else if (
    [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)
  ) {
    background =
      "from-slate-900 via-cyan-950 to-ink";
  } else if ([45, 48].includes(code)) {
    background =
      "from-slate-800 via-slate-900 to-ink";
  } else if (!isDay) {
    background =
      "from-indigo-950 via-slate-950 to-ink";
  } else if (code === 0) {
    background =
      "from-cyan-950 via-sky-950 to-ink";
  }

  return (
    <div
      className={`relative -mx-6 -my-8 min-h-[calc(100vh-73px)] overflow-hidden bg-gradient-to-br ${background} px-6 py-8`}
    >

      <div className="pointer-events-none absolute inset-0 bg-isobar-glow opacity-70" />

      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-cyan/10 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-amber/10 blur-3xl" />

      <div className="relative">
        {children}
      </div>

    </div>
  );
}