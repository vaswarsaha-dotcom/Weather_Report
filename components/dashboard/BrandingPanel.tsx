"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Branding } from "@/types/user";
import {
  Palette,
  Type,
  Square,
  Moon,
  Sun,
  ImageIcon,
  Check,
  AlertCircle,
  Droplets,
  Wind,
  Thermometer,
  CloudSun,
  MapPin,
  Sparkles,
} from "lucide-react";

const DEFAULT_BRANDING: Branding = {
  primaryColor: "#f59e0b",
  font: "fraunces",
  radius: "soft",
  theme: "dark",
  logoUrl: null,
};

function getRadius(radius: Branding["radius"]) {
  switch (radius) {
    case "sharp":
      return "6px";
    case "round":
      return "24px";
    case "soft":
    default:
      return "14px";
  }
}

function getRadiusPreview(radius: Branding["radius"]) {
  switch (radius) {
    case "sharp":
      return "4px";
    case "round":
      return "999px";
    case "soft":
    default:
      return "10px";
  }
}

function getFont(font: Branding["font"]) {
  switch (font) {
    case "fraunces":
      return "Georgia, 'Times New Roman', serif";

    case "inter":
      return "Inter, Arial, Helvetica, sans-serif";

    case "system":
    default:
      return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  }
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber/20 bg-amber/10 text-amber">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cloud">
          {title}
        </h3>
        <p className="text-xs text-slate mt-1">{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD WRAPPER
========================================================= */

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </label>
      {children}
    </div>
  );
}

