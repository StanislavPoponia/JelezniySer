"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

type MobileMenuProps = {
  children: ReactNode;
};

// Бургер-меню для телефона й планшета. Вміст рендериться сервером і лише ховається.
export function MobileMenu({ children }: MobileMenuProps) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Натискання будь-де поза меню та кнопкою бургера закриває меню.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={t("menu")}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-line-strong transition-[width,height] duration-300 group-data-[scrolled=true]:h-8 group-data-[scrolled=true]:w-8"
      >
        <span className="relative block h-3.5 w-5">
          <span
            className={`absolute left-0 h-0.5 w-5 bg-foreground transition-all ${
              open ? "top-1.5 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 h-0.5 w-5 bg-foreground transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 h-0.5 w-5 bg-foreground transition-all ${
              open ? "top-1.5 -rotate-45" : "top-3"
            }`}
          />
        </span>
      </button>
      {/* Завжди в DOM, щоб плавно відкриватись і закриватись; закрите меню invisible, тому недоступне. */}
      <div
        id="mobile-menu"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a, button")) setOpen(false);
        }}
        className={`absolute inset-x-0 top-full flex flex-col gap-4 border-b border-line bg-black px-4 py-4 transition-[clip-path,opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none sm:px-6 ${
          open
            ? "visible translate-y-0 opacity-100 [clip-path:inset(0_0_0_0)]"
            : "invisible pointer-events-none -translate-y-2 opacity-0 [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
