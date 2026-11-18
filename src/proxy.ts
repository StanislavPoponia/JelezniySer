import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";

const handleI18n = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const response = handleI18n(request);
  return updateSession(request, response);
}

export const config = {
  // Усе, крім API, auth-callback, службових шляхів Next.js і файлів із розширенням.
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
