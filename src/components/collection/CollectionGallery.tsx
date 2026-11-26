"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button, buttonClassName } from "@/components/ui/Button";
import { PlusIcon, TrashIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/Modal";
import { MotoPlaceholder } from "@/components/ui/MotoPlaceholder";
import { PhotoViewer } from "@/components/ui/PhotoViewer";
import { useRouter } from "@/i18n/navigation";
import { deleteCollectionItem } from "@/lib/collection/mutations";
import type { CollectionItem } from "@/types/collection";
import { CollectionCard } from "./CollectionCard";
import { CollectionForm } from "./CollectionForm";

const SLOTS = [0, 1, 2, 3, 4, 5] as const;

type CollectionGalleryProps = {
  items: CollectionItem[];
  /** Адміну показуємо кнопки додавання та видалення. */
  isAdmin: boolean;
};

// Сітка робіт із вікном перегляду фото чи відео.
export function CollectionGallery({ items, isAdmin }: CollectionGalleryProps) {
  const t = useTranslations();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<CollectionItem | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);

  const closeItem = () => {
    setSelected(null);
    setDeleteFailed(false);
  };

  const remove = async (item: CollectionItem) => {
    if (!window.confirm(t("collection.deleteConfirm", { name: item.title }))) return;
    setDeleting(true);
    setDeleteFailed(false);
    try {
      await deleteCollectionItem(item);
      closeItem();
      router.refresh();
    } catch (error) {
      console.error(error);
      setDeleteFailed(true);
    }
    setDeleting(false);
  };

  return (
    <>
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => setAdding(true)}
            aria-haspopup="dialog"
            className={buttonClassName("solid", "h-12 px-6")}
          >
            <PlusIcon />
            {t("collection.add")}
          </button>
        </div>
      )}

      {items.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="min-w-0">
              <CollectionCard item={item} onSelect={() => setSelected(item)} />
            </li>
          ))}
        </ul>
      ) : (
        // Поки колекція порожня — заглушки.
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SLOTS.map((slot) => (
              <MotoPlaceholder key={slot} label={t("common.placeholderAlt")} />
            ))}
          </div>
          <p className="mt-8 text-center text-muted">{t("collection.soon")}</p>
        </>
      )}

      {/* Вміст є лише в відкритому вікні, тому після закриття відео зупиняється. */}
      <Modal
        open={selected !== null}
        onClose={closeItem}
        title={selected?.title ?? ""}
        closeLabel={t("common.close")}
        maxWidthClass="max-w-3xl"
      >
        {selected && (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
            {selected.mediaType === "image" ? (
              <button
                type="button"
                onClick={() => setZoomed(true)}
                aria-label={t("shop.zoomPhoto")}
                aria-haspopup="dialog"
                className="relative block h-[60dvh] w-full cursor-zoom-in overflow-hidden rounded-md"
              >
                <Image
                  src={selected.mediaUrl}
                  alt={selected.title}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </button>
            ) : (
              <video
                key={selected.id}
                src={selected.mediaUrl}
                controls
                playsInline
                preload="metadata"
                className="max-h-[65dvh] w-full rounded-md bg-black"
              />
            )}
            {selected.description && (
              <p className="whitespace-pre-line break-words text-muted">{selected.description}</p>
            )}
            {deleteFailed && <FormMessage tone="error">{t("collection.deleteError")}</FormMessage>}
            {isAdmin && (
              <Button
                type="button"
                onClick={() => void remove(selected)}
                disabled={deleting}
                className="justify-self-end"
              >
                <TrashIcon />
                {t("collection.delete")}
              </Button>
            )}
          </div>
        )}
      </Modal>

      {selected?.mediaType === "image" && zoomed && (
        <PhotoViewer
          imageUrl={selected.mediaUrl}
          alt={selected.title}
          placeholderLabel={t("common.placeholderAlt")}
          closeLabel={t("common.close")}
          onClose={() => setZoomed(false)}
        />
      )}

      {isAdmin && (
        <Modal
          open={adding}
          onClose={() => setAdding(false)}
          title={t("collection.form.heading")}
          closeLabel={t("common.close")}
          maxWidthClass="max-w-xl"
        >
          <CollectionForm
            onAdded={() => {
              setAdding(false);
              router.refresh();
            }}
          />
        </Modal>
      )}
    </>
  );
}
