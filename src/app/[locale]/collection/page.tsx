import { getTranslations, setRequestLocale } from "next-intl/server";
import { MotoPlaceholder } from "@/components/ui/MotoPlaceholder";
import { PageHeader } from "@/components/ui/PageHeader";

const SLOTS = [0, 1, 2, 3, 4, 5] as const;

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={t("collection.title")} intro={t("collection.intro")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SLOTS.map((slot) => (
          <MotoPlaceholder key={slot} label={t("common.placeholderAlt")} />
        ))}
      </div>
      <p className="mt-8 text-center text-muted">{t("collection.soon")}</p>
    </div>
  );
}
