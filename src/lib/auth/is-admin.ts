import { createClient } from "@/lib/supabase/server";

/** Чи увійшов адмін. Лише показує кнопки: сам запис захищає RLS у базі. */
export async function getIsAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}
