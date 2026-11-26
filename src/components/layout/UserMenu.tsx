import { getLocale, getTranslations } from "next-intl/server";
import { signOut } from "@/lib/auth/actions";
import { buttonClassName } from "@/components/ui/Button";
import { NavLink } from "./NavLink";

type UserMenuProps = {
  isLoggedIn: boolean;
  orientation?: "row" | "column";
};

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6" />
    </svg>
  );
}

export async function UserMenu({ isLoggedIn, orientation = "row" }: UserMenuProps) {
  const t = await getTranslations("nav");
  const locale = await getLocale();
  // Кнопки завжди в один ряд; у бургер-меню (column) — по центру.
  const direction = orientation === "row" ? "flex-row items-center" : "flex-row items-center justify-center";

  if (!isLoggedIn) {
    return (
      <div className={`flex gap-2 ${direction}`}>
        <NavLink href="/login" className={buttonClassName("outline", "min-w-28")}>
          {t("login")}
        </NavLink>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${direction}`}>
      <NavLink href="/cart" className={buttonClassName("ghost", "min-w-28 pl-7 pr-3")}>
        <CartIcon />
        {t("cart")}
      </NavLink>
      <form action={signOut} className="contents">
        <input type="hidden" name="locale" value={locale} />
        <button type="submit" className={buttonClassName("outline", "min-w-28")}>
          {t("logout")}
        </button>
      </form>
    </div>
  );
}
