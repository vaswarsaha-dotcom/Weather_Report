"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/ui/Card";

const faqs = [
  {
    q: "Where does the weather data come from?",
    a: "Open-Meteo is the primary provider — no API key required, generous free tier. OpenWeatherMap can be configured as an automatic fallback if you supply a key."
  },
  {
    q: "Can I really white-label the whole dashboard?",
    a: "Yes. Logo, brand color, font, border radius, and light/dark theme are all stored per account and applied across the dashboard and the embeddable widget."
  },
  {
    q: "How does the embeddable widget work?",
    a: "The Widget Builder generates a single script tag. Drop it into any site and it renders a themed, responsive weather widget pulling live data for the configured city."
  },
  {
    q: "How often does data refresh?",
    a: "The dashboard polls every 5 minutes automatically, and API responses are cached server-side so repeated requests for the same location don't hit the provider unnecessarily."
  },
  {
    q: "Is there an API I can build on?",
    a: "Yes — lib/weather.ts, lib/geocode.ts, and lib/summary.ts are exposed through documented route handlers you can call directly from your own services."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-16 bg-dusk px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs uppercase tracking-widest text-amber">Questions</p>
          <h2 className="font-display text-4xl font-medium text-cloud sm:text-5xl">Frequently asked</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <GlassCard key={item.q} className="overflow-hidden">
                <button
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span className="font-medium text-cloud">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-slate">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
