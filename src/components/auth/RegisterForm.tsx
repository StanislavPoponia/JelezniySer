"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { signUp } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormMessage } from "./FormMessage";

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, action, pending] = useActionState(signUp, null);

  if (state?.success) {
    return <FormMessage tone="success">{t("register.checkEmail")}</FormMessage>;
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <Input label={t("fullName")} name="fullName" type="text" autoComplete="name" />
      <Input label={t("email")} name="email" type="email" autoComplete="email" required />
      <Input
        label={t("password")}
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Input
        label={t("confirmPassword")}
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      {state?.error && (
        <FormMessage tone="error">{t(`errors.${state.error}`)}</FormMessage>
      )}
      <Button type="submit" variant="solid" disabled={pending}>
        {t("register.submit")}
      </Button>
      <p className="text-sm text-muted">
        {t("register.haveAccount")}{" "}
        <Link href="/login" className="text-foreground underline">
          {t("register.toLogin")}
        </Link>
      </p>
    </form>
  );
}
