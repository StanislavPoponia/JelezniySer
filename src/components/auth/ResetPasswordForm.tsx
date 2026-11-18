"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { updatePassword } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormMessage } from "./FormMessage";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(updatePassword, null);

  if (state?.success) {
    return (
      <div className="flex flex-col gap-4">
        <FormMessage tone="success">{t("reset.done")}</FormMessage>
        <Link href="/" className="text-sm text-muted underline hover:text-foreground">
          {t("forgot.back")}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
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
        {t("reset.submit")}
      </Button>
    </form>
  );
}
