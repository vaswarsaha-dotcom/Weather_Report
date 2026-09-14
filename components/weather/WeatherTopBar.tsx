"use client";

import { RefreshCw } from "lucide-react";

interface Props {
  title: string;
  eyebrow: string;
  unit: "C" | "F";
  onChangeUnit: (unit: "C" | "F") => void;
  onRefresh: () => void;
  loading: boolean;
  disabled?: boolean;
}

export function WeatherTopBar({
  title,
  eyebrow,
  unit,
  onChangeUnit,
  onRefresh,
  loading,
  disabled,
}: Props) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-cloud sm:text-4xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur">
          {(["C", "F"] as const).map((value) => (
            <button
              key={value}
              onClick={() => onChangeUnit(value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                unit === value
                  ? "bg-white text-ink"
                  : "text-slate hover:text-cloud"
              }`}
            >
              °{value}
            </button>
          ))}
        </div>

        <button
          onClick={onRefresh}
          disabled={disabled || loading}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-cloud backdrop-blur transition hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
    </div>
  );
}