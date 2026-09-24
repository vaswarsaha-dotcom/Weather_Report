"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/Card";

const quotes = [
  {
    name: "Priya Nair",
    role: "Founder, FieldCrew Ops",
    quote:
      "We embedded the widget in our logistics dashboard in an afternoon. Drivers get rain alerts before they leave the depot now."
  },
  {
    name: "Marcus Webb",
    role: "Product Lead, Harborline",
    quote:
      "The white-label branding meant our marina-booking clients never knew it wasn't built in-house. That mattered a lot to us."
  },
  {
    name: "Sana Iqbal",
    role: "Agency Owner, Iqbal Digital",
    quote:
      "I resell this to three clients now under their own branding. The historical charts alone justified the upgrade for two of them."
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-16 bg-dusk px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-widest text-amber">Trusted by teams</p>
          <h2 className="font-display text-4xl font-medium text-cloud sm:text-5xl">
            Shipping under their own name.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="flex h-full flex-col justify-between p-6">
                <p className="font-display text-lg italic leading-relaxed text-cloud">“{q.quote}”</p>
                <div className="mt-6">
                  <p className="text-sm font-medium text-cloud">{q.name}</p>
                  <p className="text-xs text-slate">{q.role}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
