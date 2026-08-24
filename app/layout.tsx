import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"]
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://weathersphere.pro";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "WeatherSphere Pro — White-label weather intelligence",
    template: "%s · WeatherSphere Pro"
  },
  description:
    "Live forecasts, historical trends, smart alerts, and an embeddable weather widget — built for teams who want their own branded weather product.",
  keywords: ["weather saas", "weather widget", "white label weather", "weather api dashboard"],
  openGraph: {
    title: "WeatherSphere Pro",
    description: "White-label weather intelligence for products and teams.",
    url: appUrl,
    siteName: "WeatherSphere Pro",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "WeatherSphere Pro",
    description: "White-label weather intelligence for products and teams."
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body bg-ink text-cloud antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
