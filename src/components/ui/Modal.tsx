"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  /** Клас максимальної ширини вікна (за замовчуванням max-w-md). */
  maxWidthClass?: string;
  children: ReactNode;
};

const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

// Модальне вікно на базі <dialog>. Рендериться в body, тому працює
// навіть коли кнопку відкриття сховано всередині мобільного меню.
export function Modal({ open, onClose, title, closeLabel, maxWidthClass = "max-w-md", children }: ModalProps) {
  const isClient = useIsClient();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open, isClient]);

  if (!isClient) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-labelledby="modal-title"
      className={`m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] overflow-y-auto overscroll-contain sm:w-[calc(100%-2rem)] ${maxWidthClass} rounded-lg border border-line-strong bg-black p-0 text-foreground backdrop:bg-black/80`}
    >
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-black px-4 py-3 sm:px-5 sm:py-4">
        <h2 id="modal-title" className="text-lg font-bold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="group relative -mr-2 flex h-10 w-10 items-center justify-center rounded-md text-muted hover:text-foreground focus-visible:text-foreground"
        >
          <span
            aria-hidden="true"
            className="text-2xl leading-none transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0"
          >
            ×
          </span>
          {/* Колесо мотокросового мотоцикла: з'являється замість хрестика й крутиться. */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
            className="absolute h-8 w-8 opacity-0 transition-opacity group-hover:animate-[spin_2.8s_linear_infinite] group-hover:opacity-100 group-focus-visible:animate-[spin_2.8s_linear_infinite] group-focus-visible:opacity-100 motion-reduce:animate-none"
          >
            {/* шина з ґрунтозачепами */}
            <circle cx="20" cy="20" r="18" strokeWidth="3.5" strokeDasharray="4.2 2.4" />
            <circle cx="20" cy="20" r="15.5" strokeWidth="1.2" />
            {/* обід і спиці */}
            <circle cx="20" cy="20" r="11.5" strokeWidth="1.5" />
            <g strokeWidth="1">
              <path d="M20 8.5v23M8.5 20h23M11.9 11.9l16.2 16.2M28.1 11.9 11.9 28.1" />
            </g>
            {/* маточина */}
            <circle cx="20" cy="20" r="3" strokeWidth="2" fill="currentColor" />
          </svg>
        </button>
      </div>
      <div className="px-4 py-5 sm:px-5 sm:py-6">{children}</div>
    </dialog>,
    document.body,
  );
}
