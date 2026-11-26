export type MediaType = "image" | "video";

export type CollectionItem = {
  id: string;
  title: string;
  /** Опис роботи (null — опису немає) */
  description: string | null;
  mediaType: MediaType;
  /** Шлях файлу у сховищі */
  mediaPath: string;
  /** Готове посилання на фото чи відео */
  mediaUrl: string;
};
