"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

type MobileMenuProps = {
  children: ReactNode;
};

// Бургер-меню для телефона й планшета. Вміст рендериться сервером і лише ховається.
export function MobileMenu({ children }: MobileMenuProps) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={t("menu")}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-line-strong"
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
      <div
        id="mobile-menu"
        hidden={!open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a, button")) setOpen(false);
        }}
        className="absolute inset-x-0 top-full flex flex-col gap-4 border-b border-line bg-black px-4 py-4 sm:px-6"
      >
        {children}
      </div>
    </div>
  );
}
