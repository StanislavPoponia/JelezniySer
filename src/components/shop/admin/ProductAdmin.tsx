"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FormMessage } from "@/components/auth/FormMessage";
import { ChevronIcon, PencilIcon, TrashIcon } from "@/components/ui/icons";
import { MotoWheel } from "@/components/ui/MotoWheel";
import { useRouter } from "@/i18n/navigation";
import { deleteProduct } from "@/lib/products/mutations";
import type { Product } from "@/types/product";
import { ProductForm } from "./ProductForm";

type Message = { tone: "error" | "success"; key: "added" | "saved" | "saveError" | "deleteError" };

const iconButtonClass =
  "flex h-11 w-11 flex-none items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-foreground";

type ProductAdminProps = {
  products: Product[];
  /** Чи розгорнутий список наявних товарів. */
  listOpen: boolean;
  onToggleList: () => void;
};

// Керування товарами: форма додавання/редагування та список усіх товарів, що розгортається.
export function ProductAdmin({ products, listOpen, onToggleList }: ProductAdminProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const listId = useId();
  const [editing, setEditing] = useState<Product | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [message, setMessage] = useState<Message | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const categories = [...new Set(products.map((p) => p.category))].sort((a, b) =>
    a.localeCompare(b, "uk"),
  );

  /** Відкриває чисту форму або форму з даними товару. */
  const openForm = (product: Product | null) => {
    setEditing(product);
    setFormVersion((v) => v + 1);
  };

  const startEdit = (product: Product) => {
    openForm(product);
    setMessage(null);
    // Прокручуємо вікно вгору, до форми (заголовок вікна лишається на місці).
    topRef.current?.closest("dialog")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSaved = () => {
    setMessage({ tone: "success", key: editing ? "saved" : "added" });
    openForm(null);
    router.refresh();
  };

  const remove = async (product: Product) => {
    if (!window.confirm(t("deleteConfirm", { name: product.name }))) return;
    setMessage(null);
    try {
      await deleteProduct(product);
    } catch (error) {
      console.error(error);
      setMessage({ tone: "error", key: "deleteError" });
      return;
    }
    if (editing?.id === product.id) openForm(null);
    router.refresh();
  };

  return (
    <div ref={topRef} className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <ProductForm
        key={formVersion}
        editing={editing}
        categories={categories}
        onStart={() => setMessage(null)}
        onSaved={onSaved}
        onError={() => setMessage({ tone: "error", key: "saveError" })}
        onCancel={() => openForm(null)}
      />

      {message && <FormMessage tone={message.tone}>{t(message.key)}</FormMessage>}

      {products.length > 0 && (
        <div>
          <button
            type="button"
            onClick={onToggleList}
            aria-expanded={listOpen}
            aria-controls={listId}
            className="flex min-h-12 w-full items-center justify-center gap-2 border-t border-line pt-2 text-sm font-semibold text-muted transition-colors hover:text-foreground"
          >
            {listOpen ? t("hideList") : t("showList")}
            <ChevronIcon
              className={`h-5 w-5 transition-transform duration-300 motion-reduce:transition-none ${
                listOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Список плавно виїжджає; згорнутий — invisible, тому недоступний і з клавіатури. */}
          <div
            id={listId}
            className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out motion-reduce:transition-none ${
              listOpen ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-2 px-0.5 pb-0.5 pt-3">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-3 rounded-lg border border-line bg-surface p-2.5"
                  >
                    <span className="relative flex h-13 w-13 flex-none items-center justify-center overflow-hidden rounded-md bg-black">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt="" fill unoptimized className="object-contain" />
                      ) : (
                        <MotoWheel className="h-8 w-8 text-muted" />
                      )}
                    </span>
                    <span className="grid min-w-0 flex-1 break-words">
                      <strong className="text-sm">{product.name}</strong>
                      <small className="text-muted">
                        {product.article} · {product.category}
                      </small>
                    </span>
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      aria-label={`${t("edit")}: ${product.name}`}
                      title={t("edit")}
                      className={iconButtonClass}
                    >
                      <PencilIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(product)}
                      aria-label={`${t("remove")}: ${product.name}`}
                      title={t("remove")}
                      className={iconButtonClass}
                    >
                      <TrashIcon />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
