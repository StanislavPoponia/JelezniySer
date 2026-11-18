import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormMessage } from "@/components/auth/FormMessage";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  // Сюди потрапляють за посиланням із листа: сесія вже створена в /auth/callback.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const hasSession = Boolean(data?.claims);

  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold">{t("reset.title")}</h1>
      {hasSession ? (
        <ResetPasswordForm />
      ) : (
        <div className="flex flex-col gap-4">
          <FormMessage tone="error">{t("errors.sessionMissing")}</FormMessage>
          <Link
            href="/forgot-password"
            className="text-sm text-muted underline hover:text-foreground"
          >
            {t("forgot.submit")}
          </Link>
        </div>
      )}
    </>
  );
}
