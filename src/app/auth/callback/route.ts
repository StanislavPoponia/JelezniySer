import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

// Обмінює код із листа (підтвердження email, відновлення пароля) на сесію.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "";

  // Дозволяємо лише внутрішні шляхи, щоб не було відкритого редиректу.
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : `/${routing.defaultLocale}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/${routing.defaultLocale}/login?error=callbackFailed`);
}
