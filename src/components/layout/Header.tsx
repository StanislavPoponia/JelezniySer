import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";

export async function Header() {
  const t = await getTranslations("common");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  return (
    <header className="relative z-40 border-b border-line bg-black">
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <LanguageSwitcher />
        <Link href="/" aria-label="JS Moto" className="shrink-0">
          <Logo size={60} title={t("logoAlt")} />
        </Link>

        <div className="ml-auto hidden items-center gap-6 lg:flex">
          <NavLinks />
          <UserMenu isLoggedIn={isLoggedIn} />
        </div>

        <div className="ml-auto lg:hidden">
          <MobileMenu>
            <NavLinks orientation="column" />
            <UserMenu isLoggedIn={isLoggedIn} orientation="column" />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
