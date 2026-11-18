"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
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
export function Modal({ open, onClose, title, closeLabel, children }: ModalProps) {
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
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-line-strong bg-black p-0 text-foreground backdrop:bg-black/80"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 id="modal-title" className="text-lg font-bold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="rounded-md px-2 py-1 text-2xl leading-none text-muted hover:text-foreground"
        >
          ×
        </button>
      </div>
      <div className="px-5 py-6">{children}</div>
    </dialog>,
    document.body,
  );
}
