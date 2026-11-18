import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { MotoPlaceholder } from "@/components/ui/MotoPlaceholder";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Кошик доступний лише залогіненим користувачам.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect({ href: "/login", locale });
  }

  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={t("cart.title")} />
      <div className="flex flex-col items-center gap-4">
        <MotoPlaceholder label={t("common.placeholderAlt")} className="w-full max-w-xl" />
        <p className="text-muted">{t("cart.empty")}</p>
      </div>
    </div>
  );
}
