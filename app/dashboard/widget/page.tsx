"use client";

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import {
  MapPin,
  Moon,
  Sun,
  Code2,
  Copy,
  Check,
  CloudSun,
  Droplets,
  Wind,
  Monitor,
  ClipboardPaste,
  Settings2,
} from "lucide-react";

type Theme = "dark" | "light";

interface WeatherData {
  location?: {
    name?: string;
    country?: string;
  };

  current?: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
  };
}

/* =========================================================
   PREVIEW WIDGET
========================================================= */

function PreviewWidget({
  lat,
  lon,
  theme,
}: {
  lat: string;
  lon: string;
  theme: Theme;
}) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const url = useMemo(() => {
    const params = new URLSearchParams();

    params.set("lat", lat);
    params.set("lon", lon);
    params.set("name", "Kolkata");
    params.set("country", "India");
    params.set("timezone", "auto");

    return `/api/weather?${params.toString()}`;
  }, [lat, lon]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(false);
    setData(null);

    fetch(url, {
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Weather request failed");
        }

        return response.json();
      })
      .then((result) => {
        if (cancelled) return;

        setData(result);
      })
      .catch(() => {
        if (cancelled) return;

        setError(true);
      })
      .finally(() => {
        if (cancelled) return;

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  const isDark = theme === "dark";

  const bg = isDark ? "#11182D" : "#FFFFFF";
  const fg = isDark ? "#F5F7FB" : "#111827";
  const sub = isDark ? "#8793AF" : "#64748B";
  const border = isDark
    ? "rgba(255,255,255,0.09)"
    : "rgba(15,23,42,0.10)";

  const brand = "#F5B942";

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        style={{
          width: 270,
          borderRadius: 18,
          padding: 20,
          background: bg,
          border: `1px solid ${border}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          fontFamily: "Arial, Helvetica, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center gap-2" style={{ fontSize: 13, color: sub }}>
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{ color: brand }}
          />
          Loading weather...
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !data?.current) {
    return (
      <div
        style={{
          width: 270,
          borderRadius: 18,
          padding: 20,
          background: bg,
          border: `1px solid ${border}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          fontFamily: "Arial, Helvetica, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#F87171",
          }}
        >
          Forecast unavailable
        </div>
      </div>
    );
  }

  const current = data.current;

  const locationName = data.location?.name || `${lat}, ${lon}`;
  const country = data.location?.country || "";

  /* =======================================================
     WIDGET
  ======================================================= */

  return (
    <div
      style={{
        width: 270,
        borderRadius: 18,
        padding: 18,
        background: bg,
        color: fg,
        border: `1px solid ${border}`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        fontFamily: "Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* =================================================
          BRAND HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 17,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              background: brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            W
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>
              WeatherSphere
            </div>

            <div style={{ fontSize: 9, color: sub, marginTop: 2 }}>
              Weather Widget
            </div>
          </div>
        </div>

        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#35D07F",
          }}
        />
      </div>

      {/* =================================================
          LOCATION
      ================================================= */}

      <div style={{ fontSize: 12, color: sub, marginBottom: 4 }}>
        {locationName}
        {country ? `, ${country}` : ""}
      </div>

      {/* =================================================
          TEMPERATURE
      ================================================= */}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
          <span style={{ fontSize: 42, lineHeight: 1, fontWeight: 700, letterSpacing: "-2px" }}>
            {Math.round(current.temperature)}
          </span>

          <span style={{ fontSize: 18, fontWeight: 600, marginTop: 3 }}>°C</span>
        </div>

        <CloudSun size={34} strokeWidth={1.5} color={brand} style={{ marginTop: 4 }} />
      </div>

      {/* =================================================
          FEELS LIKE
      ================================================= */}

      <div style={{ color: sub, fontSize: 11, marginTop: 7 }}>
        Feels like {Math.round(current.feelsLike)}°C
      </div>

      {/* =================================================
          DETAILS
      ================================================= */}

      <div style={{ display: "flex", gap: 18, marginTop: 16, fontSize: 11, color: sub }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Droplets size={12} color={brand} />
          {Math.round(current.humidity)}%
        </span>

        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Wind size={12} color={brand} />
          {Math.round(current.windSpeed)} km/h
        </span>
      </div>

      {/* =================================================
          FOOTER BRANDING
      ================================================= */}

      <div
        style={{
          marginTop: 17,
          paddingTop: 11,
          borderTop: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 9, color: sub }}>Live weather</span>
        <span style={{ fontSize: 10, color: brand, fontWeight: 700 }}>WeatherSphere</span>
      </div>
    </div>
  );
}

