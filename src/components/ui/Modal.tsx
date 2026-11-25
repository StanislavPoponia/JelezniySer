"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MotoWheel } from "@/components/ui/MotoWheel";

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
          <MotoWheel className="absolute h-8 w-8 opacity-0 transition-opacity group-hover:animate-[spin_2.8s_linear_infinite] group-hover:opacity-100 group-focus-visible:animate-[spin_2.8s_linear_infinite] group-focus-visible:opacity-100 motion-reduce:animate-none" />
        </button>
      </div>
      <div className="px-4 py-5 sm:px-5 sm:py-6">{children}</div>
    </dialog>,
    document.body,
  );
}
