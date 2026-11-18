"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { requestPasswordReset } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormMessage } from "./FormMessage";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, action, pending] = useActionState(requestPasswordReset, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <p className="text-sm text-muted">{t("forgot.text")}</p>
      <Input label={t("email")} name="email" type="email" autoComplete="email" required />
      {state?.error && (
        <FormMessage tone="error">{t(`errors.${state.error}`)}</FormMessage>
      )}
      {state?.success && <FormMessage tone="success">{t("forgot.sent")}</FormMessage>}
      <Button type="submit" variant="solid" disabled={pending}>
        {t("forgot.submit")}
      </Button>
      <Link href="/login" className="text-sm text-muted underline hover:text-foreground">
        {t("forgot.back")}
      </Link>
    </form>
  );
}
