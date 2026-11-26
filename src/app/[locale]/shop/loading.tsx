import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("shop");

  return (
    <p role="status" className="px-4 py-24 text-center text-muted">
      {t("loading")}
    </p>
  );
}
