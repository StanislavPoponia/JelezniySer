import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/ui/Logo";

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="border-t border-line bg-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 sm:px-6">
        <Logo size={64} title={t("common.logoAlt")} />
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} JS Moto. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
