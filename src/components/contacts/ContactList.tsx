"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { contacts, emailLink, mapEmbedSrc, mapLink, schedule, telLink, viberLink } from "@/lib/contacts";

// Скільки пікселів треба прокрутити, щоб відкритий графік сам згорнувся.
const SCHEDULE_CLOSE_SCROLL_PX = 160;

const iconClass = "mt-0.5 h-5 w-5 shrink-0 text-muted";
const labelClass = "mb-1 block text-xs uppercase tracking-wide text-muted";
const linkClass =
  "inline-block py-0.5 text-foreground underline-offset-4 transition-colors hover:text-muted hover:underline";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Список контактів і карта для вікна «Контакти».
export function ContactList() {
  const t = useTranslations("contacts");
  const locale = useLocale();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);

  // Клік поза блоком графіка або помітна прокрутка згортає його.
  useEffect(() => {
    if (!scheduleOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!scheduleRef.current?.contains(event.target as Node)) setScheduleOpen(false);
    };
    const starts = new Map<EventTarget, number>();
    const position = (target: EventTarget) =>
      target instanceof Element ? target.scrollTop : window.scrollY;
    const onScroll = (event: Event) => {
      const target = event.target ?? document;
      const now = position(target);
      const start = starts.get(target);
      if (start === undefined) starts.set(target, now);
      else if (Math.abs(now - start) > SCHEDULE_CLOSE_SCROLL_PX) setScheduleOpen(false);
    };
    starts.set(document, window.scrollY);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [scheduleOpen]);

  const address = t("address");

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <ul className="flex flex-col gap-4 sm:gap-5">
        <li className="flex gap-3">
          <Icon>
            <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </Icon>
          <div className="min-w-0">
            <span className={labelClass}>{t("labelAddress")}</span>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} whitespace-normal! break-words`}
            >
              {address}
            </a>
          </div>
        </li>

        <li className="flex gap-3">
          <Icon>
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
          </Icon>
          <div className="min-w-0">
            <span className={labelClass}>{t("labelPhones")}</span>
            <div className="flex flex-col gap-1.5">
              {contacts.phones.map((phone) => (
                <span key={phone.value} className="flex flex-wrap items-center gap-3">
                  <a
                    href={phone.viber ? viberLink(phone.value) : telLink(phone.value)}
                    className={linkClass}
                  >
                    {phone.display}
                  </a>
                  {phone.viber && (
                    <a
                      href={viberLink(phone.value)}
                      aria-label={t("viberAria", { phone: phone.display })}
                      className="rounded-md bg-[#7360f2] px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-[#8b7bf7]"
                    >
                      {t("viber")}
                    </a>
                  )}
                </span>
              ))}
            </div>
          </div>
        </li>

        <li className="flex gap-3">
          <Icon>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </Icon>
          <div className="min-w-0">
            <span className={labelClass}>{t("labelEmail")}</span>
            <a
              href={emailLink(t("emailSubject"))}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} whitespace-normal! break-all`}
            >
              {contacts.email}
            </a>
          </div>
        </li>

        <li className="flex gap-3">
          <Icon>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </Icon>
          <div ref={scheduleRef} className="relative min-w-0 flex-1">
            <span className={labelClass}>{t("labelSchedule")}</span>
            <button
              type="button"
              onClick={() => setScheduleOpen((v) => !v)}
              aria-expanded={scheduleOpen}
              aria-controls="schedule-list"
              className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md border border-line px-3 py-2 text-left text-sm transition-colors hover:border-line-strong"
            >
              <span>{t("scheduleTitle")}</span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <span className="hidden sm:inline">{t("scheduleHint")}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-3.5 w-3.5 transition-transform ${scheduleOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            {/* Завжди в DOM, щоб працювала плавна анімація: виїжджає зверху вниз із розмиттям прозорості. */}
            <ul
              id="schedule-list"
              aria-hidden={!scheduleOpen}
              className={`absolute inset-x-0 top-full z-20 mt-2 divide-y divide-line rounded-md border border-line-strong bg-black shadow-lg shadow-black transition-[clip-path,opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none ${
                scheduleOpen
                  ? "visible translate-y-0 opacity-100 [clip-path:inset(0_0_0_0)]"
                  : "invisible pointer-events-none -translate-y-2 opacity-0 [clip-path:inset(0_0_100%_0)]"
              }`}
            >
                {schedule.map((row) => (
                  <li key={row.day} className="flex justify-between gap-3 px-3 py-1.5 text-sm">
                    <span>{t(`days.${row.day}`)}</span>
                    <span className={row.hours ? "" : "text-muted"}>
                      {row.hours ?? t("scheduleClosed")}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </li>
      </ul>

      {/* Карта: поверх неї прозоре посилання, клік відкриває адресу в Google Maps. */}
      <div className="relative aspect-[4/3] min-h-52 w-full sm:aspect-video overflow-hidden rounded-lg border border-line">
        <iframe
          src={mapEmbedSrc(locale)}
          title={t("mapTitle", { address })}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
          className="h-full w-full border-0"
        />
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("mapOpenAria", { address })}
          className="group absolute inset-0 flex items-end justify-center p-3"
        >
          <span className="rounded-md border border-line-strong bg-black/80 px-3 py-1 text-xs text-foreground opacity-90 transition-opacity group-hover:opacity-100">
            {t("mapOpen")}
          </span>
        </a>
      </div>
    </div>
  );
}