/* =========================================================
   CODE SNIPPET (lightweight syntax highlighting)
========================================================= */

function CodeLine({ children }: { children: React.ReactNode }) {
  return <div className="leading-6">{children}</div>;
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="text-sky-400">{children}</span>;
}

function Attr({ children }: { children: React.ReactNode }) {
  return <span className="text-amber-300">{children}</span>;
}

function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-emerald-400">{children}</span>;
}

function Punc({ children }: { children: React.ReactNode }) {
  return <span className="text-slate-500">{children}</span>;
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function WidgetBuilderPage() {
  const [lat, setLat] = useState("22.5726");
  const [lon, setLon] = useState("88.3639");
  const [theme, setTheme] = useState<Theme>("dark");
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [highlightConfigure, setHighlightConfigure] = useState(false);
  const [showPasteHint, setShowPasteHint] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const scriptUrl = origin
    ? `${origin}/weather-widget.js`
    : "/weather-widget.js";

  const snippet = [
    '<div id="weathersphere-widget"></div>',
    "",
    "<script",
    `  src="${scriptUrl}?v=3"`,
    `  data-lat="${lat}"`,
    `  data-lon="${lon}"`,
    `  data-theme="${theme}"`,
    "  async",
    "></script>",
  ].join("\n");

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}

      <div>
        <h1 className="font-display text-xl font-bold text-cloud">
          Embeddable Widget
        </h1>

        <p className="text-sm text-slate mt-1">
          Create a branded WeatherSphere widget for any website.
        </p>
      </div>

      {/* STEPS */}

      <div className="grid sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            document
              .getElementById("widget-configure")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
            setHighlightConfigure(true);
            setTimeout(() => setHighlightConfigure(false), 1200);
          }}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-amber/40 hover:bg-white/[0.06]"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber/15 text-xs font-bold text-amber">
            1
          </div>
          <div className="flex items-center gap-1.5 text-sm text-cloud">
            <Settings2 className="h-3.5 w-3.5 text-slate" />
            Configure
          </div>
        </button>

        <button
          type="button"
          onClick={copySnippet}
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
            copied
              ? "border-emerald-400/40 bg-emerald-400/10"
              : "border-white/10 bg-white/[0.03] hover:border-amber/40 hover:bg-white/[0.06]"
          }`}
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              copied ? "bg-emerald-400/20 text-emerald-400" : "bg-amber/15 text-amber"
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : "2"}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-cloud">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate" />}
            {copied ? "Copied!" : "Copy the code"}
          </div>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowPasteHint(true);
              setTimeout(() => setShowPasteHint(false), 3000);
            }}
            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
              showPasteHint
                ? "border-amber/40 bg-amber/10"
                : "border-white/10 bg-white/[0.03] hover:border-amber/40 hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber/15 text-xs font-bold text-amber">
              3
            </div>
            <div className="flex items-center gap-1.5 text-sm text-cloud">
              <ClipboardPaste className="h-3.5 w-3.5 text-slate" />
              Paste it on your site
            </div>
          </button>

          {showPasteHint && (
            <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-xl border border-amber/30 bg-ink px-3.5 py-2.5 text-xs text-slate shadow-xl">
              Copy the code from step 2, then paste it into your website&apos;s
              HTML wherever you want the widget to appear.
            </div>
          )}
        </div>
      </div>

      {/* CARD */}

      <GlassCard>
        {/* SETTINGS */}

        <div
          id="widget-configure"
          className={`mb-6 scroll-mt-24 rounded-2xl transition-all duration-500 ${
            highlightConfigure
              ? "ring-2 ring-amber/60 ring-offset-2 ring-offset-transparent"
              : "ring-2 ring-transparent"
          }`}
        >
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cloud mb-4">
            Configure
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* LATITUDE */}

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate">
                <MapPin className="h-3 w-3" />
                Latitude
              </label>
              <Input label="" value={lat} onChange={(e) => setLat(e.target.value)} />
            </div>

            {/* LONGITUDE */}

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate">
                <MapPin className="h-3 w-3" />
                Longitude
              </label>
              <Input label="" value={lon} onChange={(e) => setLon(e.target.value)} />
            </div>

            {/* THEME */}

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate">
                {theme === "dark" ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                Theme
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "border-amber/50 bg-amber/10 text-amber"
                      : "border-white/10 text-slate hover:border-white/20"
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    theme === "light"
                      ? "border-amber/50 bg-amber/10 text-amber"
                      : "border-white/10 text-slate hover:border-white/20"
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Light
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CODE + PREVIEW */}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* EMBED CODE */}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate">
                <Code2 className="h-3 w-3" />
                Embed code
              </label>

              <button
                type="button"
                onClick={copySnippet}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  copied
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                    : "border-white/10 text-cloud hover:bg-white/5"
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-ink overflow-hidden">
              {/* editor title bar */}
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.02] px-3.5 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-2 text-[10px] text-slate">embed.html</span>
              </div>

              <pre className="p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                <CodeLine>
                  <Punc>&lt;</Punc>
                  <Tag>div</Tag> <Attr>id</Attr>
                  <Punc>=</Punc>
                  <Str>&quot;weathersphere-widget&quot;</Str>
                  <Punc>&gt;&lt;/</Punc>
                  <Tag>div</Tag>
                  <Punc>&gt;</Punc>
                </CodeLine>
                <CodeLine>&nbsp;</CodeLine>
                <CodeLine>
                  <Punc>&lt;</Punc>
                  <Tag>script</Tag>
                </CodeLine>
                <CodeLine>
                  &nbsp;&nbsp;<Attr>src</Attr>
                  <Punc>=</Punc>
                  <Str>&quot;{scriptUrl}?v=3&quot;</Str>
                </CodeLine>
                <CodeLine>
                  &nbsp;&nbsp;<Attr>data-lat</Attr>
                  <Punc>=</Punc>
                  <Str>&quot;{lat}&quot;</Str>
                </CodeLine>
                <CodeLine>
                  &nbsp;&nbsp;<Attr>data-lon</Attr>
                  <Punc>=</Punc>
                  <Str>&quot;{lon}&quot;</Str>
                </CodeLine>
                <CodeLine>
                  &nbsp;&nbsp;<Attr>data-theme</Attr>
                  <Punc>=</Punc>
                  <Str>&quot;{theme}&quot;</Str>
                </CodeLine>
                <CodeLine>
                  &nbsp;&nbsp;<Attr>async</Attr>
                </CodeLine>
                <CodeLine>
                  <Punc>&gt;&lt;/</Punc>
                  <Tag>script</Tag>
                  <Punc>&gt;</Punc>
                </CodeLine>
              </pre>
            </div>

            <p className="text-[11px] text-slate mt-2">
              Paste this code into your website where you want the
              WeatherSphere widget to appear.
            </p>
          </div>

          {/* PREVIEW */}

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate mb-2">
              <Monitor className="h-3 w-3" />
              Live preview
            </label>

            <div className="rounded-xl border border-white/10 bg-black/10 overflow-hidden">
              {/* mock browser bar */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-3.5 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-2 flex-1 truncate rounded-md bg-white/5 px-2.5 py-0.5 text-[10px] text-slate">
                  your-website.com
                </span>
              </div>

              <div className="min-h-[310px] flex items-center justify-center p-6">
                <PreviewWidget lat={lat} lon={lon} theme={theme} />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}