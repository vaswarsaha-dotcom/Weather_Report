// app/layout.tsx
import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
// @ts-ignore
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "WeatherSphere Pro",
  description: "White-label weather intelligence — live forecasts, alerts, and an embeddable widget.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${fraunces.variable} ${inter.variable} ${mono.variable} font-body bg-ink text-cloud antialiased`}>
        {children}
      </body>
    </html>
  );
}