import { getTranslations } from "next-intl/server";
import { ContactsModal } from "@/components/contacts/ContactsModal";
import { NavLink } from "./NavLink";
import { NavWheel } from "./NavWheel";
import { navLabelClass } from "./navLabel";

type NavLinksProps = {
  orientation?: "row" | "column";
};

const linkClass =
  "rounded-md py-2 pl-7 pr-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground aria-[current=page]:text-foreground";

export async function NavLinks({ orientation = "row" }: NavLinksProps) {
  const t = await getTranslations("nav");
  const direction = orientation === "row" ? "flex-row items-center" : "flex-col items-stretch";

  return (
    <nav className={`flex gap-1 ${direction}`}>
      <ContactsModal
        className={`group/nav relative ${linkClass} text-left`}
        labelClassName={navLabelClass}
        icon={<NavWheel />}
      />
      <NavLink href="/shop" className={linkClass}>
        {t("shop")}
      </NavLink>
      <NavLink href="/repair" className={linkClass}>
        {t("repair")}
      </NavLink>
      <NavLink href="/collection" className={linkClass}>
        {t("collection")}
      </NavLink>
    </nav>
  );
}
