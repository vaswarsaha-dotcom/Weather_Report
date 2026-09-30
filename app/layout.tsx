// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "WeatherSphere Pro",
  description:
    "White-label weather intelligence — live forecasts, alerts, and an embeddable widget.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0D1321",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className="font-body bg-ink text-cloud antialiased"
        style={
          {
            "--font-fraunces": "'Fraunces', Georgia, serif",
            "--font-inter":
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            "--font-mono":
              "'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}