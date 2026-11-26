"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { MotoPlaceholder } from "@/components/ui/MotoPlaceholder";

type PhotoViewerProps = {
  imageUrl: string | null;
  alt: string;
  placeholderLabel: string;
  closeLabel: string;
  onClose: () => void;
};

// Збільшене фото поверх картки товару. Монтується лише на час перегляду.
// Закривається натисканням поза фото, кнопкою × або клавішею Escape.
export function PhotoViewer({ imageUrl, alt, placeholderLabel, closeLabel, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // showModal кладе вікно поверх уже відкритої картки.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Закриваємо через сам <dialog>, щоб фокус повернувся на фото в картці.
  const close = () => dialogRef.current?.close();

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("[data-photo]")) close();
      }}
      aria-label={alt}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-transparent p-4 text-foreground backdrop:bg-black/90 open:flex"
    >
      <button
        type="button"
        aria-label={closeLabel}
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-black text-2xl leading-none hover:bg-white hover:text-black"
      >
        <span aria-hidden="true">×</span>
      </button>
      {imageUrl ? (
        // Розмір елемента збігається з самим фото, тож усе навколо — «поза фото».
        <Image
          data-photo
          src={imageUrl}
          alt={alt}
          width={1200}
          height={1200}
          unoptimized
          className="h-auto max-h-[85dvh] w-auto max-w-full rounded-lg object-contain"
        />
      ) : (
        <div data-photo className="w-[min(100%,85dvh)]">
          <MotoPlaceholder label={placeholderLabel} className="aspect-square w-full" />
        </div>
      )}
    </dialog>,
    document.body,
  );
}
