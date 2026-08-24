import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-amber text-ink hover:bg-amber-soft shadow-[0_0_0_1px_rgba(245,166,35,0.4)] hover:shadow-[0_0_24px_rgba(245,166,35,0.35)]",
  secondary: "bg-cyan text-ink hover:bg-cyan-soft",
  outline: "border border-white/20 text-cloud hover:border-white/40 hover:bg-white/5",
  ghost: "text-cloud hover:bg-white/5"
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3.5 py-1.5 rounded-full",
  md: "text-sm px-5 py-2.5 rounded-full",
  lg: "text-base px-7 py-3.5 rounded-full"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
