import { getTranslations, setRequestLocale } from "next-intl/server";
import { CollectionGallery } from "@/components/collection/CollectionGallery";
import { PageHeader } from "@/components/ui/PageHeader";
import { getIsAdmin } from "@/lib/auth/is-admin";
import { getCollection } from "@/lib/collection/queries";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [items, isAdmin] = await Promise.all([getCollection(), getIsAdmin()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={t("collection.title")} intro={t("collection.intro")} />
      {items ? (
        <CollectionGallery items={items} isAdmin={isAdmin} />
      ) : (
        <p role="alert" className="py-12 text-center text-muted">
          {t("collection.error")}
        </p>
      )}
    </div>
  );
}
