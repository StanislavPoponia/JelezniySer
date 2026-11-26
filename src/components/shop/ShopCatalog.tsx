"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ContactList } from "@/components/contacts/ContactList";
import { buttonClassName } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/Modal";
import { PhotoViewer } from "@/components/ui/PhotoViewer";
import { SearchInput } from "@/components/ui/SearchInput";
import { filterProducts, listCategories, productCategory, productName } from "@/lib/products/catalog";
import type { Product } from "@/types/product";
import { ProductAdmin } from "./admin/ProductAdmin";
import { CategoryFilter } from "./CategoryFilter";
import { ProductCard } from "./ProductCard";
import { ProductPhoto } from "./ProductPhoto";
import { ShopMessage } from "./ShopMessage";

type ShopCatalogProps = {
  products: Product[];
  /** Адміну показуємо кнопку «Додати» з вікном керування товарами. */
  isAdmin: boolean;
};

// Каталог із миттєвим пошуком, фільтром категорій і вікном товару.
export function ShopCatalog({ products, isAdmin }: ShopCatalogProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [checkedCategories, setSelectedCategories] = useState<string[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminListOpen, setAdminListOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  // Контакти, відкриті з вікна товару: після їх закриття картка повертається.
  const [asking, setAsking] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const categories = useMemo(() => listCategories(products, locale), [products, locale]);
  // Категорія могла зникнути після видалення чи редагування товарів — її не враховуємо.
  const selectedCategories = useMemo(
    () => checkedCategories.filter((key) => categories.some((c) => c.key === key)),
    [checkedCategories, categories],
  );
  const results = useMemo(
    () => filterProducts(products, selectedCategories, query),
    [products, selectedCategories, query],
  );

  const toggleCategory = (key: string) =>
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );

  return (
    <>
      <div className="flex w-full items-center gap-2 max-[359px]:gap-1.5">
        {categories.length > 1 && (
          <CategoryFilter
            categories={categories}
            selected={selectedCategories}
            onToggle={toggleCategory}
            onReset={() => setSelectedCategories([])}
          />
        )}
        <SearchInput
          value={query}
          onChange={setQuery}
          label={t("shop.searchLabel")}
          placeholder={t("shop.searchPlaceholder")}
          clearLabel={t("shop.clearSearch")}
        />
        {isAdmin && (
          <button
            type="button"
            onClick={() => setAdminOpen(true)}
            aria-label={t("admin.add")}
            aria-haspopup="dialog"
            className={buttonClassName("solid", "h-13 flex-none max-sm:w-13 max-sm:px-0")}
          >
            <PlusIcon />
            <span className="max-sm:hidden">{t("admin.add")}</span>
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <ShopMessage text={t("shop.shelfEmpty")} placeholderLabel={t("common.placeholderAlt")} />
      ) : results.length === 0 ? (
        <ShopMessage text={t("shop.notFound")} placeholderLabel={t("common.placeholderAlt")} />
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-3 max-[359px]:grid-cols-1 md:grid-cols-3 md:gap-7 lg:grid-cols-4">
          {results.map((product) => (
            <li key={product.id} className="min-w-0">
              <ProductCard
                name={productName(product, locale)}
                article={product.article}
                description={product.description}
                imageUrl={product.imageUrl}
                onSelect={() => setSelected(product)}
              />
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={selected !== null && !asking}
        onClose={() => setSelected(null)}
        title={selected ? productName(selected, locale) : ""}
        closeLabel={t("common.close")}
        maxWidthClass="max-w-3xl"
      >
        {selected && (
          <div className="grid gap-5 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setZoomed(true)}
              aria-label={t("shop.zoomPhoto")}
              aria-haspopup="dialog"
              className="mx-auto block w-full max-w-sm cursor-zoom-in self-start rounded-md"
            >
              <ProductPhoto
                imageUrl={selected.imageUrl}
                placeholderLabel={t("common.placeholderAlt")}
              />
            </button>
            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-muted">
                {t("shop.article")}: {selected.article}
              </p>
              <p className="font-semibold">{productCategory(selected, locale)}</p>
              {selected.description && (
                // Зберігаємо абзаци, які ввів адмін.
                <p className="whitespace-pre-line break-words text-muted">{selected.description}</p>
              )}
              {/* Кнопка внизу, по центру колонки з текстом. */}
              <button
                type="button"
                onClick={() => setAsking(true)}
                className={buttonClassName("solid", "mt-auto h-12 self-center px-6")}
              >
                {t("shop.ask")}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {selected && zoomed && (
        <PhotoViewer
          imageUrl={selected.imageUrl}
          alt={productName(selected, locale)}
          placeholderLabel={t("common.placeholderAlt")}
          closeLabel={t("common.close")}
          onClose={() => setZoomed(false)}
        />
      )}

      <Modal
        open={asking}
        onClose={() => setAsking(false)}
        title={t("contacts.title")}
        closeLabel={t("common.close")}
        maxWidthClass="max-w-xl"
      >
        <ContactList />
      </Modal>

      {isAdmin && (
        <Modal
          open={adminOpen}
          onClose={() => {
            setAdminOpen(false);
            // Наступного разу вікно знову відкриється зі згорнутим списком.
            setAdminListOpen(false);
          }}
          title={`${t("admin.title")} (${products.length})`}
          closeLabel={t("common.close")}
          maxWidthClass="max-w-2xl"
        >
          <ProductAdmin
            products={products}
            listOpen={adminListOpen}
            onToggleList={() => setAdminListOpen((v) => !v)}
          />
        </Modal>
      )}
    </>
  );
}
