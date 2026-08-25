import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_8px_20px_rgb(44_185_164_/_0.28)] hover:bg-accent-hover hover:-translate-y-px hover:shadow-[0_12px_24px_rgb(44_185_164_/_0.34)] active:translate-y-0 active:shadow-[0_4px_12px_rgb(44_185_164_/_0.2)] disabled:translate-y-0 disabled:bg-accent/40 disabled:shadow-none",
  secondary:
    "glass-control text-ink hover:bg-white/70 hover:-translate-y-px hover:shadow-[0_8px_20px_rgb(22_72_66_/_0.08)] active:translate-y-0 disabled:opacity-50",
  ghost:
    "text-muted hover:bg-white/35 hover:text-ink disabled:opacity-50",
  danger:
    "text-match-red hover:bg-[rgb(220_120_110_/_0.14)] disabled:opacity-50",
};

export function buttonClassName(variant: Variant = "primary", className?: string) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgb(44_185_164_/_0.18)] disabled:cursor-not-allowed",
    variants[variant],
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  type = "submit",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, className)}
      {...props}
    />
  );
}
