import { getTranslations, setRequestLocale } from "next-intl/server";
import { MotoPlaceholder } from "@/components/ui/MotoPlaceholder";
import { PageHeader } from "@/components/ui/PageHeader";

const SERVICES = ["diagnostics", "repair", "restoration"] as const;

export default async function RepairPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={t("repair.title")} intro={t("repair.intro")} />

      <ul className="grid gap-4 md:grid-cols-3">
        {SERVICES.map((key) => (
          <li key={key} className="rounded-lg border border-line p-5">
            <h2 className="text-lg font-bold">{t(`repair.services.${key}.title`)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t(`repair.services.${key}.text`)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-center gap-4">
        <MotoPlaceholder label={t("common.placeholderAlt")} className="w-full max-w-xl" />
        <p className="text-muted">{t("repair.soon")}</p>
      </div>
    </div>
  );
}
