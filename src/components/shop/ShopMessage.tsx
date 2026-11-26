"use client";

import { ContactsModal } from "@/components/contacts/ContactsModal";
import { buttonClassName } from "@/components/ui/Button";
import { MotoPlaceholder } from "@/components/ui/MotoPlaceholder";

type ShopMessageProps = {
  text: string;
  placeholderLabel: string;
};

// Порожні стани магазину: малюнок, пояснення та кнопка «Контакти».
export function ShopMessage({ text, placeholderLabel }: ShopMessageProps) {
  return (
    <div className="mt-10 flex min-h-[35vh] flex-col items-center justify-center gap-5 text-center">
      <MotoPlaceholder label={placeholderLabel} className="w-full max-w-sm" />
      <p className="max-w-md text-balance text-lg text-muted">{text}</p>
      <ContactsModal className={buttonClassName("solid", "h-12 px-7")} />
    </div>
  );
}
