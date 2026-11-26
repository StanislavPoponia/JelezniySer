import type { Product } from "@/types/product";

/** Назва товару мовою інтерфейсу (якщо переклад не заповнено — українська). */
export function productName(product: Product, locale: string): string {
  return (locale === "en" && product.nameEn?.trim()) || product.name;
}

/** Категорія товару мовою інтерфейсу (якщо переклад не заповнено — українська). */
export function productCategory(product: Product, locale: string): string {
  return (locale === "en" && product.categoryEn?.trim()) || product.category;
}

/** Категорії каталогу. Ключ — українська назва, підпис залежить від мови сайту. */
export function listCategories(products: Product[], locale: string) {
  const labels = new Map<string, string>();
  for (const product of products) {
    if (!labels.has(product.category)) {
      labels.set(product.category, productCategory(product, locale));
    }
  }
  return [...labels]
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}

/**
 * Спершу фільтр за вибраними категоріями (порожній вибір — усі),
 * потім пошук за будь-яким входженням тексту в назву, артикул або категорію.
 */
export function filterProducts(products: Product[], categories: string[], query: string): Product[] {
  const inCategories =
    categories.length > 0
      ? products.filter((product) => categories.includes(product.category))
      : products;

  const q = query.trim().toLocaleLowerCase("uk");
  if (!q) return inCategories;

  return inCategories.filter((p) =>
    `${p.name} ${p.nameEn ?? ""} ${p.article} ${p.category} ${p.categoryEn ?? ""}`
      .toLocaleLowerCase("uk")
      .includes(q),
  );
}
