import { useTranslations } from "next-intl";
import { ProductPhoto } from "./ProductPhoto";

type ProductCardProps = {
  name: string;
  article: string;
  description: string | null;
  imageUrl: string | null;
  onSelect: () => void;
};

// Скільки слів опису показуємо на картці.
const PREVIEW_WORDS = 4;

/** Перші слова опису; якщо є ще текст — з трьома крапками. */
function previewText(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= PREVIEW_WORDS) return words.join(" ");
  return `${words.slice(0, PREVIEW_WORDS).join(" ").replace(/[.,;:!?–—-]+$/, "")}…`;
}

// Висота тексту фіксована (назва — 2 рядки, опис і артикул — по 1), щоб картки
// не змінювали розмір, коли при фільтрації з'являються довші назви.
export function ProductCard({ name, article, description, imageUrl, onSelect }: ProductCardProps) {
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-full w-full min-w-0 flex-col gap-2 rounded-lg border border-line bg-surface px-3.5 pb-4 pt-3.5 text-left transition hover:-translate-y-0.5 hover:border-foreground focus-visible:-translate-y-0.5 focus-visible:border-foreground motion-reduce:transform-none motion-reduce:transition-none"
    >
      <ProductPhoto imageUrl={imageUrl} placeholderLabel={t("common.placeholderAlt")} />
      <span
        title={name}
        className="line-clamp-2 min-h-[2.6em] whitespace-normal break-words text-base font-semibold leading-[1.3] hyphens-auto"
      >
        {name}
      </span>
      {/* Один рядок: на вузькій картці він обрізається раніше, теж із крапками.
          Без опису місце лишається порожнім, щоб картки були однакові. */}
      <span className="min-h-[1.4em] truncate text-sm leading-[1.4] text-muted">
        {description && previewText(description)}
      </span>
      <span className="truncate text-xs text-muted">
        {t("shop.article")}: {article}
      </span>
    </button>
  );
}
