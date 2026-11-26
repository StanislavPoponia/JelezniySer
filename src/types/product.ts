export type Product = {
  id: string;
  name: string;
  /** Артикул / код запчастини */
  article: string;
  category: string;
  /** Назва англійською (null — використовується українська) */
  nameEn: string | null;
  /** Категорія англійською (null — використовується українська) */
  categoryEn: string | null;
  /** Докладний опис (null — опису немає) */
  description: string | null;
  /** Шлях файлу у сховищі (null — фото немає) */
  imagePath: string | null;
  /** Готове посилання на фото (null — фото немає) */
  imageUrl: string | null;
};
