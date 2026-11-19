import type { ButtonHTMLAttributes } from "react";

type Variant = "solid" | "outline" | "ghost";

export const buttonClassName = (variant: Variant = "outline", extra = "") => {
  const base =
    "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const variants: Record<Variant, string> = {
    solid: "bg-foreground text-background hover:bg-white/80",
    outline: "border border-line-strong text-foreground hover:bg-white hover:text-black",
    ghost: "text-foreground hover:bg-white/10",
  };
  return `${base} ${variants[variant]} ${extra}`.trim();
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "outline", className, ...props }: ButtonProps) {
  return <button className={buttonClassName(variant, className)} {...props} />;
}
