"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MotoWheel } from "@/components/ui/MotoWheel";

type CategoryFilterProps = {
  categories: { key: string; label: string }[];
  selected: string[];
  onToggle: (key: string) => void;
  onReset: () => void;
};

const iconTransition = "transition duration-200 motion-reduce:transition-none";

// Кнопка «Фільтр» зі списком категорій: можна вибрати кілька одразу.
export function CategoryFilter({ categories, selected, onToggle, onReset }: CategoryFilterProps) {
  const t = useTranslations("shop");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Закриваємо список при натисканні поза ним або по Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex-none">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("filter")}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-13 items-center gap-2 rounded-md border bg-black px-3.5 font-semibold transition-colors hover:border-foreground max-[359px]:gap-1 max-[359px]:px-2.5 ${
          selected.length > 0 ? "border-foreground" : "border-line"
        }`}
      >
        {/* Поки список відкритий, замість значка фільтра — колесо мотоцикла. */}
        <span aria-hidden="true" className="grid h-5 w-5 flex-none *:[grid-area:1/1]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`h-5 w-5 ${iconTransition} ${open ? "opacity-0" : "opacity-100"}`}
          >
            <path d="M4 7h16M7 12h10M10 17h4" />
          </svg>
          <MotoWheel
            className={`h-5 w-5 ${iconTransition} ${
              open ? "rotate-30 scale-150 opacity-100" : "scale-50 opacity-0"
            }`}
          />
        </span>
        <span className="max-[359px]:hidden">{t("filter")}</span>
        {selected.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-xs text-background">
            {selected.length}
          </span>
        )}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`h-4 w-4 max-[359px]:hidden ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="group"
          aria-label={t("categories")}
          className="absolute left-0 top-[calc(100%+6px)] z-20 flex max-h-[60vh] w-max min-w-56 max-w-[min(20rem,calc(100vw-2rem))] flex-col gap-0.5 overflow-y-auto rounded-md border border-line-strong bg-black p-1.5"
        >
          {categories.map(({ key, label }) => {
            const on = selected.includes(key);
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(key)}
                className={`group/option flex min-h-11 w-full flex-none items-center gap-3 rounded px-2.5 text-left hover:bg-white/10 ${
                  on ? "font-semibold text-foreground" : "text-muted"
                }`}
              >
                {/* Колесо: з'являється при наведенні, біля вибраної категорії видно завжди. */}
                <MotoWheel
                  className={`h-5 w-5 flex-none text-foreground ${iconTransition} group-hover/option:rotate-30 group-hover/option:scale-125 group-hover/option:opacity-100 group-focus-visible/option:rotate-30 group-focus-visible/option:scale-125 group-focus-visible/option:opacity-100 ${
                    on ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                />
                <span>{label}</span>
              </button>
            );
          })}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="mt-1 min-h-10 flex-none border-t border-line text-sm text-muted hover:text-foreground"
            >
              {t("resetFilter")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