export function BrandingPanel({
  initial,
}: {
  initial: Branding | null;
}) {
  const [branding, setBranding] = useState<Branding>(
    initial ?? DEFAULT_BRANDING
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const isDirty = useMemo(() => {
    const base = initial ?? DEFAULT_BRANDING;
    return JSON.stringify(base) !== JSON.stringify(branding);
  }, [branding, initial]);

  const preview = useMemo(() => {
    const dark = branding.theme === "dark";

    return {
      background: dark ? "#0f172a" : "#f8fafc",
      card: dark ? "#18233d" : "#ffffff",
      text: dark ? "#f8fafc" : "#0f172a",
      muted: dark ? "#94a3b8" : "#64748b",
      border: dark
        ? "rgba(255,255,255,0.10)"
        : "rgba(15,23,42,0.10)",
    };
  }, [branding.theme]);

  function update<K extends keyof Branding>(key: K, value: Branding[K]) {
    setBranding((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setError("");
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const res = await fetch("/api/user/branding", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(branding),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Failed to save branding."
        );
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save branding."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* =====================================================
          SETTINGS
      ====================================================== */}

      <GlassCard>
        <div className="flex items-start justify-between mb-6">
          <SectionHeader
            icon={Sparkles}
            title="White-label branding"
            description="Customize the appearance of your WeatherSphere experience."
          />

          {/* COLOR INDICATOR */}

          <div
            className="h-9 w-9 shrink-0 rounded-xl border border-white/10 shadow-inner"
            style={{
              backgroundColor: branding.primaryColor,
            }}
            title={branding.primaryColor}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* =================================================
              PRIMARY COLOR
          ================================================== */}

          <Field label="Primary color" icon={Palette}>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => update("primaryColor", e.target.value)}
                className="w-11 h-11 rounded-xl border border-white/10 bg-ink p-1 cursor-pointer"
                aria-label="Pick primary color"
              />

              <div
                className="flex-1 h-11 rounded-xl border flex items-center px-3 text-sm font-mono tracking-wide"
                style={{
                  borderColor: branding.primaryColor + "55",
                  background: branding.primaryColor + "0d",
                  color: branding.primaryColor,
                }}
              >
                {branding.primaryColor.toUpperCase()}
              </div>
            </div>
          </Field>

          {/* =================================================
              DISPLAY FONT
          ================================================== */}

          <Field label="Display font" icon={Type}>
            <select
              id="branding-font"
              value={branding.font}
              onChange={(e) =>
                update("font", e.target.value as Branding["font"])
              }
              className="bg-ink border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-cloud outline-none transition-colors focus:border-amber hover:border-white/20"
              style={{ fontFamily: getFont(branding.font) }}
            >
              <option value="fraunces">Fraunces (serif)</option>
              <option value="inter">Inter (sans)</option>
              <option value="system">System default</option>
            </select>
          </Field>

          {/* =================================================
              CORNER RADIUS
          ================================================== */}

          <Field label="Corner radius" icon={Square}>
            <div className="flex items-center gap-3">
              <select
                id="branding-radius"
                value={branding.radius}
                onChange={(e) =>
                  update("radius", e.target.value as Branding["radius"])
                }
                className="flex-1 bg-ink border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-cloud outline-none transition-colors focus:border-amber hover:border-white/20"
              >
                <option value="sharp">Sharp</option>
                <option value="soft">Soft</option>
                <option value="round">Round</option>
              </select>

              <div
                className="h-11 w-11 shrink-0 border border-white/15 bg-white/5 transition-all duration-300"
                style={{ borderRadius: getRadiusPreview(branding.radius) }}
                aria-hidden
              />
            </div>
          </Field>

          {/* =================================================
              THEME
          ================================================== */}

          <Field
            label="Theme"
            icon={branding.theme === "dark" ? Moon : Sun}
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => update("theme", "dark")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  branding.theme === "dark"
                    ? "border-amber/50 bg-amber/10 text-amber"
                    : "border-white/10 text-slate hover:border-white/20"
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
                Dark
              </button>
              <button
                type="button"
                onClick={() => update("theme", "light")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  branding.theme === "light"
                    ? "border-amber/50 bg-amber/10 text-amber"
                    : "border-white/10 text-slate hover:border-white/20"
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                Light
              </button>
            </div>
          </Field>

          {/* =================================================
              LOGO URL
          ================================================== */}

          <div className="sm:col-span-2">
            <Field label="Logo URL" icon={ImageIcon}>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    label=""
                    placeholder="https://example.com/logo.png"
                    value={branding.logoUrl || ""}
                    onChange={(e) =>
                      update("logoUrl", e.target.value.trim() || null)
                    }
                  />
                </div>

                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-white/5 text-[10px] text-slate"
                  style={{ borderRadius: getRadius(branding.radius) }}
                >
                  {branding.logoUrl ? (
                    <img
                      src={branding.logoUrl}
                      alt="Logo preview"
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    "Logo"
                  )}
                </div>
              </div>
            </Field>

            <p className="text-[11px] text-slate mt-2">
              Enter a publicly accessible image URL for your custom logo.
              Falls back to your initial if left blank.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* =====================================================
          LIVE PREVIEW
      ====================================================== */}

      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate">
              Live preview
            </h3>

            <p className="text-xs text-slate mt-1">
              Changes appear here immediately before you save.
            </p>
          </div>

          <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Real-time
          </span>
        </div>

        <div className="relative rounded-2xl p-8 min-h-[300px] flex items-center justify-center overflow-hidden border border-white/10 bg-black/10">
          {/* Ambient glow accent behind the card */}
          <div
            className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl transition-colors duration-300"
            style={{ background: branding.primaryColor + "22" }}
            aria-hidden
          />

          {/* =================================================
              PREVIEW CARD
          ================================================== */}

          <div
            className="relative w-full max-w-[360px] overflow-hidden shadow-2xl transition-all duration-300"
            style={{
              background: preview.card,
              color: preview.text,
              borderRadius: getRadius(branding.radius),
              fontFamily: getFont(branding.font),
              border: "1px solid " + preview.border,
            }}
          >
            {/* =================================================
                PREVIEW HEADER
            ================================================== */}

            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid " + preview.border }}
            >
              <div className="flex items-center gap-3">
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt="Brand logo"
                    className="w-10 h-10 object-contain rounded-lg"
                    style={{ background: branding.primaryColor + "15" }}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 flex items-center justify-center font-bold text-sm"
                    style={{
                      background: branding.primaryColor,
                      color: "#111827",
                      borderRadius: getRadius(branding.radius),
                    }}
                  >
                    W
                  </div>
                )}

                <div>
                  <div
                    className="text-base font-bold leading-tight"
                    style={{ fontFamily: getFont(branding.font) }}
                  >
                    WeatherSphere Pro
                  </div>

                  <div
                    className="text-[10px] mt-0.5"
                    style={{
                      color: preview.muted,
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    Weather dashboard
                  </div>
                </div>
              </div>

              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: branding.primaryColor }}
              />
            </div>

            {/* =================================================
                WEATHER PREVIEW
            ================================================== */}

            <div className="p-5">
              <div
                className="flex items-center gap-1.5 text-xs mb-3"
                style={{
                  color: preview.muted,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                <MapPin className="h-3 w-3" />
                Kolkata, India
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-end gap-1">
                  <span
                    className="text-5xl font-bold tracking-tight"
                    style={{ fontFamily: getFont(branding.font) }}
                  >
                    26
                  </span>

                  <span
                    className="text-lg mb-1"
                    style={{ color: branding.primaryColor }}
                  >
                    °C
                  </span>
                </div>

                <CloudSun
                  className="h-11 w-11 mb-1"
                  style={{ color: branding.primaryColor }}
                  strokeWidth={1.5}
                />
              </div>

              <div
                className="text-xs mt-1"
                style={{
                  color: preview.muted,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                Partly cloudy
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5">
                {[
                  { label: "Humidity", value: "82%", Icon: Droplets },
                  { label: "Wind", value: "12 km/h", Icon: Wind },
                  { label: "Feels", value: "29°C", Icon: Thermometer },
                ].map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className="p-3 transition-colors duration-300"
                    style={{
                      background: branding.primaryColor + "12",
                      borderRadius: getRadius(branding.radius),
                    }}
                  >
                    <Icon
                      className="h-3 w-3 mb-1.5"
                      style={{ color: branding.primaryColor }}
                    />

                    <div
                      className="text-[10px]"
                      style={{ color: preview.muted }}
                    >
                      {label}
                    </div>

                    <div
                      className="text-sm font-semibold mt-0.5"
                      style={{ color: branding.primaryColor }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                PREVIEW FOOTER
            ================================================== */}

            <div
              className="px-5 py-3 text-[10px] flex items-center justify-between"
              style={{
                borderTop: "1px solid " + preview.border,
                color: preview.muted,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              <span>Powered by WeatherSphere Pro</span>
              <span style={{ color: branding.primaryColor }}>●</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* =====================================================
          SAVE AREA
      ====================================================== */}

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <Button onClick={save} loading={saving} disabled={!isDirty && !saving}>
          {saving ? "Saving..." : "Save branding"}
        </Button>

        {isDirty && !saving && !saved && (
          <span className="text-xs text-slate">
            You have unsaved changes.
          </span>
        )}

        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            Branding saved successfully.
          </span>
        )}

        {error && (
          <span className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </span>
        )}
      </div>
    </div>
  );
}