// Стан форми авторизації. `error` — ключ повідомлення в messages (auth.errors.*).
export type AuthFormState = {
  error?: string;
  success?: boolean;
} | null;
