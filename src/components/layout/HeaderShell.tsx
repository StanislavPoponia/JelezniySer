"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLanguagePin } from "./languagePin";

// Хедер завжди видимий: при прокрутці вниз стає компактним, при наведенні повертається до повного розміру.
// Зовнішній блок тримає місце фіксованої висоти, тому контент сторінки не стрибає при зміні розміру.
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const languagePinned = useLanguagePin();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="h-20">
      <header
        data-scrolled={scrolled && !hovered && !languagePinned}
        /* Тільки миша: на телефоні й планшеті дотик не повинен залишати хедер великим. */
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setHovered(true);
        }}
        /* Після зміни мови хедер створюється заново під курсором, тоді pointerenter може не спрацювати. */
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        className="group fixed inset-x-0 top-0 z-40 border-b border-line bg-black"
      >
        {children}
      </header>
    </div>
  );
}
