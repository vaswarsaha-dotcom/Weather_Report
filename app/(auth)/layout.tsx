import Link from "next/link";
import { CloudSun } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 py-16">
      <div className="absolute inset-0 bg-isobar-glow" aria-hidden="true" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold text-cloud">
          <CloudSun className="h-6 w-6 text-amber" aria-hidden="true" />
          WeatherSphere <span className="text-amber">Pro</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
