"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { signIn } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormMessage } from "./FormMessage";

type LoginFormProps = {
  initialError?: string;
};

export function LoginForm({ initialError }: LoginFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, action, pending] = useActionState(signIn, null);
  const errorKey = state?.error ?? initialError;

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <Input label={t("email")} name="email" type="email" autoComplete="email" required />
      <Input
        label={t("password")}
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {errorKey && <FormMessage tone="error">{t(`errors.${errorKey}`)}</FormMessage>}
      <Button type="submit" variant="solid" disabled={pending}>
        {t("login.submit")}
      </Button>
      <div className="flex flex-col gap-1 text-sm text-muted">
        <Link href="/forgot-password" className="underline hover:text-foreground">
          {t("login.forgot")}
        </Link>
        <p>
          {t("login.noAccount")}{" "}
          <Link href="/register" className="text-foreground underline">
            {t("login.toRegister")}
          </Link>
        </p>
      </div>
    </form>
  );
}
