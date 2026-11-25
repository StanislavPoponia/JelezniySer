import { getTranslations } from "next-intl/server";
import { ContactList } from "@/components/contacts/ContactList";
import { Logo } from "@/components/ui/Logo";
import { LogoSpin } from "./LogoSpin";

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="border-t border-line bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-12">
          <LogoSpin>
            <Logo size={96} title={t("common.logoAlt")} />
          </LogoSpin>
          <section aria-label={t("contacts.title")} className="w-full min-w-0 flex-1">
            <ContactList variant="footer" />
          </section>
        </div>
        <p className="border-t border-line pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} JS Moto. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
