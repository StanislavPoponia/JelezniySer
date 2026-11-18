import { setRequestLocale } from "next-intl/server";
import { AboutSection } from "@/components/home/AboutSection";
import { MasterSection } from "@/components/home/MasterSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutSection />
      <MasterSection />
    </>
  );
}
