import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { ShopMessage } from "@/components/shop/ShopMessage";
import { PageHeader } from "@/components/ui/PageHeader";
import { getIsAdmin } from "@/lib/auth/is-admin";
import { getProducts } from "@/lib/products/queries";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [products, isAdmin] = await Promise.all([getProducts(), getIsAdmin()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={t("shop.title")} />
      {products ? (
        <ShopCatalog products={products} isAdmin={isAdmin} />
      ) : (
        <ShopMessage text={t("shop.error")} placeholderLabel={t("common.placeholderAlt")} />
      )}
    </div>
  );
}
