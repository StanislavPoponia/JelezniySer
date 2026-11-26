import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";
import { IMAGES_BUCKET } from "./storage";

/** Увесь каталог. null — каталог не вдалося завантажити. */
export async function getProducts(): Promise<Product[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, article, category, name_en, category_en, description, image_path")
    .order("name");

  if (error) {
    console.error("getProducts:", error.message);
    return null;
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    article: row.article,
    category: row.category,
    nameEn: row.name_en,
    categoryEn: row.category_en,
    description: row.description,
    imagePath: row.image_path,
    imageUrl: row.image_path
      ? supabase.storage.from(IMAGES_BUCKET).getPublicUrl(row.image_path).data.publicUrl
      : null,
  }));
}
