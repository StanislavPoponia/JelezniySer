"use client";

import { useState, type FormEvent } from "react";

type SearchInputProps = {
  label: string;
  placeholder: string;
  buttonLabel: string;
};

// Поле пошуку товарів. Логіка пошуку по даних з'явиться разом із каталогом.
export function SearchInput({ label, placeholder, buttonLabel }: SearchInputProps) {
  const [query, setQuery] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit} role="search" className="flex w-full gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={label}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-md border border-line bg-black px-4 py-3 text-base text-foreground placeholder:text-muted/60 focus:border-foreground focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md border border-line-strong px-5 py-3 text-sm font-semibold hover:bg-white hover:text-black"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
