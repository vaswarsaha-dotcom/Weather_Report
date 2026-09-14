// components/ui/GlassCard.tsx
import { type HTMLAttributes } from "react";
import clsx from "clsx";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> { padded?: boolean; }

export function GlassCard({ padded = true, className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={clsx(
        "bg-dusk2/60 backdrop-blur-xl border border-white/10 rounded-xl2",
        "shadow-glass shadow-glass-inset", padded && "p-5", className
      )}
      {...props}
    >
      {children}
    </div>
  );
}