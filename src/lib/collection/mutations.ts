import { compressImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import type { CollectionItem, MediaType } from "@/types/collection";
import { COLLECTION_BUCKET, VIDEO_TYPES } from "./config";

// Зміна колекції з браузера. Права перевіряє база (RLS): писати може лише адмін.

export type CollectionInput = {
  title: string;
  description: string;
  file: File;
};

/** Фото стискаємо, відео завантажуємо без змін. */
async function prepareMedia(file: File) {
  const videoExtension = VIDEO_TYPES[file.type];
  if (videoExtension) {
    return { body: file as Blob, type: "video" as MediaType, extension: videoExtension };
  }
  const body = await compressImage(file);
  // Браузер без підтримки webp повертає png.
  const extension = body.type === "image/png" ? "png" : "webp";
  return { body, type: "image" as MediaType, extension };
}

export async function addCollectionItem({ title, description, file }: CollectionInput) {
  const supabase = createClient();
  const media = await prepareMedia(file);
  const path = `${crypto.randomUUID()}.${media.extension}`;

  const upload = await supabase.storage
    .from(COLLECTION_BUCKET)
    .upload(path, media.body, { contentType: media.body.type });
  if (upload.error) throw upload.error;

  const { error } = await supabase.from("collection_items").insert({
    title: title.trim(),
    description: description.trim() || null,
    media_path: path,
    media_type: media.type,
  });

  if (error) {
    await supabase.storage.from(COLLECTION_BUCKET).remove([path]);
    throw error;
  }
}

export async function deleteCollectionItem(item: CollectionItem) {
  const supabase = createClient();
  // select: без прав RLS видалення не дає помилки, а просто не чіпає жодного рядка.
  const { data, error } = await supabase
    .from("collection_items")
    .delete()
    .eq("id", item.id)
    .select("id");

  if (error || !data?.length) throw error ?? new Error("Запис не видалено");
  await supabase.storage.from(COLLECTION_BUCKET).remove([item.mediaPath]);
}
