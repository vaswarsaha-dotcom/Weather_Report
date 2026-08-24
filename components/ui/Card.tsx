import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function GlassCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl2 border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-glass shadow-glass-inset",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
