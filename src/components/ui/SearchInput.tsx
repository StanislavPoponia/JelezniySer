"use client";

import { useRef } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  clearLabel: string;
};

// Поле миттєвого пошуку товарів з кнопкою очищення.
export function SearchInput({ value, onChange, label, placeholder, clearLabel }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div role="search" className="relative min-w-0 flex-1">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        className="h-13 w-full rounded-md border border-line bg-black px-12 text-base text-foreground placeholder:text-muted/60 focus:border-foreground focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label={clearLabel}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-2xl leading-none text-muted hover:text-foreground"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}
