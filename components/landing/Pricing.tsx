"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "forever",
    highlight: false,
    features: ["1 dashboard", "3 saved cities", "5-day forecast", "Community support"]
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    highlight: true,
    features: [
      "Unlimited cities",
      "Historical trends",
      "Smart alerts",
      "Embeddable widget",
      "Priority support"
    ]
  },
  {
    name: "White Label",
    price: "$99",
    cadence: "/ month",
    highlight: false,
    features: [
      "Everything in Pro",
      "Custom branding & domain",
      "Admin analytics panel",
      "Multiple team seats",
      "SLA support"
    ]
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-ink px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-widest text-cyan">Simple pricing</p>
          <h2 className="font-display text-4xl font-medium text-cloud sm:text-5xl">
            Start free. Scale when you're ready.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard
                className={cn(
                  "flex h-full flex-col p-8",
                  plan.highlight && "border-amber/40 bg-amber/[0.06] ring-1 ring-amber/30"
                )}
              >
                {plan.highlight && (
                  <span className="mb-4 w-fit rounded-full bg-amber px-3 py-1 text-xs font-medium text-ink">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl font-medium text-cloud">{plan.name}</h3>
                <p className="mt-4">
                  <span className="font-display text-4xl font-medium text-cloud">{plan.price}</span>
                  <span className="ml-1 text-sm text-slate">{plan.cadence}</span>
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate">
                      <Check className="h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="mt-8">
                  <Button variant={plan.highlight ? "primary" : "secondary"} className="w-full">
                    Choose {plan.name}
                  </Button>
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}