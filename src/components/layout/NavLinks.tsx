import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContactsModal } from "@/components/contacts/ContactsModal";

type NavLinksProps = {
  orientation?: "row" | "column";
};

const linkClass =
  "rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground";

export async function NavLinks({ orientation = "row" }: NavLinksProps) {
  const t = await getTranslations("nav");
  const direction = orientation === "row" ? "flex-row items-center" : "flex-col items-stretch";

  return (
    <nav className={`flex gap-1 ${direction}`}>
      <ContactsModal className={`${linkClass} text-left`} />
      <Link href="/shop" className={linkClass}>
        {t("shop")}
      </Link>
      <Link href="/repair" className={linkClass}>
        {t("repair")}
      </Link>
      <Link href="/collection" className={linkClass}>
        {t("collection")}
      </Link>
    </nav>
  );
}
