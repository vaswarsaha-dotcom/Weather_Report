// components/ui/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: "bg-amber text-ink hover:bg-amber-soft shadow-glass",
  secondary: "bg-dusk2 text-cloud border border-white/10 hover:border-amber/50",
  ghost: "bg-transparent text-slate hover:text-cloud hover:bg-white/5",
  danger: "bg-red-500/90 text-white hover:bg-red-500",
};
const sizeStyles: Record<string, string> = {
  sm: "text-xs px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-xl",
  lg: "text-base px-6 py-3 rounded-xl2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        "font-body font-medium transition-all duration-150 inline-flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant], sizeStyles[size], className
      )}
      {...props}
    >
      {loading && <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";