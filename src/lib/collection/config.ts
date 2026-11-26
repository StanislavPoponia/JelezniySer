/** Бакет Supabase Storage з фото й відео колекції. */
export const COLLECTION_BUCKET = "collection-media";

/** Найбільший розмір відео. Такий самий ліміт задано в бакеті (0004_collection.sql). */
export const MAX_VIDEO_MB = 50;

/** Дозволені формати відео та розширення файлів для них. */
export const VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export const FILE_ACCEPT = ["image/*", ...Object.keys(VIDEO_TYPES)].join(",");
