import { getTranslations, setRequestLocale } from "next-intl/server";
import { MotoPlaceholder } from "@/components/ui/MotoPlaceholder";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={t("shop.title")} />
      <SearchInput
        label={t("shop.searchLabel")}
        placeholder={t("shop.searchPlaceholder")}
        buttonLabel={t("shop.searchButton")}
      />
      <div className="mt-10 flex flex-col items-center gap-4">
        <MotoPlaceholder label={t("common.placeholderAlt")} className="w-full max-w-xl" />
        <p className="text-muted">{t("shop.empty")}</p>
      </div>
    </div>
  );
}
