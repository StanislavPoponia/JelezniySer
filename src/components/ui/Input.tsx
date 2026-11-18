import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <input
        id={inputId}
        className={`rounded-md border border-line bg-black px-3 py-2.5 text-base text-foreground placeholder:text-muted/60 focus:border-foreground focus:outline-none ${className ?? ""}`}
        {...props}
      />
    </label>
  );
}
