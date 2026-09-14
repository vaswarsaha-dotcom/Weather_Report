// components/ui/Input.tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; }

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={inputId} className="text-xs font-medium text-slate">{label}</label>}
        <input
          ref={ref} id={inputId}
          className={clsx(
            "bg-ink border rounded-xl px-3.5 py-2.5 text-sm text-cloud placeholder:text-slate-dim",
            "outline-none transition-colors",
            error ? "border-red-500" : "border-white/10 focus:border-amber", className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";