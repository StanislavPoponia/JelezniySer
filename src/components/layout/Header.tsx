import { getTranslations } from "next-intl/server";
import { LogoLink } from "./LogoLink";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HeaderShell } from "./HeaderShell";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";

export async function Header() {
  const t = await getTranslations("common");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  return (
    <HeaderShell>
      {/* На ПК три колонки з однаковими краями, тому меню стоїть точно по центру хедера. */}
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-3 px-4 transition-[height] duration-300 group-data-[scrolled=true]:h-14 max-lg:group-data-[scrolled=true]:h-12 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <LogoLink>
            <Logo
              size={60}
              title={t("logoAlt")}
              className="h-[60px] w-[60px] transition-[width,height] duration-300 group-data-[scrolled=true]:h-[40px] group-data-[scrolled=true]:w-[40px] max-lg:group-data-[scrolled=true]:h-[36px] max-lg:group-data-[scrolled=true]:w-[36px]"
            />
          </LogoLink>
        </div>

        <div className="hidden lg:block">
          <NavLinks />
        </div>

        <div className="hidden justify-self-end lg:block">
          <UserMenu isLoggedIn={isLoggedIn} />
        </div>

        <div className="ml-auto lg:hidden">
          <MobileMenu>
            <NavLinks orientation="column" />
            <UserMenu isLoggedIn={isLoggedIn} orientation="column" />
          </MobileMenu>
        </div>
      </div>
    </HeaderShell>
  );
}
