import { getTranslations } from "next-intl/server";
import { MotoPlaceholder } from "@/components/ui/MotoPlaceholder";

const FACTS = ["experience", "qualification", "dedication"] as const;

export async function MasterSection() {
  const t = await getTranslations();

  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-2 gap-4">
          <MotoPlaceholder label={t("common.placeholderAlt")} className="col-span-2" />
          <MotoPlaceholder label={t("common.placeholderAlt")} />
          <MotoPlaceholder label={t("common.placeholderAlt")} />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("home.master.title")}
          </h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-muted">
            {t("home.master.subtitle")}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-muted">{t("home.master.text")}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {FACTS.map((key) => (
              <li
                key={key}
                className="rounded-md border border-line px-4 py-3 text-sm font-semibold"
              >
                {t(`home.master.facts.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
