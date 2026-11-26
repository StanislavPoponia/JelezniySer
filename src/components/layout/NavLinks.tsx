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
  // Зліва в пунктів є місце під колесо, тому для рівного центрування додаємо стільки ж справа:
  // у рядку — один відступ на все меню, у колонці — кожному пункту.
  const direction =
    orientation === "row"
      ? "flex-row items-center gap-3 pr-5.5 xl:gap-8"
      : "flex-col items-center gap-3 *:pr-7!";

  // Білі лінії між пунктами — лише в бургер-меню.
  const divider = orientation === "column" && (
    <span aria-hidden="true" className="h-px w-full bg-line-strong" />
  );

  return (
    <nav className={`flex ${direction}`}>
      <ContactsModal
        className={`group/nav relative ${linkClass} text-left`}
        labelClassName={navLabelClass}
        icon={<NavWheel />}
      />
      {divider}
      <NavLink href="/shop" className={linkClass}>
        {t("shop")}
      </NavLink>
      {divider}
      <NavLink href="/repair" className={linkClass}>
        {t("repair")}
      </NavLink>
      {divider}
      <NavLink href="/collection" className={linkClass}>
        {t("collection")}
      </NavLink>
    </nav>
  );
}
