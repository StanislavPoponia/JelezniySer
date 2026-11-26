"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { TrashIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { saveProduct, type ProductInput } from "@/lib/products/mutations";
import type { Product } from "@/types/product";

type ProductFormProps = {
  /** Товар, який редагують; null — додавання нового. */
  editing: Product | null;
  /** Наявні категорії для підказки в полі «Категорія». */
  categories: string[];
  onSaved: () => void;
  onError: () => void;
  onStart: () => void;
  onCancel: () => void;
};

// Поле не може складатися з самих пробілів.
const NOT_BLANK = ".*\\S.*";

// Форма товару. Щоб заповнити її іншим товаром, батько змінює key.
export function ProductForm({
  editing,
  categories,
  onSaved,
  onError,
  onStart,
  onCancel,
}: ProductFormProps) {
  const t = useTranslations("admin");
  const id = useId();
  const [values, setValues] = useState({
    name: editing?.name ?? "",
    article: editing?.article ?? "",
    category: editing?.category ?? "",
    nameEn: editing?.nameEn ?? "",
    categoryEn: editing?.categoryEn ?? "",
    description: editing?.description ?? "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  // Зміна ключа очищає поле вибору файлу.
  const [photoKey, setPhotoKey] = useState(0);
  const [busy, setBusy] = useState(false);

  const field = (name: Exclude<keyof ProductInput, "photo">) => ({
    id: `${id}-${name}`,
    label: t(name),
    value: values[name],
    onChange: (e: { target: { value: string } }) => {
      // Значення читаємо одразу: функція оновлення стану виконується пізніше.
      const { value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
    },
  });
  const description = field("description");

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoKey((k) => k + 1);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    onStart();
    try {
      await saveProduct({ ...values, photo }, editing);
      onSaved();
    } catch (error) {
      console.error(error);
      onError();
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3.5 rounded-lg border border-line bg-surface p-4">
      <h3 className="text-base font-bold">{editing ? t("editTitle") : t("addTitle")}</h3>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Input {...field("name")} required pattern={NOT_BLANK} />
        <Input {...field("article")} required pattern={NOT_BLANK} />
      </div>
      <Input {...field("category")} required pattern={NOT_BLANK} list={`${id}-categories`} />
      <datalist id={`${id}-categories`}>
        {categories.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Input {...field("nameEn")} />
        <Input {...field("categoryEn")} />
      </div>

      <label htmlFor={description.id} className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">{description.label}</span>
        <textarea
          id={description.id}
          value={description.value}
          onChange={description.onChange}
          rows={4}
          className="min-h-24 resize-y rounded-md border border-line bg-black px-3 py-2.5 text-base text-foreground focus:border-foreground focus:outline-none"
        />
      </label>

      <div className="grid gap-1.5 text-sm">
        <span className="text-muted">
          {t("photo")} {editing?.imageUrl && t("photoKeep")}
        </span>
        <span className="flex items-center gap-3">
          <input
            key={photoKey}
            type="file"
            accept="image/*"
            aria-label={t("photo")}
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="min-w-0 flex-1 rounded-md border border-line bg-black px-3 py-2 text-sm text-muted file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-background hover:border-foreground"
          />
          <button
            type="button"
            onClick={clearPhoto}
            disabled={!photo}
            aria-label={t("clearFile")}
            title={t("clearFile")}
            className="flex h-11 w-11 flex-none items-center justify-center rounded-md border border-line-strong transition-colors hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-40"
          >
            <TrashIcon />
          </button>
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" variant="solid" disabled={busy}>
          {busy ? t("saving") : editing ? t("save") : t("add")}
        </Button>
        {editing && (
          <Button type="button" onClick={onCancel} disabled={busy}>
            {t("cancel")}
          </Button>
        )}
      </div>
    </form>
  );
}
