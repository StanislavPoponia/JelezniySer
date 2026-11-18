import { getTranslations } from "next-intl/server";
import { MotoPlaceholder } from "@/components/ui/MotoPlaceholder";

const POINTS = ["restoration", "repair", "diagnostics"] as const;

export async function AboutSection() {
  const t = await getTranslations();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        {t("home.about.title")}
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
        {t("home.about.text")}
      </p>

      <ul className="mt-6 flex flex-wrap gap-3">
        {POINTS.map((key) => (
          <li
            key={key}
            className="rounded-full border border-line-strong px-4 py-1.5 text-sm font-semibold"
          >
            {t(`home.about.points.${key}`)}
          </li>
        ))}
      </ul>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POINTS.map((key) => (
          <MotoPlaceholder key={key} label={t("common.placeholderAlt")} />
        ))}
      </div>
    </section>
  );
}
