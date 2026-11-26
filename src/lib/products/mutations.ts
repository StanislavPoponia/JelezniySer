import { compressImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import { IMAGES_BUCKET } from "./storage";

// Зміна каталогу з браузера. Права перевіряє база (RLS): писати може лише адмін.

export type ProductInput = {
  name: string;
  article: string;
  category: string;
  nameEn: string;
  categoryEn: string;
  description: string;
  photo: File | null;
};

async function removeImage(path: string | null) {
  if (path) await createClient().storage.from(IMAGES_BUCKET).remove([path]);
}

/** Додає новий товар або оновлює наявний (editing). */
export async function saveProduct(input: ProductInput, editing: Product | null) {
  const supabase = createClient();
  const oldPath = editing?.imagePath ?? null;
  let newPath: string | null = null;

  if (input.photo) {
    const blob = await compressImage(input.photo);
    const path = `${crypto.randomUUID()}.webp`;
    const { error } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(path, blob, { contentType: "image/webp" });
    if (error) throw error;
    newPath = path;
  }

  const row = {
    name: input.name.trim(),
    article: input.article.trim(),
    category: input.category.trim(),
    name_en: input.nameEn.trim() || null,
    category_en: input.categoryEn.trim() || null,
    description: input.description.trim() || null,
    image_path: newPath ?? oldPath,
  };

  // select: без прав RLS оновлення не дає помилки, а просто не чіпає жодного рядка.
  const { data, error } = editing
    ? await supabase.from("products").update(row).eq("id", editing.id).select("id")
    : await supabase.from("products").insert(row).select("id");

  if (error || !data?.length) {
    await removeImage(newPath);
    throw error ?? new Error("Товар не збережено");
  }

  // Старе фото прибираємо лише після успішного збереження.
  if (newPath) await removeImage(oldPath);
}

export async function deleteProduct(product: Product) {
  const { data, error } = await createClient()
    .from("products")
    .delete()
    .eq("id", product.id)
    .select("id");

  if (error || !data?.length) throw error ?? new Error("Товар не видалено");
  await removeImage(product.imagePath);
}
