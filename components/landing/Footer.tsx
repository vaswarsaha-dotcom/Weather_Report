import Link from "next/link";
import { CloudSun } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-cloud">
              <CloudSun className="h-6 w-6 text-amber" aria-hidden="true" />
              WeatherSphere Pro
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate">
              White-label weather intelligence for products, agencies, and internal tools.
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={[
              { href: "#features", label: "Features" },
              { href: "#pricing", label: "Pricing" },
              { href: "/dashboard", label: "Dashboard" }
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { href: "#testimonials", label: "Customers" },
              { href: "#faq", label: "FAQ" },
              { href: "/signup", label: "Get started" }
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { href: "#", label: "Privacy policy" },
              { href: "#", label: "Terms of service" }
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-slate/70 md:flex-row">
          <p>© {new Date().getFullYear()} WeatherSphere Pro. All rights reserved.</p>
          <p>Weather data via Open-Meteo &amp; OpenWeatherMap.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-sm font-medium text-cloud">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-sm text-slate transition hover:text-cloud">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
