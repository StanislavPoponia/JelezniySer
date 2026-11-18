import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { error } = await searchParams;
  const t = await getTranslations("auth");

  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold">{t("login.title")}</h1>
      <LoginForm initialError={error === "callbackFailed" ? error : undefined} />
    </>
  );
}
