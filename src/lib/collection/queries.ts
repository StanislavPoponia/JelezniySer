import { createClient } from "@/lib/supabase/server";
import type { CollectionItem, MediaType } from "@/types/collection";
import { COLLECTION_BUCKET } from "./config";

/** Уся колекція, нові спочатку. null — не вдалося завантажити. */
export async function getCollection(): Promise<CollectionItem[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collection_items")
    .select("id, title, description, media_path, media_type")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCollection:", error.message);
    return null;
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    mediaType: row.media_type as MediaType,
    mediaPath: row.media_path,
    mediaUrl: supabase.storage.from(COLLECTION_BUCKET).getPublicUrl(row.media_path).data.publicUrl,
  }));
}
