"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, CloudSun } from "lucide-react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Customers" },
  { href: "#faq", label: "FAQ" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-cloud">
          <CloudSun className="h-6 w-6 text-amber" aria-hidden="true" />
          WeatherSphere <span className="text-amber">Pro</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-slate transition hover:text-cloud">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm text-slate hover:text-cloud">
            Log in
          </Link>
          <Link href="/signup">
            <Button size="sm">Start free</Button>
          </Link>
        </div>

        <button
          className="md:hidden text-cloud"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-slate hover:text-cloud" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <Link href="/login" className="text-slate hover:text-cloud">
              Log in
            </Link>
            <Link href="/signup">
              <Button className="w-full">Start free</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
