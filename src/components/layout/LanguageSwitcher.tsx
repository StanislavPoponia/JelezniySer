"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { MotoWheel } from "@/components/ui/MotoWheel";
import { setLanguagePin, useLanguagePin } from "./languagePin";

const LABELS: Record<Locale, string> = { uk: "UA", en: "EN" };

// Скільки колесо їде до іншої мови (має збігатися з duration-600 нижче).
const RIDE_MS = 600;

// Овальний перемикач мови. Наведення на перемикач показує мотокросне колесо на поточній мові;
// клік по іншій мові — колесо переїжджає на неї, і лише тоді мова змінюється.
export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Locale | null>(null);
  const [hovered, setHovered] = useState(false);
  const pinned = useLanguagePin();

  // Переїзд завершено й мова вже змінилась — скидаємо ціль.
  if (target !== null && target === locale) setTarget(null);

  const riding = target !== null && target !== locale;
  const wheelLocale = riding ? target : locale;
  const wheelIndex = routing.locales.indexOf(wheelLocale);
  const wheelVisible = riding || hovered || pinned;

  // Колесо їде — після прибуття перемикаємо мову.
  useEffect(() => {
    if (!riding) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => router.replace(pathname, { locale: target, scroll: false }),
      reducedMotion ? 0 : RIDE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [riding, target, pathname, router]);

  // Фіксацію знімає лише клієнт: миша пішла з перемикача або натискання деінде.
  useEffect(() => {
    if (!pinned) return;
    const outside = (event: Event) => !rootRef.current?.contains(event.target as Node);
    const release = () => {
      setHovered(false);
      setLanguagePin(false);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (outside(event)) release();
      else setHovered(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (outside(event)) release();
    };
    // Миша вийшла за межі вікна.
    const onPointerOut = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.relatedTarget === null && outside(event)) release();
    };
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerout", onPointerOut);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, [pinned]);

  return (
    // Зовнішній блок тримає місце повного розміру, тому сусіди не зсуваються, коли кнопка росте.
    <div className="flex h-10 w-19 shrink-0 items-center justify-center transition-[width,height] duration-300 group-data-[scrolled=true]:h-8 group-data-[scrolled=true]:w-15">
      <div
        ref={rootRef}
        role="group"
        aria-label={t("language")}
        /* Наведення — тільки мишею: на сенсорному екрані колесо зʼявляється після вибору мови. */
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        /* Ширина = 2 × внутрішня висота + рамка: кожна мова має квадратне місце,
           тому заокруглення краю йде паралельно колу колеса.
           У спокої кнопка менша, з колесом — повного розміру; у зменшеному хедері обидва розміри ще менші. */
        className={`relative flex shrink-0 rounded-full border-2 border-line-strong font-semibold transition-[width,height,font-size] duration-300 motion-reduce:transition-none ${
          wheelVisible
            ? "h-10 w-19 text-xs group-data-[scrolled=true]:h-8 group-data-[scrolled=true]:w-15 group-data-[scrolled=true]:text-[10px]"
            : "h-8 w-15 text-[10px] group-data-[scrolled=true]:h-6 group-data-[scrolled=true]:w-11 group-data-[scrolled=true]:text-[9px]"
        }`}
      >
        {routing.locales.map((code) => {
          const active = code === locale;
          const covered = wheelVisible && code === wheelLocale;
          return (
            <button
              key={code}
              type="button"
              aria-pressed={active}
              onClick={() => {
                if (active || riding) return;
                setLanguagePin(true);
                setTarget(code);
              }}
              className={`flex-1 rounded-full transition-colors ${
                active ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              <span className={`transition-opacity duration-300 ${covered ? "opacity-0" : "opacity-100"}`}>
                {LABELS[code]}
              </span>
            </button>
          );
        })}

        {/* Три шари: переїзд убік, перекочування під час переїзду та постійне обертання. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 flex w-1/2 items-center justify-center transition-[translate,opacity] duration-600 ease-in-out motion-reduce:transition-none ${
            wheelVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ translate: `${wheelIndex * 100}% 0` }}
        >
          <span
            className="flex aspect-square h-[calc(100%-4px)] transition-[rotate] duration-600 ease-in-out motion-reduce:transition-none"
            style={{ rotate: `${wheelIndex * 720}deg` }}
          >
            {/* На UA колесо крутиться вправо, на EN — вліво (reverse). */}
            <MotoWheel
              className={`h-full w-full animate-[spin_2.8s_linear_infinite] motion-reduce:animate-none ${
                wheelIndex > 0 ? "[animation-direction:reverse]" : ""
              }`}
            />
          </span>
        </span>
      </div>
    </div>
  );
}
